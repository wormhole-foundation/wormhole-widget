import {
  Network as Environment,
  Contracts,
  CONTRACTS,
} from '@certusone/wormhole-sdk';
import { WormholeConfig, Context, ChainConfig, TokenConfig } from '../types';
import AcalaIcon from '../../icons/acala.svg';
import AlgoIcon from '../../icons/algorand.svg';
import AptosIcon from '../../icons/aptos.svg';
import ArbitrumIcon from '../../icons/arbitrum.svg';
import AuroraIcon from '../../icons/aurora.svg';
import AvaxIcon from '../../icons/avax.svg';
import BscIcon from '../../icons/bsc.svg';
import CeloIcon from '../../icons/celo.svg';
import EthIcon from '../../icons/eth.svg';
import FantomIcon from '../../icons/fantom.svg';
import InjectiveIcon from '../../icons/injective.svg';
import KaruraIcon from '../../icons/karura.svg';
import KlaytnIcon from '../../icons/klaytn.svg';
import MoonbeamIcon from '../../icons/moonbeam.svg';
import NearIcon from '../../icons/near.svg';
import NeonIcon from '../../icons/neon.svg';
import OasisIcon from '../../icons/oasis-network-rose-logo.svg';
import OsmosisIcon from '../../icons/osmosis.svg';
import PolygonIcon from '../../icons/polygon.svg';
import SolanaIcon from '../../icons/solana.svg';
import SuiIcon from '../../icons/sui.png';
import TerraIcon from '../../icons/terra.svg';
import Terra2Icon from '../../icons/terra2.svg';
import XplaIcon from '../../icons/xpla.svg';

import BnbIcon from '../../icons/bnb.svg';

// https://book.wormhole.com/reference/contracts.html
export const MAINNET_CHAINS = {
  solana: 1,
  ethereum: 2,
  terra: 3,
  bsc: 4,
  polygon: 5,
  avalanche: 6,
  oasis: 7,
  algorand: 8,
  aurora: 9,
  fantom: 10,
  karura: 11,
  acala: 12,
  klaytn: 13,
  celo: 14,
  near: 15,
  moonbeam: 16,
  neon: 17,
  terra2: 18,
  injective: 19,
  osmosis: 20,
  sui: 21,
  aptos: 22,
  arbitrum: 23,
  optimism: 24,
  gnosis: 25,
  pythnet: 26,
  xpla: 28,
  btc: 29,
  wormchain: 3104,
} as const;

export type MainnetChainName = keyof typeof MAINNET_CHAINS;
export type MainnetChainId = (typeof MAINNET_CHAINS)[MainnetChainName];

export type ChainContracts = {
  [chain in MainnetChainName]: Contracts;
};

