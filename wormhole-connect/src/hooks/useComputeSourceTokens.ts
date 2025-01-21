import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import config from 'config';
import { setToken, setSupportedSourceTokens } from 'store/transferInput';

import type { Chain } from '@wormhole-foundation/sdk';
import type { Token } from 'config/tokens';
import { useTokens } from 'contexts/TokensContext';

type Props = {
  sourceChain: Chain | undefined;
  sourceToken: Token | undefined;
  destChain: Chain | undefined;
  destToken: Token | undefined;
  route?: string;
};

type ReturnProps = {
  isFetching: boolean;
};

const useComputeSourceTokens = (props: Props): ReturnProps => {
  const { sourceChain, destChain, sourceToken, destToken, route } = props;

  const dispatch = useDispatch();

  const [isFetching, setIsFetching] = useState(false);

  const { lastTokenCacheUpdate } = useTokens();

  useEffect(() => {
    if (!sourceChain) {
      return;
    }

    let active = true;

    const computeSrcTokens = async () => {
      let supported: Token[] = [];

      // Start fetching and setting all supported tokens
      setIsFetching(true);

      try {
        supported = await config.routes.allSupportedSourceTokens(sourceChain);
      } catch (e) {
        console.error(e);
      }

      if (active) {
        dispatch(setSupportedSourceTokens(supported.map((t) => t.tuple)));
        const isTokenSupported =
          sourceToken && supported.some((t) => t.equals(sourceToken));
        if (!isTokenSupported) {
          // No routes found for this token :(((((
        }
        if (supported.length === 1) {
          dispatch(setToken(supported[0].tuple));
        }
      }

      // Done fetching and setting all supported tokens
      setIsFetching(false);
    };

    computeSrcTokens();

    return () => {
      active = false;
    };
    // IMPORTANT: do not include sourceToken in dependency array,
    // because it's not needed and it will also cause an extra round unnecessary updates when the side-affect automatically sets the sourceToken.
    // Please See dispatch(setToken(...)) calls above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    destChain,
    destToken,
    dispatch,
    route,
    sourceChain,
    lastTokenCacheUpdate,
  ]);

  return { isFetching };
};

export default useComputeSourceTokens;
