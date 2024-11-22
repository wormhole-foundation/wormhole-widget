import { type ChainResourceMap } from '@wormhole-foundation/wormhole-connect-sdk';
import { Wallet } from '@xlabs-libs/wallet-aggregator-core';
import {
  EVMWallet,
  InjectedWallet,
  BinanceWallet,
  WalletConnectWallet,
  DEFAULT_CHAINS,
} from '@xlabs-libs/wallet-aggregator-evm';
import config from 'config';

const isChainResourceKey = (key: string): key is keyof ChainResourceMap =>
  Object.keys(config.rpcs).includes(key);

type ChainRpcUrls = (typeof DEFAULT_CHAINS)[0]['rpcUrls']['default'];

const getRpcForChain = (
  wormholeChainName: string,
  defaultRpc: ChainRpcUrls,
): ChainRpcUrls =>
  wormholeChainName in config.rpcs &&
  isChainResourceKey(wormholeChainName) &&
  config.rpcs[wormholeChainName] !== null &&
  config.rpcs[wormholeChainName] !== undefined &&
  config.rpcs[wormholeChainName] !== ''
    ? { ...defaultRpc, http: [config.rpcs[wormholeChainName]!] }
    : defaultRpc;

/**
 * Should be used to coalesce a wagmi chain name to a wormhole chain name.
 * This is necessary because the wormhole chain names are different from the wagmi chain names.
 *
 * @param name a wagmi chain name
 * @returns a wormhole chain name
 *
 * NOTE: mapping could be incomplete
 */
const coalesceWormholeChainName = (name: string) =>
  ({
    'bnb smart chain': 'bsc',
  }[name] || name);

const WAGMI_CONFIG_FOR_CHAINS = DEFAULT_CHAINS.map((wagmiConfig) => ({
  ...wagmiConfig,
  rpcUrls: {
    ...wagmiConfig.rpcUrls,
    default: getRpcForChain(
      coalesceWormholeChainName(wagmiConfig.name.toLowerCase()),
      wagmiConfig.rpcUrls.default,
    ),
    public: getRpcForChain(
      coalesceWormholeChainName(wagmiConfig.name.toLowerCase()),
      wagmiConfig.rpcUrls.public,
    ),
  },
}));

export const wallets = {
  injected: new InjectedWallet({
    chains: WAGMI_CONFIG_FOR_CHAINS,
  }),
  binance: new BinanceWallet({
    options: {},
  }),
  ...(config.walletConnectProjectId
    ? {
        walletConnect: new WalletConnectWallet({
          chains: WAGMI_CONFIG_FOR_CHAINS,
          connectorOptions: {
            projectId: config.walletConnectProjectId,
          },
        }),
      }
    : {}),
};

export interface AssetInfo {
  address: string;
  symbol: string;
  decimals: number;
  chainId?: number;
}

export const watchAsset = async (asset: AssetInfo, wallet: Wallet) => {
  const w = wallet as EVMWallet;
  // check in case the actual type is not EVMWallet
  if (!w || !w.watchAsset) return;
  await w.watchAsset({
    type: 'ERC20',
    options: asset,
  });
};

export async function switchChain(w: Wallet, chainId: number | string) {
  await (w as EVMWallet).switchChain(chainId as number);
}
