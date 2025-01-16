import { TokenIcon, TokenConfig } from '../types';

export const DEVNET_TOKENS: TokenConfig[] = [
  {
    key: 'ETH',
    symbol: 'ETH',
    icon: TokenIcon.ETH,
    decimals: 18,
    tokenId: {
      chain: 'Ethereum',
      address: 'native',
    },
  },
  {
    key: 'WETH',
    symbol: 'WETH',
    icon: TokenIcon.ETH,
    decimals: 18,
    tokenId: {
      chain: 'Ethereum',
      address: '0xDDb64fE46a91D46ee29420539FC25FD07c5FEa3E',
    },
  },
  {
    key: 'TKN',
    symbol: 'TKN',
    icon: TokenIcon.ETH,
    decimals: 18,
    tokenId: {
      chain: 'Ethereum',
      address: '0x2D8BE6BF0baA74e0A907016679CaE9190e80dD0A',
    },
  },
];
