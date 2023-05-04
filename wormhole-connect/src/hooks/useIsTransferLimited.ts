import { ChainId } from '@certusone/wormhole-sdk';
import axios from 'axios';
import { TOKENS, WH_CONFIG } from 'config';
import { hexlify } from 'ethers/lib/utils.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatAssetAddress, wh } from 'sdk';
import { RootState } from 'store';

const REMAINING_NOTIONAL_TOLERANCE = 0.98;
interface TokenListEntry {
  originAddress: string;
  originChainId: number;
  price: number;
}

interface TokenList {
  entries: TokenListEntry[];
}

interface AvailableNotionalByChainEntry {
  chainId: number;
  remainingAvailableNotional: number;
  notionalLimit: number;
  bigTransactionSize: number;
}

interface AvailableNotionalByChain {
  entries: AvailableNotionalByChainEntry[];
}

export interface ChainLimits {
  chainId: ChainId;
  chainNotionalLimit: number;
  chainRemainingAvailableNotional: number;
  chainBigTransactionSize: number;
  tokenPrice: number;
}

export interface IsTransferLimitedResult {
  isLimited: boolean;
  reason?:
    | 'EXCEEDS_REMAINING_NOTIONAL'
    | 'EXCEEDS_MAX_NOTIONAL'
    | 'EXCEEDS_LARGE_TRANSFER_LIMIT';
  limits?: ChainLimits;
}

export const WORMHOLE_RPC_HOSTS =
  WH_CONFIG.env === 'MAINNET'
    ? [
        'https://wormhole-v2-mainnet-api.certus.one',
        'https://wormhole.inotel.ro',
        'https://wormhole-v2-mainnet-api.mcf.rocks',
        'https://wormhole-v2-mainnet-api.chainlayer.network',
        'https://wormhole-v2-mainnet-api.staking.fund',
        'https://wormhole-v2-mainnet.01node.com',
      ]
    : WH_CONFIG.env === 'TESTNET'
    ? ['https://wormhole-v2-testnet-api.certus.one']
    : ['http://localhost:7071'];

const useIsTransferLimited = (): IsTransferLimitedResult => {
  const [tokenList, setTokenList] = useState<TokenList | null>(null);
  const [availableNotionalByChain, setAvailableNotionalByChain] =
    useState<AvailableNotionalByChain | null>(null);
  const [assetAddress, setAssetAddress] = useState<string | undefined>();

  const { fromNetwork, toNetwork, token, amount } = useSelector(
    (state: RootState) => state.transfer,
  );

  const effectTriggered = useRef(false);

  useEffect(() => {
    const formatAddress = async () => {
      const tokenConfig = TOKENS[token]!;
      if (!token || !tokenConfig.tokenId || !fromNetwork || !token) return;

      let formatted: string | undefined = undefined;
      try {
        formatted = hexlify(await formatAssetAddress(fromNetwork, tokenConfig.tokenId.address));
      } catch (e) { }

      setAssetAddress(formatted);
    }

    formatAddress();
  }, [ token, fromNetwork ]);

  useEffect(() => {
    if (!effectTriggered.current && amount) {
      let cancelled = false;
      (async () => {
        for (const rpcHost of WORMHOLE_RPC_HOSTS) {
          try {
            const baseUrl = `${rpcHost}/v1/governor`;
            const [tokenListResponse, availableNotionalByChainResponse] =
              await Promise.all([
                axios.get<TokenList>(`${baseUrl}/token_list`),
                axios.get<AvailableNotionalByChain>(
                  `${baseUrl}/available_notional_by_chain`,
                ),
              ]);
            if (!cancelled) {
              setTokenList(tokenListResponse.data);
              setAvailableNotionalByChain(
                availableNotionalByChainResponse.data,
              );
              break;
            }
          } catch (error) {
            console.error(error);
          }
          if (cancelled) {
            break;
          }
        }
        return () => {
          cancelled = true;
        };
      })();
      effectTriggered.current = true;
    }
  }, [amount]);

  const result = useMemo<IsTransferLimitedResult>(() => {
    if (!fromNetwork || !toNetwork || !token || !amount || !assetAddress)
      return { isLimited: false };

    const fromChainId = wh.toChainId(fromNetwork);

    if (
      token &&
      toNetwork &&
      fromNetwork &&
      amount &&
      tokenList &&
      availableNotionalByChain
    ) {
      const token = tokenList.entries.find(
        (entry) =>
          entry.originChainId === fromChainId &&
          entry.originAddress === assetAddress,
      );
      if (token) {
        const chain = availableNotionalByChain.entries.find(
          (entry) => entry.chainId === fromChainId,
        );
        if (chain) {
          const transferNotional = token.price * amount;
          const isLimitedReason =
            transferNotional > chain.notionalLimit
              ? 'EXCEEDS_MAX_NOTIONAL'
              : transferNotional >
                chain.bigTransactionSize * REMAINING_NOTIONAL_TOLERANCE
              ? 'EXCEEDS_LARGE_TRANSFER_LIMIT'
              : transferNotional >
                chain.remainingAvailableNotional * REMAINING_NOTIONAL_TOLERANCE
              ? 'EXCEEDS_REMAINING_NOTIONAL'
              : undefined;
          return {
            isLimited: !!isLimitedReason,
            reason: isLimitedReason,
            limits: {
              chainId: fromChainId,
              chainNotionalLimit: chain.notionalLimit,
              chainRemainingAvailableNotional: chain.remainingAvailableNotional,
              chainBigTransactionSize: chain.bigTransactionSize,
              tokenPrice: token.price,
            },
          };
        }
      }
    }
    return {
      isLimited: false,
    };
  }, [
    fromNetwork,
    toNetwork,
    token,
    assetAddress,
    amount,
    tokenList,
    availableNotionalByChain,
  ]);

  return result;
};

export default useIsTransferLimited;
