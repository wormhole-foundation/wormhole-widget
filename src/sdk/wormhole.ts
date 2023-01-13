import { providers, Signer, BigNumberish, constants } from 'ethers';
import {
  Bridge,
  TokenImplementation__factory,
  Wormhole,
  NFTBridge,
} from '@certusone/wormhole-sdk/lib/cjs/ethers-contracts';
import { Network as Environment } from '@certusone/wormhole-sdk';
import { MultiProvider, Domain } from '@nomad-xyz/multi-provider';

import MAINNET_CONFIG, {
  MainnetChainName,
  MAINNET_CHAINS,
} from './config/MAINNET';
import TESTNET_CONFIG, {
  TestnetChainName,
  TESTNET_CHAINS,
} from './config/TESTNET';
import { WormholeConfig, ChainName, ChainId, Context } from './types';
import { WHContracts } from './contracts';
import { TokenId } from './types';
import { EthContext } from './envContexts/ethContext';
import { TerraContext } from './envContexts/terraContext';
import { InjectiveContext } from './envContexts/injectiveContext';
import { XplaContext } from './envContexts/xplaContext';
import { SolanaContext } from './envContexts/solanaContext';
import { NearContext } from './envContexts/nearContext';
import { AptosContext } from './envContexts/aptosContext';
import { AlgorandContext } from './envContexts/algorandContext';

/**
 * The WormholeContext manages connections to Wormhole Core, Bridge and NFT Bridge contracts.
 * It inherits from the {@link MultiProvider}, and ensures that its contracts
 * always use the latest registered providers and signers.
 *
 * For convenience, we've pre-constructed contexts for mainnet, testnet and devnet
 * deployments. These can be imported directly from the wormhole sdk.
 *
 * @example
 * // Set up mainnet and then access contracts as below:
 * const context = new WormholeContext('MAINNET');
 * let bridge = context.mustGetBridge('ethereum');
 *
 * // interact easily with any chain!
 * // supports EVM, Solana, Terra, etc
 * const tokenId = {
 *   chain: 'ethereum',
 *   address: '0x123...',
 * }
 * const receipt = context.send(
 *   tokenId,
 *   '10', // amount
 *   'ethereum', // sending chain
 *   '0x789...', // sender address
 *   'moonbeam', // destination chain
 *   '0x789..., // recipient address on destination chain
 * )
 */
export class WormholeContext extends MultiProvider<Domain> {
  protected _contracts: Map<ChainName, WHContracts>;
  readonly conf: WormholeConfig;

  constructor(env: Environment, conf?: WormholeConfig) {
    super();

    if (conf) {
      this.conf = conf;
    } else {
      this.conf = env === 'MAINNET' ? MAINNET_CONFIG : TESTNET_CONFIG;
    }

    this._contracts = new Map();

    for (const network of Object.keys(this.conf.rpcs)) {
      const n =
        env === 'MAINNET'
          ? (network as MainnetChainName)
          : (network as TestnetChainName);
      const chains = env === 'MAINNET' ? MAINNET_CHAINS : TESTNET_CHAINS;
      // register domain
      this.registerDomain({
        // @ts-ignore
        domain: chains[n],
        name: network,
      });
      // register RPC provider
      if (this.conf.rpcs[n]) {
        this.registerRpcProvider(network, this.conf.rpcs[n]!);
      }
      // set contracts
      // @ts-ignore
      const contracts = new WHContracts(env, n, this.conf.chains[n].contracts);
      this._contracts.set(n, contracts);
    }
  }

  get environment(): string {
    return this.conf.env;
  }

  /**
   * Register an ethers Provider for a specified domain.
   *
   * @param nameOrDomain A domain name or number.
   * @param provider An ethers Provider to be used by requests to that domain.
   */
  registerProvider(
    nameOrDomain: string | number,
    provider: providers.Provider,
  ): void {
    const domain = this.resolveDomain(nameOrDomain);
    super.registerProvider(domain, provider);
  }

  /**
   * Register an ethers Signer for a specified domain.
   *
   * @param nameOrDomain A domain name or number.
   * @param signer An ethers Signer to be used by requests to that domain.
   */
  registerSigner(nameOrDomain: string | number, signer: Signer): void {
    const domain = this.resolveDomain(nameOrDomain);
    super.registerSigner(domain, signer);
  }

  /**
   * Remove the registered ethers Signer from a domain. This function will
   * attempt to preserve any Provider that was previously connected to this
   * domain.
   *
   * @param nameOrDomain A domain name or number.
   */
  unregisterSigner(nameOrDomain: string | number): void {
    const domain = this.resolveDomain(nameOrDomain);
    super.unregisterSigner(domain);
  }

  /**
   * Clear all signers from all registered domains.
   */
  clearSigners(): void {
    super.clearSigners();
  }

  /**
   * Get the contracts for a given domain (or undefined)
   *
   * @param nameOrDomain A domain name or number.
   * @returns a {@link CoreContracts} object (or undefined)
   */
  getContracts(chain: ChainName | ChainId): WHContracts | undefined {
    const domain = this.resolveDomainName(chain) as ChainName;
    return this._contracts.get(domain);
  }

