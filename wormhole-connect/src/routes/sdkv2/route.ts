import {
  Chain,
  ChainContext,
  Network,
  Wormhole,
  routes,
  chainToPlatform,
  isSameToken,
  TokenId as TokenIdV2,
  TransferState,
  TransactionId,
  isNative,
} from '@wormhole-foundation/sdk';
import { TokenConfig } from 'config/types';
import { getTokenBridgeWrappedTokenAddressSync } from 'utils/sdkv2';

import { SDKv2Signer } from './signer';

import { amount as sdkAmount } from '@wormhole-foundation/sdk';
import config, { getWormholeContextV2 } from 'config';
import {
  getGasToken,
  getWrappedToken,
  getWrappedTokenId,
  isFrankensteinToken,
  isWrappedToken,
  sleep,
} from 'utils';
import { ConnectedWallet } from 'utils/wallet/wallet';

type Amount = sdkAmount.Amount;

// =^o^=
export class SDKv2Route {
  // TODO: remove this
  IS_TOKEN_BRIDGE_ROUTE = false;

  constructor(readonly rc: routes.RouteConstructor) {
    this.IS_TOKEN_BRIDGE_ROUTE = [
      'ManualTokenBridge',
      'AutomaticTokenBridge',
      'CosmosGateway',
    ].includes(rc.meta.name);
  }

  get AUTOMATIC_DEPOSIT() {
    return this.rc.IS_AUTOMATIC;
  }

  get NATIVE_GAS_DROPOFF_SUPPORTED() {
    return this.rc.NATIVE_GAS_DROPOFF_SUPPORTED;
  }

  async getV2ChainContext<C extends Chain>(
    chain: C,
  ): Promise<{ chain: C; context: ChainContext<Network, C> }> {
    const wh = await getWormholeContextV2();
    const context = wh
      .getPlatform(chainToPlatform(chain))
      .getChain(chain) as ChainContext<Network, C>;
    return {
      chain,
      context,
    };
  }

  async isRouteSupported(
    sourceToken: string,
    destToken: string,
    fromChain: Chain,
    toChain: Chain,
  ): Promise<boolean> {
    const fromContext = await this.getV2ChainContext(fromChain);
    const toContext = await this.getV2ChainContext(toChain);

    const supportedChains = this.rc.supportedChains(config.network);

    const fromChainSupported = supportedChains.includes(fromContext.chain);
    const toChainSupported = supportedChains.includes(toContext.chain);

    const fromTokenIdV2 = await config.sdkConverter.getTokenIdV2ForKey(
      sourceToken,
      fromChain,
      config.tokens,
    );
    const toTokenIdV2 = await config.sdkConverter.getTokenIdV2ForKey(
      destToken,
      toChain,
      config.tokens,
    );

    if (!fromTokenIdV2 || !toTokenIdV2) return false;

    // Do not allow tokens supported by NTT to be bridged via the token bridge
    if (
      this.IS_TOKEN_BRIDGE_ROUTE &&
      (await isNttSupportedToken(
        fromTokenIdV2,
        fromContext.context,
        toContext.context,
      ))
    ) {
      return false;
    }

    const fromTokenSupported = !!(
      await this.rc.supportedSourceTokens(fromContext.context)
    ).find((tokenId) => {
      return isSameToken(tokenId, fromTokenIdV2);
    });

    const supportedDestinationTokens = await this.rc.supportedDestinationTokens(
      fromTokenIdV2,
      fromContext.context,
      toContext.context,
    );

    const toTokenSupported = !!supportedDestinationTokens.find((tokenId) => {
      let _toTokenIdV2 = toTokenIdV2;
      if (this.IS_TOKEN_BRIDGE_ROUTE && isNative(toTokenIdV2.address)) {
        // the SDK does not return the dest token with its address set to 'native'
        // so we need to get the wrapped token address and compare that
        const gasToken = getWrappedTokenId(getGasToken(toChain));
        _toTokenIdV2 = config.sdkConverter.tokenIdV2(toChain, gasToken.address);
      }
      return isSameToken(tokenId, _toTokenIdV2);
    });

    const isSupported =
      fromChainSupported &&
      toChainSupported &&
      fromTokenSupported &&
      toTokenSupported;

    return isSupported;
  }

  isSupportedChain(chain: Chain): boolean {
    return this.rc.supportedChains(config.network).includes(chain);
  }

  async supportedSourceTokens(
    tokens: TokenConfig[],
    _destToken?: TokenConfig | undefined,
    fromChain?: Chain | undefined,
    _destChain?: Chain | undefined,
  ): Promise<TokenConfig[]> {
    if (!fromChain) return [];

    const fromContext = await this.getV2ChainContext(fromChain);
    return (await this.rc.supportedSourceTokens(fromContext.context))
      .map((t: TokenIdV2) => config.sdkConverter.findTokenConfigV1(t, tokens))
      .filter((tc) => tc != undefined) as TokenConfig[];
  }