const MAINNET: { [chain in MainnetChainName]: ChainConfig } = {
  solana: {
    id: 1,
    context: Context.SOLANA,
    contracts: CONTRACTS.MAINNET.solana,
    icon: SolanaIcon,
    displayName: 'Solana',
  },
  ethereum: {
    id: 2,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.ethereum,
    icon: EthIcon,
    displayName: 'Ethereum',
  },
  terra: {
    id: 3,
    context: Context.TERRA,
    contracts: CONTRACTS.MAINNET.terra,
    icon: TerraIcon,
    displayName: 'Terra',
  },
  bsc: {
    id: 4,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.bsc,
    icon: BscIcon,
    displayName: 'BSC',
  },
  polygon: {
    id: 5,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.polygon,
    icon: PolygonIcon,
    displayName: 'Polygon',
  },
  avalanche: {
    id: 6,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.avalanche,
    icon: AvaxIcon,
    displayName: 'Avalanche',
  },
  oasis: {
    id: 7,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.oasis,
    icon: OasisIcon,
    displayName: 'Oasis',
  },
  algorand: {
    id: 8,
    context: Context.ALGORAND,
    contracts: CONTRACTS.MAINNET.algorand,
    icon: AlgoIcon,
    displayName: 'Algorand',
  },
  aurora: {
    id: 9,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.aurora,
    icon: AuroraIcon,
    displayName: 'Aurora',
  },
  fantom: {
    id: 10,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.fantom,
    icon: FantomIcon,
    displayName: 'Fantom',
  },
  karura: {
    id: 11,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.karura,
    icon: KaruraIcon,
    displayName: 'Karura',
  },
  acala: {
    id: 12,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.acala,
    icon: AcalaIcon,
    displayName: 'Acala',
  },
  klaytn: {
    id: 13,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.klaytn,
    icon: KlaytnIcon,
    displayName: 'Klaytn',
  },
  celo: {
    id: 14,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.celo,
    icon: CeloIcon,
    displayName: 'Celo',
  },
  near: {
    id: 15,
    context: Context.NEAR,
    contracts: CONTRACTS.MAINNET.near,
    icon: NearIcon,
    displayName: 'Near',
  },
  injective: {
    id: 19,
    context: Context.INJECTIVE,
    contracts: CONTRACTS.MAINNET.injective,
    icon: InjectiveIcon,
    displayName: 'Injective',
  },
  osmosis: {
    id: 20,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.osmosis,
    icon: OsmosisIcon,
    displayName: 'Osmosis',
  },
  aptos: {
    id: 22,
    context: Context.APTOS,
    contracts: CONTRACTS.MAINNET.aptos,
    icon: AptosIcon,
    displayName: 'Aptos',
  },
  sui: {
    id: 21,
    context: Context.OTHER,
    contracts: CONTRACTS.MAINNET.sui,
    icon: SuiIcon,
    displayName: 'SUI',
  },
  moonbeam: {
    id: 16,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.moonbeam,
    icon: MoonbeamIcon,
    displayName: 'Moonbeam',
  },
  neon: {
    id: 17,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.neon,
    icon: NeonIcon,
    displayName: 'Neon',
  },
  terra2: {
    id: 18,
    context: Context.TERRA,
    contracts: CONTRACTS.MAINNET.terra2,
    icon: Terra2Icon,
    displayName: 'Terra 2',
  },
  arbitrum: {
    id: 23,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.arbitrum,
    icon: ArbitrumIcon,
    displayName: 'Arbitrum',
  },
  optimism: {
    id: 24,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.optimism,
    icon: '',
    displayName: 'Optimism',
  },
  gnosis: {
    id: 25,
    context: Context.ETH,
    contracts: CONTRACTS.MAINNET.gnosis,
    icon: '',
    displayName: 'Gnosis',
  },
  pythnet: {
    id: 26,
    context: Context.SOLANA,
    contracts: CONTRACTS.MAINNET.pythnet,
    icon: '',
    displayName: 'Pythnet',
  },
  xpla: {
    id: 28,
    context: Context.XPLA,
    contracts: CONTRACTS.MAINNET.xpla,
    icon: XplaIcon,
    displayName: 'XPLA',
  },
  btc: {
    id: 29,
    context: Context.OTHER,
    contracts: CONTRACTS.MAINNET.btc,
    icon: '',
    displayName: 'BTC',
  },
  wormchain: {
    id: 3104,
    context: Context.OTHER,
    contracts: CONTRACTS.MAINNET.wormchain,
    icon: '',
    displayName: 'Wormchain',
  },
};

export const MAINNET_TOKENS: { [key: string]: TokenConfig} = {
  MATIC: {
    symbol: 'MATIC',
    icon: PolygonIcon,
    address: undefined,
    coinGeckoId: '',
  },
  WMATIC: {
    symbol: 'WMATIC',
    icon: PolygonIcon,
    address: '0x1234...5678',
    coinGeckoId: '',
  },
  SOL: {
    symbol: 'SOL',
    icon: SolanaIcon,
    address: '0x1234...5678',
    coinGeckoId: '',
  },
  WAVAX: {
    symbol: 'WAVAX',
    icon: AvaxIcon,
    address: '0x1234...5678',
    coinGeckoId: '',
  },
  CELO: {
    symbol: 'CELO',
    icon: CeloIcon,
    address: '0x1234...5678',
    coinGeckoId: '',
  },
  BNB: {
    symbol: 'BNB',
    icon: BnbIcon,
    address: '0x1234...5678',
    coinGeckoId: '',
  }
}

const env: Environment = 'MAINNET';
const MAINNET_CONFIG: WormholeConfig = {
  env,
  rpcs: {
    solana: 'https://api.devnet.solana.com',
    ethereum: 'https://main-light.eth.linkpool.io',
  },
  chains: MAINNET,
};

export default MAINNET_CONFIG;
