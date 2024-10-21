// Legacy SDK
import {
  ChainConfig as BaseChainConfig,
  ChainResourceMap,
  WormholeContext,
  WormholeConfig,
} from 'sdklegacy';

// SDKv2
import {
  Network,
  Wormhole as WormholeV2,
  Chain,
  AttestationReceipt,
  routes,
} from '@wormhole-foundation/sdk';

import {
  TransferDetails,
  TriggerEventHandler,
  WormholeConnectEventHandler,
} from 'telemetry/types';

import RouteOperator from 'routes/operator';
import { UiConfig } from './ui';
import { TransferInfo } from 'utils/sdkv2';
import { Token, TokenCache } from './tokens';

export enum TokenIcon {
  'AVAX' = 1,
  'BNB',
  'BSC',
  'CELO',
  'ETH',
  'FANTOM',
  'POLYGON',
  'SOLANA',
  'USDC',
  'GLMR',
  'DAI',
  'USDT',
  'BUSD',
  'WBTC',
  'SUI',
  'APT',
  'SEI',
  'BASE',
  'OSMO',
  'TBTC',
  'WSTETH',
  'ARBITRUM',
  'OPTIMISM',
  'ATOM',
  'EVMOS',
  'KUJI',
  'PYTH',
  'INJ',
  'KLAY',
  'NTT',
  'SCROLL',
  'BLAST',
  'XLAYER',
  'MANTLE',
  'WORLDCHAIN',
}

// Used in bridging components
export type TransferSide = 'source' | 'destination';

export interface ExtendedTransferDetails extends TransferDetails {
  fromWalletAddress: string;
  toWalletAddress: string;
}

export interface ValidateTransferResult {
  isValid: boolean;
  error?: string;
}

export type ValidateTransferHandler = (
  transferDetails: ExtendedTransferDetails,
) => Promise<ValidateTransferResult>;

export type IsRouteSupportedHandler = (
  transferDetails: TransferDetails,
) => Promise<boolean>;

// This is the integrator-provided config
export interface WormholeConnectConfig {
  network?: Network; // New name for this, consistent with SDKv2

  // External resources
  rpcs?: ChainResourceMap;
  rest?: ChainResourceMap;
  graphql?: ChainResourceMap;
  coinGeckoApiKey?: string;

  // White lists
  chains?: Chain[];
  tokens?: string[];
  routes?: routes.RouteConstructor<any>[];

  // Custom tokens
  tokensConfig?: TokensConfig;

  // Wormhole-wrapped token addresses
  wrappedTokens?: WrappedTokenAddresses;

  // Callbacks
  eventHandler?: WormholeConnectEventHandler;
  validateTransferHandler?: ValidateTransferHandler;
  isRouteSupportedHandler?: IsRouteSupportedHandler;

  // UI details
  ui?: UiConfig;
}

// This is the exported config value used throughout the code base
export interface InternalConfig<N extends Network> {
  network: N;
  // Cache. To be accessed via getWormholeContextV2(), not directly
  _v2Wormhole?: WormholeV2<N>;

  // Legacy TODO SDKV2 remove
  whLegacy: WormholeContext;

  sdkConfig: WormholeConfig;

  isMainnet: boolean;

  // External resources
  rpcs: ChainResourceMap;
  rest: ChainResourceMap;
  graphql: ChainResourceMap;
  mayanApi: string;
  wormholeApi: string;
  wormholeRpcHosts: string[];
  coinGeckoApiKey?: string;

  tokens: TokenCache;

  // White lists
  chains: ChainsConfig;
  chainsArr: ChainConfig[];
  tokensConfig?: TokensConfig;

  routes: RouteOperator;

  // Callbacks
  triggerEvent: TriggerEventHandler;
  validateTransfer?: ValidateTransferHandler;
  isRouteSupportedHandler?: IsRouteSupportedHandler;

  // UI configuration
  ui: UiConfig;

  guardianSet: GuardianSetData;
}

export type TokenConfig = {
  key: string;
  symbol: string;
  name?: string;
  decimals: number;
  icon: TokenIcon | string;
  tokenId: {
    chain: Chain;
    address: string;
  };
};

export type TokensConfig = { [key: string]: TokenConfig };

export interface ChainConfig extends BaseChainConfig {
  sdkName: Chain;
  displayName: string;
  explorerUrl: string;
  explorerName: string;
  gasToken: string;
  wrappedGasToken?: string;
  chainId: number | string;
  icon: Chain;
  maxBlockSearch: number;
  symbol?: string;
}

export type ChainsConfig = {
  [chain in Chain]?: ChainConfig;
};

export type RpcMapping = { [chain in Chain]?: string };

export type GuardianSetData = {
  index: number;
  keys: string[];
};

export type NetworkData = {
  chains: ChainsConfig;
  tokens: TokenConfig[];
  wrappedTokens: WrappedTokenAddresses;
  rpcs: RpcMapping;
  rest: RpcMapping;
  graphql: RpcMapping;
  guardianSet: GuardianSetData;
};

export type WrappedTokenAddresses = {
  [chain in Chain]?: {
    [address: string]: {
      [otherChain in Chain]?: string;
    };
  };
};

// Transactions in Transaction History view
export interface Transaction {
  // Transaction hash
  txHash: string;

  // Stringified addresses
  sender?: string;
  recipient: string;

  amount: string;
  amountUsd: number;
  receiveAmount: string;

  fromChain: Chain;
  fromToken: Token;

  toChain: Chain;
  toToken: Token;

  // Timestamps
  senderTimestamp: string;
  receiverTimestamp?: string;

  // Explorer link
  explorerLink: string;

  // In-progress status
  inProgress: boolean;
}

// Transaction data in local storage
export interface TransactionLocal {
  receipt: routes.Receipt<AttestationReceipt>;
  route: string;
  timestamp: number;
  txHash: string;
  txDetails: TransferInfo;
  isReadyToClaim?: boolean;
}