  async supportedDestTokens(
    tokens: TokenConfig[],
    sourceToken: TokenConfig | undefined,
    fromChain?: Chain | undefined,
    toChain?: Chain | undefined,
  ): Promise<TokenConfig[]> {
    if (!fromChain || !toChain || !sourceToken) return [];

    if (this.IS_TOKEN_BRIDGE_ROUTE) {
      if (this.isIlliquidDestToken(sourceToken, toChain)) {
        return [];
      }
    }

    const fromContext = await this.getV2ChainContext(fromChain);
    const toContext = await this.getV2ChainContext(toChain);
    const sourceTokenV2 = config.sdkConverter.toTokenIdV2(
      sourceToken,
      fromChain,
    );

    const destTokenIds = await this.rc.supportedDestinationTokens(
      sourceTokenV2,
      fromContext.context,
      toContext.context,
    );

    // TODO SDKV2 hack
    //
    // SDKv2 only returns token addresses, not metadata like names and logos.
    //
    // For custom tokens with no built-in foreign asset addresses, this means
    // we can't match the result of supportedDestinationTokens back up to a TokenConfig
    // to get its name and logo.
    //
    // Since token bridge only outputs the same token as you put in, we're just
    // returning sourceToken here as a hack so that we can maintain the name and logo.
    //
    // A longer term solution to this might be to add methods to SDKv2 for fetching token
    // metadata like name/logo and not relying on configuration for this at all. At that
    // point all that would be required would be an address.
    if (this.IS_TOKEN_BRIDGE_ROUTE && destTokenIds.length > 0) {
      const isWrapped = isWrappedToken(sourceToken, toChain);
      const wrappedTokenAddress = getTokenBridgeWrappedTokenAddressSync(
        getWrappedToken(sourceToken),
        toChain,
      );
      if (isWrapped && !wrappedTokenAddress) {
        // The wrapped token must have a foreign address configured,
        // otherwise don't support it
        return [];
      }
      return [getWrappedToken(sourceToken)];
    }

    return destTokenIds
      .map((t: TokenIdV2): TokenConfig | undefined =>
        config.sdkConverter.findTokenConfigV1(t, tokens),
      )
      .filter((tc) => tc != undefined) as TokenConfig[];
  }

  async getQuote(
    amount: Amount,
    sourceTokenV1: string,
    destTokenV1: string,
    sourceChain: Chain,
    destChain: Chain,
    options?: routes.AutomaticTokenBridgeRoute.Options,
  ): Promise<
    [
      routes.Route<Network>,
      routes.QuoteResult<routes.Options>,
      routes.RouteTransferRequest<Network>,
    ]
  > {
    const req = await this.createRequest(
      amount,
      sourceTokenV1,
      destTokenV1,
      sourceChain,
      destChain,
    );
    const wh = await getWormholeContextV2();
    const route = new this.rc(wh);
    const validationResult = await route.validate(req, {
      amount: sdkAmount.display(amount),
      options,
    });

    if (!validationResult.valid) {
      throw validationResult.error;
    }

    const quote = await route.quote(req, validationResult.params);

    return [route, quote, req];
  }

  async createRequest(
    amount: Amount,
    sourceTokenV1: string,
    destTokenV1: string,
    sourceChain: Chain,
    destChain: Chain,
  ): Promise<routes.RouteTransferRequest<Network>> {
    const sourceTokenV2: TokenIdV2 | undefined =
      await config.sdkConverter.getTokenIdV2ForKey(
        sourceTokenV1,
        sourceChain,
        config.tokens,
      );

    const destTokenV2: TokenIdV2 | undefined =
      await config.sdkConverter.getTokenIdV2ForKey(
        destTokenV1,
        destChain,
        config.tokens,
      );

    if (sourceTokenV2 === undefined) {
      throw new Error(`Failed to find TokenId for ${sourceTokenV1}`);
    }
    if (destTokenV2 === undefined) {
      throw new Error(`Failed to find TokenId for ${destTokenV1}`);
    }

    const sourceContext = (await this.getV2ChainContext(sourceChain)).context;
    const destContext = (await this.getV2ChainContext(destChain)).context;

    const wh = await getWormholeContextV2();
    const req = await routes.RouteTransferRequest.create(
      wh,
      /* @ts-ignore */
      {
        source: sourceTokenV2,
        destination: destTokenV2,
      },
      sourceContext,
      destContext,
    );
    return req;
  }

  async computeReceiveAmount(
    amountIn: Amount,
    sourceToken: string,
    destToken: string,
    fromChain: Chain | undefined,
    toChain: Chain | undefined,
    options?: routes.AutomaticTokenBridgeRoute.Options,
  ): Promise<Amount> {
    if (!fromChain || !toChain)
      throw new Error('Need both chains to get a quote from SDKv2');

    const [, quote] = await this.getQuote(
      amountIn,
      sourceToken,
      destToken,
      fromChain,
      toChain,
      options,
    );

    if (quote.success) {
      return quote.destinationToken.amount;
    } else {
      throw quote.error;
    }
  }

