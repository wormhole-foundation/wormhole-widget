import { CONFIG } from 'sdklegacy';
import { ChainsConfig, ChainIcon } from '../types';

const { chains } = CONFIG.MAINNET;

export const MAINNET_CHAINS: ChainsConfig = {
  Ethereum: {
    ...chains.Ethereum!,
    displayName: 'Ethereum',
    explorerUrl: 'https://etherscan.io/',
    explorerName: 'Etherscan',
    gasToken: 'ETH',
    chainId: 1,
    icon: ChainIcon.ETH,
    maxBlockSearch: 2000,
    symbol: 'ETH',
  },
  Bsc: {
    ...chains.Bsc!,
    displayName: 'BSC',
    explorerUrl: 'https://bscscan.com/',
    explorerName: 'BscScan',
    gasToken: 'BNB',
    chainId: 56,
    icon: ChainIcon.BSC,
    maxBlockSearch: 2000,
    symbol: 'BSC',
  },
  Polygon: {
    ...chains.Polygon!,
    displayName: 'Polygon',
    explorerUrl: 'https://polygonscan.com/',
    explorerName: 'PolygonScan',
    gasToken: 'POL',
    chainId: 137,
    icon: ChainIcon.POLYGON,
    maxBlockSearch: 1000,
    symbol: 'POL',
  },
  Avalanche: {
    ...chains.Avalanche!,
    displayName: 'Avalanche',
    explorerUrl: 'https://avascan.info/blockchain/c/',
    explorerName: 'Avascan',
    gasToken: 'AVAX',
    chainId: 43114,
    icon: ChainIcon.AVAX,
    maxBlockSearch: 2000,
    symbol: 'AVAX',
  },
  Fantom: {
    ...chains.Fantom!,
    displayName: 'Fantom',
    explorerUrl: 'https://ftmscan.com/',
    explorerName: 'FTMscan',
    gasToken: 'FTM',
    chainId: 250,
    icon: ChainIcon.FANTOM,
    maxBlockSearch: 2000,
    symbol: 'FTM',
  },
  Celo: {
    ...chains.Celo!,
    displayName: 'Celo',
    explorerUrl: 'https://explorer.celo.org/mainnet/',
    explorerName: 'Celo Explorer',
    gasToken: 'CELO',
    chainId: 42220,
    icon: ChainIcon.CELO,
    maxBlockSearch: 2000,
    symbol: 'CELO',
  },
  Moonbeam: {
    ...chains.Moonbeam!,
    displayName: 'Moonbeam',
    explorerUrl: 'https://moonscan.io/',
    explorerName: 'Moonscan',
    gasToken: 'GLMR',
    chainId: 1284,
    icon: ChainIcon.GLMR,
    maxBlockSearch: 2000,
    symbol: 'GLMR',
  },
  Solana: {
    ...chains.Solana!,
    displayName: 'Solana',
    explorerUrl: 'https://explorer.solana.com/',
    explorerName: 'Solana Explorer',
    gasToken: 'SOL',
    chainId: 0,
    icon: ChainIcon.SOLANA,
    maxBlockSearch: 2000,
    symbol: 'SOL',
  },
  Sui: {
    ...chains.Sui!,
    displayName: 'Sui',
    explorerUrl: 'https://suiscan.xyz/',
    explorerName: 'Suiscan',
    gasToken: 'SUI',
    chainId: 0,
    icon: ChainIcon.SUI,
    maxBlockSearch: 0,
    symbol: 'SUI',
  },
  Aptos: {
    ...chains.Aptos!,
    displayName: 'Aptos',
    explorerUrl: 'https://explorer.aptoslabs.com/',
    explorerName: 'Aptos Explorer',
    gasToken: 'APT',
    chainId: 0,
    icon: ChainIcon.APT,
    maxBlockSearch: 0,
    symbol: 'APT',
  },
  Base: {
    ...chains.Base!,
    displayName: 'Base',
    explorerUrl: 'https://basescan.org/',
    explorerName: 'BaseScan',
    gasToken: 'ETHbase',
    chainId: 8453,
    icon: ChainIcon.BASE,
    maxBlockSearch: 2000,
    symbol: 'BASE',
  },
  // TODO: SDKV2 - re-enable cosmos chains once cosmos gateway route is implemented
  //Osmosis: {
  //  ...chains.Osmosis!,
  //  displayName: 'Osmosis',
  //  explorerUrl: 'https://mintscan.io/osmosis/',
  //  explorerName: 'MintScan',
  //  gasToken: 'OSMO',
  //  chainId: 'osmosis-1',
  //  icon: ChainIcon.OSMO,
  //  maxBlockSearch: 0,
  //},
  //Wormchain: {
  //  ...chains.Wormchain!,
  //  displayName: 'Wormchain',
  //  explorerUrl: '',
  //  explorerName: '',
  //  gasToken: 'WORM',
  //  chainId: '',
  //  icon: ChainIcon.OSMO,
  //  maxBlockSearch: 0,
  //},
  Arbitrum: {
    ...chains.Arbitrum!,
    displayName: 'Arbitrum',
    explorerUrl: 'https://arbiscan.io/',
    explorerName: 'Arbitrum Explorer',
    gasToken: 'ETHarbitrum',
    chainId: 42161,
    icon: ChainIcon.ARBITRUM,
    maxBlockSearch: 2000,
    symbol: 'ARB',
  },
  Optimism: {
    ...chains.Optimism!,
    displayName: 'Optimism',
    explorerUrl: 'https://optimistic.etherscan.io/',
    explorerName: 'Optimistic Etherscan',
    gasToken: 'ETHoptimism',
    chainId: 10,
    icon: ChainIcon.OPTIMISM,
    maxBlockSearch: 2000,
    symbol: 'OP',
  },
  Klaytn: {
    ...chains.Klaytn!,
    displayName: 'Kaia',
    explorerUrl: 'https://kaiascope.com/',
    explorerName: 'Kaia Scope',
    gasToken: 'KLAY',
    chainId: 8217,
    icon: ChainIcon.KLAY,
    maxBlockSearch: 2000,
    symbol: 'KLAY',
  },
  //Evmos: {
  //  ...chains.Evmos!,
  //  displayName: 'Evmos',
  //  explorerUrl: 'https://www.mintscan.io/evmos/',
  //  explorerName: 'MintScan',
  //  gasToken: 'EVMOS',
  //  chainId: 'evmos_9001-2',
  //  icon: ChainIcon.EVMOS,
  //  maxBlockSearch: 0,
  //},
  //Kujira: {
  //  ...chains.Kujira!,
  //  displayName: 'Kujira',
  //  explorerUrl: 'https://finder.kujira.app/kaiyo-1/',
  //  explorerName: 'Kujira Finder',
  //  gasToken: 'KUJI',
  //  chainId: 'kaiyo-1',
  //  icon: ChainIcon.KUJI,
  //  maxBlockSearch: 0,
  //},
  //Injective: {
  //  ...chains.Injective!,
  //  displayName: 'Injective',
  //  explorerUrl: 'https://explorer.injective.network/',
  //  explorerName: 'Injective Explorer',
  //  gasToken: 'INJ',
  //  chainId: 'injective-1',
  //  icon: ChainIcon.INJ,
  //  maxBlockSearch: 0,
  //},
  Scroll: {
    ...chains.Scroll!,
    displayName: 'Scroll',
    explorerUrl: 'https://scrollscan.com/',
    explorerName: 'Scrollscan',
    gasToken: 'ETHscroll',
    chainId: 534352,
    icon: ChainIcon.SCROLL,
    maxBlockSearch: 2000,
    symbol: 'SCR',
  },
  Blast: {
    ...chains.Blast!,
    displayName: 'Blast',
    explorerUrl: 'https://blastscan.io/',
    explorerName: 'Blastscan',
    gasToken: 'ETHblast',
    chainId: 81457,
    icon: ChainIcon.BLAST,
    maxBlockSearch: 2000,
    symbol: 'BLAST',
  },
  Xlayer: {
    ...chains.Xlayer!,
    displayName: 'X Layer',
    explorerUrl: 'https://www.okx.com/web3/explorer/xlayer/',
    explorerName: 'OKX Explorer',
    gasToken: 'OKB',
    chainId: 196,
    icon: ChainIcon.XLAYER,
    maxBlockSearch: 2000,
    symbol: 'OKX',
  },
  Mantle: {
    ...chains.Mantle!,
    displayName: 'Mantle',
    explorerUrl: 'https://explorer.mantle.xyz/',
    explorerName: 'Mantle Explorer',
    gasToken: 'MNT',
    chainId: 5000,
    icon: ChainIcon.MANTLE,
    maxBlockSearch: 2000,
    symbol: 'MNT',
  },
};
