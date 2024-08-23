import { Chain } from '@wormhole-foundation/sdk';
import { WormholeConfig, Context, ChainConfig } from '../types';

const MAINNET: { [chain in Chain]?: ChainConfig } = {
  Ethereum: {
    key: 'Ethereum',
    id: 2,
    context: Context.ETH,
    finalityThreshold: 64,
    nativeTokenDecimals: 18,
    cctpDomain: 0,
  },
  Solana: {
    key: 'Solana',
    id: 1,
    context: Context.SOLANA,
    finalityThreshold: 32,
    nativeTokenDecimals: 9,
    cctpDomain: 5,
  },
  Polygon: {
    key: 'Polygon',
    id: 5,
    context: Context.ETH,
    finalityThreshold: 42,
    nativeTokenDecimals: 18,
    cctpDomain: 7,
  },
  Bsc: {
    key: 'Bsc',
    id: 4,
    context: Context.ETH,
    finalityThreshold: 3,
    nativeTokenDecimals: 18,
  },
  Avalanche: {
    key: 'Avalanche',
    id: 6,
    context: Context.ETH,
    finalityThreshold: 1,
    nativeTokenDecimals: 18,
    cctpDomain: 1,
  },
  Fantom: {
    key: 'Fantom',
    id: 10,
    context: Context.ETH,
    finalityThreshold: 1,
    nativeTokenDecimals: 18,
  },
  Celo: {
    key: 'Celo',
    id: 14,
    context: Context.ETH,
    finalityThreshold: 1,
    nativeTokenDecimals: 18,
  },
  Moonbeam: {
    key: 'Moonbeam',
    id: 16,
    context: Context.ETH,
    finalityThreshold: 1,
    nativeTokenDecimals: 18,
  },
  Sui: {
    key: 'Sui',
    id: 21,
    context: Context.SUI,
    finalityThreshold: 0,
    nativeTokenDecimals: 9,
  },
  Aptos: {
    key: 'Aptos',
    id: 22,
    context: Context.APTOS,
    finalityThreshold: 0,
    nativeTokenDecimals: 8,
  },
  Arbitrum: {
    key: 'Arbitrum',
    id: 23,
    context: Context.ETH,
    finalityThreshold: 0,
    nativeTokenDecimals: 18,
    cctpDomain: 3,
  },
  Optimism: {
    key: 'Optimism',
    id: 24,
    context: Context.ETH,
    finalityThreshold: 0,
    nativeTokenDecimals: 18,
    cctpDomain: 2,
  },
  Base: {
    key: 'Base',
    id: 30,
    context: Context.ETH,
    finalityThreshold: 0,
    nativeTokenDecimals: 18,
    cctpDomain: 6,
  },
  Klaytn: {
    key: 'Klaytn',
    id: 13,
    context: Context.ETH,
    finalityThreshold: 0,
    nativeTokenDecimals: 18,
  },
  Sei: {
    key: 'Sei',
    id: 32,
    context: Context.SEI,
    finalityThreshold: 0,
    nativeTokenDecimals: 6,
  },
  Scroll: {
    key: 'Scroll',
    id: 34,
    context: Context.ETH,
    finalityThreshold: 0,
    nativeTokenDecimals: 18,
  },
  Blast: {
    key: 'Blast',
    id: 36,
    context: Context.ETH,
    finalityThreshold: 0,
    nativeTokenDecimals: 18,
  },
  Xlayer: {
    key: 'Xlayer',
    id: 37,
    context: Context.ETH,
    finalityThreshold: 0,
    nativeTokenDecimals: 18,
  },
  Wormchain: {
    context: Context.COSMOS,
    key: 'Wormchain',
    id: 3104,
    finalityThreshold: 0,
    nativeTokenDecimals: 6,
  },
  Osmosis: {
    key: 'Osmosis',
    id: 20,
    context: Context.COSMOS,
    finalityThreshold: 0,
    nativeTokenDecimals: 6,
  },
  Cosmoshub: {
    key: 'Cosmoshub',
    id: 4000,
    context: Context.COSMOS,
    finalityThreshold: 0,
    nativeTokenDecimals: 6,
  },
  Evmos: {
    key: 'Evmos',
    id: 4001,
    context: Context.COSMOS,
    finalityThreshold: 0,
    nativeTokenDecimals: 18,
    disabledAsDestination: true,
  },
  Kujira: {
    key: 'Kujira',
    id: 4002,
    context: Context.COSMOS,
    finalityThreshold: 0,
    nativeTokenDecimals: 6,
  },
  Injective: {
    key: 'Injective',
    id: 19,
    context: Context.COSMOS,
    finalityThreshold: 0,
    nativeTokenDecimals: 18,
  },
} as const;

/**
 * default mainnet chain config
 */
const MAINNET_CONFIG: WormholeConfig = {
  env: 'mainnet',
  rpcs: {
    Ethereum: 'https://rpc.ankr.com/eth',
    Solana: 'https://solana-mainnet.rpc.extrnode.com',
    Polygon: 'https://rpc.ankr.com/polygon',
    Bsc: 'https://bscrpc.com',
    Avalanche: 'https://rpc.ankr.com/avalanche',
    Fantom: 'https://rpc.ankr.com/fantom',
    Celo: 'https://rpc.ankr.com/celo',
    Moonbeam: 'https://rpc.ankr.com/moonbeam',
    Sui: 'https://rpc.mainnet.sui.io',
    Aptos: 'https://fullnode.mainnet.aptoslabs.com/v1',
    Arbitrum: 'https://rpc.ankr.com/arbitrum',
    Optimism: 'https://rpc.ankr.com/optimism',
    Base: 'https://base.publicnode.com',
    Sei: '', // TODO: fill in
    Wormchain: 'https://wormchain-rpc.quickapi.com',
    Osmosis: 'https://osmosis-rpc.polkachu.com',
    Cosmoshub: 'https://cosmos-rpc.polkachu.com',
    Evmos: 'https://evmos-rpc.polkachu.com',
    Kujira: 'https://kujira-rpc.polkachu.com',
    Injective: 'https://injective-rpc.publicnode.com/', // TODO: use the library to get the correct rpc https://docs.ts.injective.network/querying/querying-api/querying-indexer-explorer#fetch-transaction-using-transaction-hash
    Klaytn: 'https://rpc.ankr.com/klaytn',
    Scroll: 'https://rpc.ankr.com/scroll',
    Blast: 'https://rpc.ankr.com/blast',
    Xlayer: 'https://rpc.xlayer.tech',
  },
  rest: {
    Sei: '',
    Evmos: 'https://evmos-api.polkachu.com',
    Injective: 'https://injective-api.polkachu.com',
  },
  graphql: {
    Aptos: 'https://indexer.mainnet.aptoslabs.com/v1/graphql',
  },
  chains: MAINNET,
  wormholeHosts: [
    'https://wormhole-v2-mainnet-api.certus.one',
    'https://wormhole-v2-mainnet-api.mcf.rocks',
    'https://wormhole-v2-mainnet-api.chainlayer.network',
    'https://wormhole-v2-mainnet-api.staking.fund',
  ],
};

export default MAINNET_CONFIG;
