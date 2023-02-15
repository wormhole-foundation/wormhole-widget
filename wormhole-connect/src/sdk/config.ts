import { ChainConfig } from '@wormhole-foundation/wormhole-connect-sdk';
import { CONFIG as CONF } from '@wormhole-foundation/wormhole-connect-sdk';
import { MAINNET_NETWORKS, MAINNET_TOKENS } from '../config/mainnet';
import { TESTNET_NETWORKS, TESTNET_TOKENS } from '../config/testnet';
import { TokenConfig } from 'config/types';

const el = document.getElementById('wormhole-connect');
if (!el)
  throw new Error('must specify an anchor element with id wormhole-connect');
const configJson = el.getAttribute('config');
const config = JSON.parse(configJson!);
console.log('CONFIG', config);

const { REACT_APP_ENV } = process.env;
export const isProduction = REACT_APP_ENV === 'MAINNET';
export const CONFIG = isProduction ? CONF.MAINNET : CONF.TESTNET;

export const CHAINS = isProduction ? MAINNET_NETWORKS : TESTNET_NETWORKS;
export const CHAINS_ARR =
  config && config.networks
    ? (Object.values(CHAINS) as ChainConfig[]).filter(
        (c) => config.networks.includes(c.key),
      )
    : (Object.values(CHAINS) as ChainConfig[]);

export const TOKENS = isProduction ? MAINNET_TOKENS : TESTNET_TOKENS;
export const TOKENS_ARR =
  config && config.tokens
    ? (Object.values(TOKENS) as TokenConfig[]).filter(
        (c) => config.tokens.includes(c.symbol),
      )
    : (Object.values(TOKENS) as TokenConfig[]);

export const THEME_MODE = config && config.mode ? config.mode : 'dark';
export const CUSTOM_THEME = config && config.customTheme;