  async computeQuote(
    amountIn: Amount,
    sourceToken: string,
    destToken: string,
    fromChain: Chain,
    toChain: Chain,
    options?: routes.AutomaticTokenBridgeRoute.Options,
  ): Promise<routes.QuoteResult<routes.Options>> {
    if (!fromChain || !toChain)
      throw new Error('Need both chains to get a quote from SDKv2');

    const [, quote] = await this.getQuote(
      amountIn,
      sourceToken,
      destToken,
      fromChain,
      toChain,
      options,
    );

    if (!quote.success) {
      throw quote.error;
    }

    return quote;
  }

  async send(
    sourceToken: TokenConfig,
    amount: Amount,
    fromChain: Chain,
    senderAddress: string,
    toChain: Chain,
    recipientAddress: string,
    destToken: string,
    sendingWallet: ConnectedWallet,
    options?: routes.AutomaticTokenBridgeRoute.Options,
  ): Promise<[routes.Route<Network>, routes.Receipt]> {
    const [route, quote, req] = await this.getQuote(
      amount,
      sourceToken.key,
      destToken,
      fromChain,
      toChain,
      options,
    );

    if (!quote.success) {
      throw quote.error;
    }

    const signer = await SDKv2Signer.fromChain(
      fromChain,
      senderAddress,
      {},
      sendingWallet,
    );

    let receipt = await route.initiate(
      req,
      signer,
      quote,
      Wormhole.chainAddress(toChain, recipientAddress),
    );

    // Don't call track if the transfer is already in a final state
    // since track can update the receipt to a different state
    if (
      receipt.state === TransferState.SourceInitiated ||
      receipt.state === TransferState.SourceFinalized
    ) {
      return [route, receipt];
    }

    // Otherwise track the transfer until it reaches a final state,
    // retrying up to 5 times if there are errors with exponential backoff
    let retries = 0;
    const maxRetries = 5;
    const baseDelay = 1000; // Initial delay of 1 second

    while (retries < maxRetries) {
      try {
        for await (receipt of route.track(receipt, 120 * 1000)) {
          if (receipt.state >= TransferState.SourceInitiated) {
            return [route, receipt];
          }
        }
      } catch (e) {
        console.error(
          `Error tracking transfer (attempt ${retries + 1} / ${maxRetries}):`,
          e,
        );
        const delay = baseDelay * Math.pow(2, retries); // Exponential backoff
        await sleep(delay);
        retries++;
      }
    }

    throw new Error('Never got a SourceInitiated state in receipt');
  }

  async resumeIfManual(tx: TransactionId): Promise<routes.Receipt | null> {
    const wh = await getWormholeContextV2();
    const route = new this.rc(wh);
    if (routes.isManual(route) || routes.isFinalizable(route)) {
      return route.resume(tx);
    } else {
      return null;
    }
  }

  // Prevent receiving illiquid wormhole-wrapped tokens
  // This is not a perfect solution or an exhaustive list of all illiquid tokens,
  // but it should cover the most common cases
  isIlliquidDestToken(token: TokenConfig, toChain: Chain): boolean {
    const { symbol, nativeChain } = token;

    if (isFrankensteinToken(token, toChain)) {
      return true;
    }

    // These chains have a native bridge to/from Ethereum, so receiving wormhole-wrapped ETH is not necessary
    if (
      ['ETH', 'WETH'].includes(symbol) &&
      nativeChain === 'Ethereum' &&
      (['Scroll', 'Blast', 'Xlayer', 'Mantle'] as Chain[]).includes(toChain)
    ) {
      return true;
    }

    return false;
  }
}

// returns true if the token is supported by a NTT route, false otherwise
const isNttSupportedToken = async (
  token: TokenIdV2,
  fromContext: ChainContext<Network, Chain>,
  toContext: ChainContext<Network, Chain>,
): Promise<boolean> => {
  const checkRouteSupport = async (routeName: string): Promise<boolean> => {
    const route: SDKv2Route | undefined = config.routes.get(routeName);
    if (!route) return false;

    const [sourceTokens, destTokens] = await Promise.all([
      route.rc.supportedSourceTokens(fromContext),
      route.rc.supportedDestinationTokens(token, fromContext, toContext),
    ]);

    const isSourceTokenSupported = sourceTokens.some((t) =>
      isSameToken(t, token),
    );

    return isSourceTokenSupported && destTokens.length > 0;
  };

  const [isManualSupported, isAutomaticSupported] = await Promise.all([
    checkRouteSupport('ManualNtt'),
    checkRouteSupport('AutomaticNtt'),
  ]);

  return isManualSupported || isAutomaticSupported;
};
