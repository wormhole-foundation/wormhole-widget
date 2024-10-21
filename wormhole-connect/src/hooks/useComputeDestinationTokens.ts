import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import config from 'config';
import { setDestToken } from 'store/transferInput';

import { Token } from 'config/tokens';

import { Chain, TokenId } from '@wormhole-foundation/sdk';
import { useTokens } from 'contexts/TokensContext';

type Props = {
  sourceChain: Chain | undefined;
  sourceToken: Token | undefined;
  destChain: Chain | undefined;
  route?: string;
};

type ReturnProps = {
  supportedDestTokens: Token[];
  isFetching: boolean;
};

const useComputeDestinationTokens = (props: Props): ReturnProps => {
  const { sourceChain, destChain, sourceToken } = props;

  const dispatch = useDispatch();

  const [supportedDestTokens, setSupportedDestTokens] = useState<Token[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const { getOrFetchToken, lastTokenCacheUpdate } = useTokens();

  useEffect(() => {
    if (!destChain) {
      return;
    }

    let active = true;

    const computeDestTokens = async () => {
      // Start fetching and setting all supported tokens

      if (sourceChain && destChain) {
        let supportedIds: TokenId[] = [];
        setIsFetching(true);

        try {
          supportedIds = await config.routes.allSupportedDestTokens(
            sourceToken,
            sourceChain,
            destChain,
          );
        } catch (e) {
          console.error(e);
        }

        const supported: Token[] = [];

        await Promise.all(
          supportedIds.map(async (tokenId) => {
            const t = await getOrFetchToken(tokenId);
            if (t) {
              supported.push(t);
            }
          }),
        );

        setSupportedDestTokens(supported);

        // Done fetching and setting all supported tokens
        setIsFetching(false);

        // Auto-select if there's only one option
        if (destChain && supported.length === 1) {
          if (active) {
            dispatch(setDestToken(supported[0].tuple));
          }
        }
      }
    };

    computeDestTokens();

    return () => {
      active = false;
    };
  }, [
    sourceToken,
    sourceChain,
    destChain,
    dispatch,
    lastTokenCacheUpdate,
    getOrFetchToken,
  ]);

  return {
    supportedDestTokens,
    isFetching,
  };
};

export default useComputeDestinationTokens;