  /**
   * Get the {@link CoreContracts} for a given domain (or throw an error)
   *
   * @param nameOrDomain A domain name or number.
   * @returns a {@link CoreContracts} object
   * @throws if no {@link CoreContracts} object exists on that domain.
   */
  mustGetContracts(chain: ChainName | ChainId): WHContracts {
    const contracts = this.getContracts(chain);
    if (!contracts) {
      throw new Error(`Missing contracts for domain: ${chain}`);
    }
    return contracts;
  }

  getCore(chain: ChainName | ChainId): Wormhole | undefined {
    const contracts = this.mustGetContracts(chain);
    return contracts.core;
  }

  mustGetCore(chain: ChainName | ChainId): Wormhole {
    const coreContract = this.getCore(chain);
    if (!coreContract)
      throw new Error(`Wormhole core contract not found for ${chain}`);
    return coreContract;
  }

  getBridge(chain: ChainName | ChainId): Bridge | undefined {
    const contracts = this.mustGetContracts(chain);
    return contracts.bridge;
  }

  mustGetBridge(chain: ChainName | ChainId): Bridge {
    const bridgeContract = this.getBridge(chain);
    if (!bridgeContract)
      throw new Error(`Token bridge contract not found for ${chain}`);
    return bridgeContract;
  }

  getNftBridge(chain: ChainName | ChainId): NFTBridge | undefined {
    const contracts = this.mustGetContracts(chain);
    return contracts.nftBridge;
  }

  mustGetNftBridge(chain: ChainName | ChainId): NFTBridge {
    const nftBridgeContract = this.getNftBridge(chain);
    if (!nftBridgeContract)
      throw new Error(`NFT bridge contract not found for ${chain}`);
    return nftBridgeContract;
  }

  /**
   * Approves amount for bridge transfer. If no amount is specified, the max amount is approved
   *
   * @param token The tokenId (chain and address) of the token being sent
   * @param Amount The amount to approve. If absent, will approve the maximum amount
   * @throws If unable to get the signer or contracts
   */
  async approve(token: TokenId, amount?: BigNumberish, overrides?: any) {
    const signer = this.getSigner(token.chain);
    if (!signer) throw new Error(`No signer for ${token.chain}`);
    const senderAddress = await signer.getAddress();
    const tokenImplementation = TokenImplementation__factory.connect(
      token.address,
      signer,
    );
    if (!tokenImplementation)
      throw new Error(`token contract not available for ${token.address}`);

    const bridgeAddress = this.mustGetBridge(token.chain).address;
    const approved = await tokenImplementation.allowance(
      senderAddress,
      bridgeAddress,
    );
    const approveAmount = amount || constants.MaxUint256;
    // Approve if necessary
    if (approved.lt(approveAmount)) {
      const tx = await tokenImplementation.approve(
        bridgeAddress,
        approveAmount,
        overrides,
      );
      await tx.wait();
    }
  }

  getContext(
    chain: ChainName | ChainId,
  ):
    | EthContext<WormholeContext>
    | TerraContext<WormholeContext>
    | InjectiveContext<WormholeContext>
    | XplaContext<WormholeContext>
    | SolanaContext<WormholeContext>
    | NearContext<WormholeContext>
    | AptosContext<WormholeContext>
    | AlgorandContext<WormholeContext> {
    const chainName = this.resolveDomainName(chain) as ChainName;
    const { context } = this.conf.chains[chainName]!;
    switch (context) {
      case Context.ETH: {
        return new EthContext(this);
      }
      case Context.TERRA: {
        return new TerraContext(this);
      }
      case Context.INJECTIVE: {
        return new InjectiveContext(this);
      }
      case Context.XPLA: {
        return new XplaContext(this);
      }
      case Context.SOLANA: {
        return new SolanaContext(this);
      }
      case Context.ALGORAND: {
        return new AlgorandContext(this);
      }
      case Context.NEAR: {
        return new NearContext(this);
      }
      case Context.APTOS: {
        return new AptosContext(this);
      }
      default: {
        throw new Error('Not able to retrieve context');
      }
    }
  }

  /**
   * Sends transaction to the bridge
   *
   * @param tokenId The tokenId (chain and address) of the token being sent. Pass in 'native' to send native token
   * @param Amount The amount to approve. If absent, will approve the maximum amount
   * @throws If unable to get the signer or contracts
   */
  async send(
    token: TokenId | 'native',
    amount: string,
    sendingChain: ChainName | ChainId,
    senderAddress: string,
    recipientChain: ChainName | ChainId,
    recipientAddress: string,
    relayerFee?: string,
    payload?: any,
    overrides?: any,
  ) {
    const context = this.getContext(sendingChain);
    context.send(
      token,
      amount,
      sendingChain,
      senderAddress,
      recipientChain,
      recipientAddress,
      relayerFee,
    );
  }

  /**
   * Fetch a config from the Nomad config static site.
   *
   * @param environment the environment name to attempt to fetch
   * @returns A NomadConfig
   * @throws If the site is down, the config is not on the site, or the config
   *         is not of a valid format
   */
  static async getConfig(env: Environment): Promise<WormholeConfig> {
    return env === 'MAINNET' ? MAINNET_CONFIG : TESTNET_CONFIG;
  }
}
