import { CONFIG } from 'sdklegacy';
import { ChainsConfig } from '../types';

const { chains } = CONFIG.MAINNET;

export const MAINNET_CHAINS: ChainsConfig = {
  Ethereum: {
    ...chains.Ethereum!,
    displayName: 'Ethereum',
    sdkName: 'Ethereum',
    explorerUrl: 'https://etherscan.io/',
    explorerName: 'Etherscan',
    gasToken: 'ETH',
    chainId: 1,
    icon: 'Ethereum',
    maxBlockSearch: 2000,
    symbol: 'ETH',
    wrappedGasToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  Bsc: {
    ...chains.Bsc!,
    displayName: 'BSC',
    sdkName: 'Bsc',
    explorerUrl: 'https://bscscan.com/',
    explorerName: 'BscScan',
    gasToken: 'BNB',
    chainId: 56,
    icon: 'Bsc',
    maxBlockSearch: 2000,
    symbol: 'BSC',
    wrappedGasToken: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  },
  Polygon: {
    ...chains.Polygon!,
    displayName: 'Polygon',
    sdkName: 'Polygon',
    explorerUrl: 'https://polygonscan.com/',
    explorerName: 'PolygonScan',
    gasToken: 'POL',
    chainId: 137,
    icon: 'Polygon',
    maxBlockSearch: 1000,
    symbol: 'POL',
    wrappedGasToken: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  },
  Avalanche: {
    ...chains.Avalanche!,
    displayName: 'Avalanche',
    sdkName: 'Avalanche',
    explorerUrl: 'https://avascan.info/blockchain/c/',
    explorerName: 'Avascan',
    gasToken: 'AVAX',
    chainId: 43114,
    icon: 'Avalanche',
    maxBlockSearch: 2000,
    symbol: 'AVAX',
    wrappedGasToken: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  },
  Fantom: {
    ...chains.Fantom!,
    displayName: 'Fantom',
    sdkName: 'Fantom',
    explorerUrl: 'https://ftmscan.com/',
    explorerName: 'FTMscan',
    gasToken: 'FTM',
    chainId: 250,
    icon: 'Fantom',
    maxBlockSearch: 2000,
    symbol: 'FTM',
    wrappedGasToken: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
  },
  Celo: {
    ...chains.Celo!,
    displayName: 'Celo',
    sdkName: 'Celo',
    explorerUrl: 'https://explorer.celo.org/mainnet/',
    explorerName: 'Celo Explorer',
    gasToken: 'CELO',
    chainId: 42220,
    icon: 'Celo',
    maxBlockSearch: 2000,
    symbol: 'CELO',
  },
  Moonbeam: {
    ...chains.Moonbeam!,
    displayName: 'Moonbeam',
    sdkName: 'Moonbeam',
    explorerUrl: 'https://moonscan.io/',
    explorerName: 'Moonscan',
    gasToken: 'GLMR',
    chainId: 1284,
    icon: 'Moonbeam',
    maxBlockSearch: 2000,
    symbol: 'GLMR',
    wrappedGasToken: '0xAcc15dC74880C9944775448304B263D191c6077F',
  },
  Solana: {
    ...chains.Solana!,
    displayName: 'Solana',
    sdkName: 'Solana',
    explorerUrl: 'https://explorer.solana.com/',
    explorerName: 'Solana Explorer',
    gasToken: 'SOL',
    chainId: 0,
    icon: 'Solana',
    maxBlockSearch: 2000,
    symbol: 'SOL',
    wrappedGasToken: 'So11111111111111111111111111111111111111112',
  },
  Sui: {
    ...chains.Sui!,
    displayName: 'Sui',
    sdkName: 'Sui',
    explorerUrl: 'https://suiscan.xyz/',
    explorerName: 'Suiscan',
    gasToken: 'SUI',
    chainId: 0,
    icon: 'Sui',
    maxBlockSearch: 0,
    symbol: 'SUI',
  },
  Aptos: {
    ...chains.Aptos!,
    displayName: 'Aptos',
    sdkName: 'Aptos',
    explorerUrl: 'https://explorer.aptoslabs.com/',
    explorerName: 'Aptos Explorer',
    gasToken: 'APT',
    chainId: 0,
    icon: 'Aptos',
    maxBlockSearch: 0,
    symbol: 'APT',
  },
  Base: {
    ...chains.Base!,
    displayName: 'Base',
    sdkName: 'Base',
    explorerUrl: 'https://basescan.org/',
    explorerName: 'BaseScan',
    gasToken: 'ETHbase',
    chainId: 8453,
    icon: 'Base',
    maxBlockSearch: 2000,
    symbol: 'BASE',
    wrappedGasToken: '0x4200000000000000000000000000000000000006',
  },
  Arbitrum: {
    ...chains.Arbitrum!,
    displayName: 'Arbitrum',
    sdkName: 'Arbitrum',
    explorerUrl: 'https://arbiscan.io/',
    explorerName: 'Arbitrum Explorer',
    gasToken: 'ETHarbitrum',
    chainId: 42161,
    icon: 'Arbitrum',
    maxBlockSearch: 2000,
    symbol: 'ARB',
    wrappedGasToken: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  Optimism: {
    ...chains.Optimism!,
    displayName: 'Optimism',
    sdkName: 'Optimism',
    explorerUrl: 'https://optimistic.etherscan.io/',
    explorerName: 'Optimistic Etherscan',
    gasToken: 'ETHoptimism',
    chainId: 10,
    icon: 'Optimism',
    maxBlockSearch: 2000,
    symbol: 'OP',
    wrappedGasToken: '0x4200000000000000000000000000000000000006',
  },
  Klaytn: {
    ...chains.Klaytn!,
    displayName: 'Kaia',
    sdkName: 'Klaytn',
    explorerUrl: 'https://kaiascope.com/',
    explorerName: 'Kaia Scope',
    gasToken: 'KLAY',
    chainId: 8217,
    icon: 'Klaytn',
    maxBlockSearch: 2000,
    symbol: 'KLAY',
    wrappedGasToken: '0xe4f05A66Ec68B54A58B17c22107b02e0232cC817',
  },
  Scroll: {
    ...chains.Scroll!,
    displayName: 'Scroll',
    sdkName: 'Scroll',
    explorerUrl: 'https://scrollscan.com/',
    explorerName: 'Scrollscan',
    gasToken: 'ETHscroll',
    chainId: 534352,
    icon: 'Scroll',
    maxBlockSearch: 2000,
    symbol: 'SCR',
    wrappedGasToken: '0x5300000000000000000000000000000000000004',
  },
  Blast: {
    ...chains.Blast!,
    displayName: 'Blast',
    sdkName: 'Blast',
    explorerUrl: 'https://blastscan.io/',
    explorerName: 'Blastscan',
    gasToken: 'ETHblast',
    chainId: 81457,
    icon: 'Blast',
    maxBlockSearch: 2000,
    symbol: 'BLAST',
    wrappedGasToken: '0x9D020B1697035d9d54f115194c9e04a1e4Eb9aF7',
  },
  Xlayer: {
    ...chains.Xlayer!,
    displayName: 'X Layer',
    sdkName: 'Xlayer',
    explorerUrl: 'https://www.okx.com/web3/explorer/xlayer/',
    explorerName: 'OKX Explorer',
    gasToken: 'OKB',
    chainId: 196,
    icon: 'Xlayer',
    maxBlockSearch: 2000,
    symbol: 'OKX',
    wrappedGasToken: '0xe538905cf8410324e03A5A23C1c177a474D59b2b',
  },
  Mantle: {
    ...chains.Mantle!,
    displayName: 'Mantle',
    sdkName: 'Mantle',
    explorerUrl: 'https://explorer.mantle.xyz/',
    explorerName: 'Mantle Explorer',
    gasToken: 'MNT',
    chainId: 5000,
    icon: 'Mantle',
    maxBlockSearch: 2000,
    symbol: 'MNT',
    wrappedGasToken: '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8',
  },
  Worldchain: {
    ...chains.Worldchain!,
    displayName: 'World Chain',
    sdkName: 'Worldchain',
    explorerUrl: 'https://worldscan.org/',
    explorerName: 'World Scan',
    gasToken: 'ETHworldchain',
    chainId: 480,
    icon: 'Worldchain',
    maxBlockSearch: 2000,
    symbol: 'WORLD',
  },
};
