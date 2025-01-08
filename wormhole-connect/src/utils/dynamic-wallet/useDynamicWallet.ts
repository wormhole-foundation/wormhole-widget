import React from 'react';
import DynamicWalletIcon from 'utils/dynamic-wallet/walletIcon';
import { DynamicWallet, toDynamicChain } from './utils';
import {
  Chain,
  useDynamicContext,
  useSwitchWallet,
  useUserWallets,
  useWalletOptions,
} from '@dynamic-labs/sdk-react-core';
import { Chain as WormholeChain } from '@wormhole-foundation/sdk';
import { Context } from 'sdklegacy';
import { fromWormholeChainToContext, type IconType } from 'utils/wallet';
import type { ConnectedWallet } from 'utils/wallet/wallet';
import { evmWalletOptions } from './const';

export interface DynamicWalletData {
  name: string;
  type: Context;
  icon: IconType;
  isReady: boolean;
  walletKey: string;
  chain: Chain;
  isInstalledOnBrowser: boolean;
  isWalletConnect: boolean;
}

export type OnConnectCallback = (wallet: DynamicWallet) => void;

type WalletOptions = ReturnType<
  typeof useWalletOptions
>['walletOptions'][number];

export const useDynamicWalletOptions = () => {
  const { sdkHasLoaded, primaryWallet } = useDynamicContext();
  const { walletOptions, selectWalletOption } = useWalletOptions();
  const userWallets = useUserWallets();

  const filterWallets = React.useCallback((wallet: WalletOptions) => {
    return (
      (wallet.chain === 'EVM' && evmWalletOptions.includes(wallet.key)) ||
      (wallet.chain !== 'EVM' && wallet.group)
    );
  }, []);

  const getDynamicWalletOptions = React.useCallback(
    (
      chain: WormholeChain,
      wallets: { sending?: ConnectedWallet; receiving?: ConnectedWallet },
    ): DynamicWalletData[] => {
      if (!sdkHasLoaded) return [];
      return walletOptions
        .filter((a) => a.chain === toDynamicChain(chain) && filterWallets(a))
        .map(
          (a): DynamicWalletData => ({
            icon: ({ size }) =>
              React.createElement(DynamicWalletIcon, {
                size,
                walletKey: a.key,
              }),
            isReady: true,
            name: a.name,
            type: fromWormholeChainToContext(chain),
            walletKey: a.key,
            chain: a.chain,
            isInstalledOnBrowser: a.isInstalledOnBrowser,
            isWalletConnect: a.isWalletConnect,
          }),
        );
    },
    [walletOptions, selectWalletOption, sdkHasLoaded],
  );

  const selectDynamicWalletOption = React.useCallback(
    async (
      walletId: string,
      connectCallback: (wallet: DynamicWallet) => Promise<void>,
    ) => {
      if (!sdkHasLoaded) return;

      // Check if the wallet is already connected
      if (primaryWallet?.key === walletId) {
        return await connectCallback(primaryWallet);
      }
      const connectedWallet = userWallets.find((w) => w.key === walletId);
      if (connectedWallet) {
        return await connectCallback(connectedWallet);
      }

      console.log('Selecting wallet option', walletId);
      await selectWalletOption(walletId);
    },
    [sdkHasLoaded, primaryWallet, selectWalletOption],
  );

  return {
    getDynamicWalletOptions,
    selectDynamicWalletOption,
  };
};

export const useDynamicWalletHelpers = () => {
  const { primaryWallet, handleLogOut, handleUnlinkWallet, sdkHasLoaded } =
    useDynamicContext();
  const switchWallet = useSwitchWallet();
  const userWallets = useUserWallets();

  const isDynamicWalletReady = React.useCallback(
    () => sdkHasLoaded,
    [sdkHasLoaded],
  );

  const disconnectDynamicWallet = React.useCallback(
    async (walletToDisconnect: DynamicWallet) => {
      if (userWallets.length === 0) {
        return;
      }
      if (userWallets.length === 1) {
        return await handleLogOut();
      }
      if (
        primaryWallet?.id === walletToDisconnect.id &&
        userWallets.length > 1
      ) {
        await switchWallet(
          userWallets.filter((w) => w.id !== walletToDisconnect.id)[0].id,
        );
      }

      await handleUnlinkWallet(walletToDisconnect.id);
    },
    [
      primaryWallet,
      userWallets,
      handleUnlinkWallet,
      handleLogOut,
      sdkHasLoaded,
    ],
  );

  return {
    disconnectDynamicWallet,
    isDynamicWalletReady,
  };
};
