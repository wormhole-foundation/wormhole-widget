import { CONFIG } from 'sdklegacy';
import { ChainsConfig, ChainIcon } from '../types';

const { chains } = CONFIG.DEVNET;

export const DEVNET_CHAINS: ChainsConfig = {
  Ethereum: {
    ...chains.Ethereum!,
    displayName: 'EVM',
    explorerUrl: '',
    explorerName: '',
    gasToken: 'ETH',
    chainId: 1,
    icon: ChainIcon.ETH,
    maxBlockSearch: 0,
    symbol: 'ETH',
  },
  Osmosis: {
    ...chains.Osmosis!,
    displayName: 'Osmosis',
    explorerUrl: '',
    explorerName: '',
    gasToken: 'OSMO',
    chainId: 'osmosis-1002',
    icon: ChainIcon.OSMO,
    maxBlockSearch: 0,
    symbol: 'OSMO',
  },
  Wormchain: {
    ...chains.Wormchain!,
    displayName: 'Wormchain',
    explorerUrl: '',
    explorerName: '',
    gasToken: 'WORM',
    chainId: 'wormchain-1',
    icon: ChainIcon.OSMO,
    maxBlockSearch: 0,
    symbol: 'OSMO',
  },
  Terra2: {
    ...chains.Terra2!,
    displayName: 'Terra',
    explorerUrl: '',
    explorerName: '',
    gasToken: 'LUNA',
    chainId: 'localterra',
    icon: ChainIcon.OSMO,
    maxBlockSearch: 0,
    symbol: 'OSMO',
  },
};
