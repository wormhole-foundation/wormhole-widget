import {
  ChainId,
  ChainName,
  TokenId,
} from '@wormhole-foundation/wormhole-connect-sdk';
import { TokenConfig } from 'config/types';
import { BigNumber } from 'ethers';
import {
  UnsignedMessage,
  SignedMessage,
  TransferDestInfoBaseParams,
  TransferDisplayData,
  TransferInfoBaseParams,
} from './types';

export default abstract class RouteAbstract {
  abstract readonly NATIVE_GAS_DROPOFF_SUPPORTED: boolean;
  abstract readonly AUTOMATIC_DEPOSIT: boolean;
  // protected abstract sendGasFallback: { [key: ChainName]: TokenConfig };
  // protected abstract claimGasFallback: { [key: ChainName]: TokenConfig };

  // Is this route available for the given network, token and amount specifications?
  public abstract isRouteAvailable(
    sourceToken: string,
    destToken: string,
    amount: string,
    sourceChain: ChainName | ChainId,
    destChain: ChainName | ChainId,
  ): Promise<boolean>;

  public abstract isSupportedSourceToken(
    token: TokenConfig | undefined,
    destToken: TokenConfig | undefined,
    sourceChain?: ChainName | ChainId,
    destChain?: ChainName | ChainId,
  ): Promise<boolean>;
  public abstract isSupportedDestToken(
    token: TokenConfig | undefined,
    sourceToken: TokenConfig | undefined,
    sourceChain?: ChainName | ChainId,
    destChain?: ChainName | ChainId,
  ): Promise<boolean>;

  public abstract supportedSourceTokens(
    tokens: TokenConfig[],
    destToken?: TokenConfig,
    sourceChain?: ChainName | ChainId,
    destChain?: ChainName | ChainId,
  ): Promise<TokenConfig[]>;
  public abstract supportedDestTokens(
    tokens: TokenConfig[],
    sourceToken?: TokenConfig,
    sourceChain?: ChainName | ChainId,
    destChain?: ChainName | ChainId,
  ): Promise<TokenConfig[]>;

  // Calculate the amount a user would receive if sending a certain amount
  public abstract computeReceiveAmount(
    sendAmount: number | undefined,
    routeOptions: any,
  ): Promise<number>;
  // Calculate the amount a user would need to send in order to receive a certain amount
  public abstract computeSendAmount(
    receiveAmount: number | undefined,
    routeOptions: any,
  ): Promise<number>;

  // Validate a transfer before sending via the chosen route
  public abstract validate(
    token: TokenId | 'native',
    amount: string,
    sendingChain: ChainName | ChainId,
    senderAddress: string,
    recipientChain: ChainName | ChainId,
    recipientAddress: string,
    routeOptions: any,
  ): Promise<boolean>;

  // estimate send gas fees
  public abstract estimateSendGas(
    token: TokenId | 'native',
    amount: string,
    sendingChain: ChainName | ChainId,
    senderAddress: string,
    recipientChain: ChainName | ChainId,
    recipientAddress: string,
    routeOptions?: any,
  ): Promise<BigNumber>;

  // estimate claim gas fees, return 0 if none
  public abstract estimateClaimGas(
    destChain: ChainName | ChainId,
    VAA?: Uint8Array,
  ): Promise<BigNumber>;

  /**
   * These operations have to be implemented in subclasses.
   */
  public abstract getMinSendAmount(routeOptions: any): number;

  public abstract send(
    token: TokenId | 'native',
    amount: string,
    sendingChain: ChainName | ChainId,
    senderAddress: string,
    recipientChain: ChainName | ChainId,
    recipientAddress: string,
    routeOptions: any,
  ): Promise<any>;

  public abstract redeem(
    destChain: ChainName | ChainId,
    messageInfo: SignedMessage,
    recipient: string,
  ): Promise<string>;

  public abstract getPreview(
    token: TokenConfig,
    destToken: TokenConfig,
    amount: number,
    sendingChain: ChainName | ChainId,
    receipientChain: ChainName | ChainId,
    sendingGasEst: string,
    claimingGasEst: string,
    routeOptions?: any,
  ): Promise<TransferDisplayData>;
  public abstract getTransferSourceInfo<T extends TransferInfoBaseParams>(
    params: T,
  ): Promise<TransferDisplayData>;
  public abstract getTransferDestInfo<T extends TransferDestInfoBaseParams>(
    params: T,
  ): Promise<TransferDisplayData>;

  // send, validate, estimate gas, isRouteAvailable, parse data from VAA/fetch data, claim

  abstract getNativeBalance(
    address: string,
    network: ChainName | ChainId,
  ): Promise<BigNumber | null>;
  abstract getTokenBalance(
    address: string,
    tokenId: TokenId,
    network: ChainName | ChainId,
  ): Promise<BigNumber | null>;

  abstract getRelayerFee(
    sourceChain: ChainName | ChainId,
    destChain: ChainName | ChainId,
    token: string,
  ): Promise<BigNumber>;

  abstract getForeignAsset(
    token: TokenId,
    chain: ChainName | ChainId,
  ): Promise<string | null>;

  abstract getMessage(
    tx: string,
    chain: ChainName | ChainId,
  ): Promise<UnsignedMessage>;
  abstract getSignedMessage(message: UnsignedMessage): Promise<SignedMessage>;

  abstract isTransferCompleted(
    destChain: ChainName | ChainId,
    messageInfo: SignedMessage,
  ): Promise<boolean>;

  // swap information (native gas slider)
  abstract nativeTokenAmount(
    destChain: ChainName | ChainId,
    token: TokenId,
    amount: BigNumber,
    walletAddress: string,
  ): Promise<BigNumber>;

  abstract maxSwapAmount(
    destChain: ChainName | ChainId,
    token: TokenId,
    walletAddress: string,
  ): Promise<BigNumber>;
}
