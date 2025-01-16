import { CONFIG } from 'sdklegacy';
import { ChainsConfig } from '../types';

const { chains } = CONFIG.DEVNET;

export const DEVNET_CHAINS: ChainsConfig = {
  Ethereum: {
    ...chains.Ethereum!,
    sdkName: 'Ethereum',
    displayName: 'EVM',
    explorerUrl: '',
    explorerName: '',
    gasToken: 'ETH',
    wrappedGasToken: '0xDDb64fE46a91D46ee29420539FC25FD07c5FEa3E',
    chainId: 1,
    icon: 'Ethereum',
    maxBlockSearch: 0,
    symbol: 'ETH',
  },
  Osmosis: {
    ...chains.Osmosis!,
    displayName: 'Osmosis',
    sdkName: 'Osmosis',
    explorerUrl: '',
    explorerName: '',
    gasToken: 'OSMO',
    wrappedGasToken: '',
    chainId: 'osmosis-1002',
    icon: 'Osmosis',
    maxBlockSearch: 0,
    symbol: 'OSMO',
  },
  Wormchain: {
    ...chains.Wormchain!,
    sdkName: 'Wormchain',
    displayName: 'Wormchain',
    explorerUrl: '',
    explorerName: '',
    gasToken: 'WORM',
    wrappedGasToken: '',
    chainId: 'wormchain-1',
    icon: 'Osmosis',
    maxBlockSearch: 0,
    symbol: 'OSMO',
  },
  Terra2: {
    ...chains.Terra2!,
    sdkName: 'Terra2',
    displayName: 'Terra',
    explorerUrl: '',
    explorerName: '',
    gasToken: 'LUNA',
    wrappedGasToken: '',
    chainId: 'localterra',
    icon: 'Terra2',
    maxBlockSearch: 0,
    symbol: 'OSMO',
  },
};
