import { Wallet as WA_Wallet, WalletState } from '@xlabs-libs/wallet-aggregator-core';
import { ChainConfig, Context } from 'sdklegacy';
import { IconType, TransferWallet } from '..';
import React, { Dispatch } from 'react';
import { WalletAggregatorIcon } from './walletAggregatorIcon';
import config from 'config';
import { connectWallet as connectSourceWallet, connectReceivingWallet, clearWallet } from 'store/wallet';
import { ConnectedWallet } from '../wallet';
import { Chain as WormholeChain } from '@wormhole-foundation/sdk';

export type WalletAggregatorData = {
  name: string;
  type: Context;
  icon: IconType;
  isReady: boolean;
  wallet: WA_Wallet;
};

const connectWallet = async (
    type: TransferWallet,
    chain: WormholeChain,
    walletInfo: WalletAggregatorData,
    dispatch: Dispatch<any>,
  ) => {
    const { wallet, name } = walletInfo;
  
    const chainConfig = config.chains[chain];
    if (!chainConfig) {
      throw new Error(`Unable to find wallets for chain ${chain}`);
    }
  
    const { chainId, context } = chainConfig;
    await wallet.connect({ chainId });
  
    config.triggerEvent({
      type: 'wallet.connect',
      details: {
        side: type,
        chain: chain,
        wallet: walletInfo.name.toLowerCase(),
      },
    });
  
    const address = wallet.getAddress()!;
    const payload = {
      address,
      type: walletInfo.type,
      // icon: walletInfo.icon,
      name: wallet.getName(),
    };
  
    if (type === TransferWallet.SENDING) {
      dispatch(connectSourceWallet(payload));
    } else {
      dispatch(connectReceivingWallet(payload));
    }
  
    // clear wallet when the user manually disconnects from outside the app
    wallet.on('disconnect', () => {
      wallet.disconnect()
      dispatch(clearWallet(type));
      localStorage.removeItem(`wormhole-connect:wallet:${context}`);
    });
  
    // when the user has multiple wallets connected and either changes
    // or disconnects the current wallet, clear the wallet
    wallet.on('accountsChanged', (accs: string[]) => {
      // disconnect only if there are no accounts, or if the new account is different from the current
      const shouldDisconnect =
        accs.length === 0 || (accs.length && address && accs[0] !== address);
  
      if (shouldDisconnect) {
        wallet.disconnect();
      }
    });
  
    localStorage.setItem(`wormhole-connect:wallet:${context}`, name);
  };

const getReady = (wallet: WA_Wallet) => {
    const ready = wallet.getWalletState();
    return ready !== WalletState.Unsupported && ready !== WalletState.NotDetected;
};

const mapWallets = (
    wallets: Record<string, WA_Wallet>,
    type: Context,
    skip: string[] = [],
): WalletAggregatorData[] => {
    return Object.values(wallets)
        .filter(
            (wallet, index, self) =>
                index === self.findIndex((o) => o.getName() === wallet.getName()),
        )
        .filter((wallet) => !skip.includes(wallet.getName()))
        .map((wallet) => ({
            wallet,
            type,
            name: wallet.getName(),
            icon: ({ size }) => React.createElement(WalletAggregatorIcon, { iconSize: size, walletName: wallet.getName(), walletIcon: wallet.getIcon() }),
            isReady: getReady(wallet),
        }));
};

export const getWalletOptions = async (
    config: ChainConfig | undefined,
): Promise<WalletAggregatorData[]> => {
    if (config === undefined) {
        return [];
    } else if (config.context === Context.SUI) {
        const suiWallet = await import('utils/wallet/legacy/sui');
        const suiOptions = await suiWallet.fetchOptions();
        return Object.values(mapWallets(suiOptions, Context.SUI));
    } else if (config.context === Context.APTOS) {
        const aptosWallet = await import('utils/wallet/legacy/aptos');
        const aptosOptions = aptosWallet.fetchOptions();
        return Object.values(mapWallets(aptosOptions, Context.APTOS));
    }
    return [];
};

export const toConnectedWalletAggregator = async (wallet: WalletAggregatorData, type: TransferWallet, chain: WormholeChain, dispatch: Dispatch<any>): Promise<ConnectedWallet> => {
  await connectWallet(type, chain, wallet, dispatch)
  const connectedWallet: ConnectedWallet = {
    address: wallet.wallet.getAddress()!,
    disconnect: async () => {
      wallet.wallet.removeAllListeners()
      await wallet.wallet.disconnect()
    },
    getWallet: () => wallet,
    getNetworkInfo: async () => {
      return wallet.wallet.getNetworkInfo()
    },
    icon: ({ size }) => React.createElement(WalletAggregatorIcon, { iconSize: size, walletName: wallet.wallet.getName(), walletIcon: wallet.wallet.getIcon() }),
  }
  return connectedWallet
};


export const isWalletAggregatorWallet = (wallet: any): wallet is WalletAggregatorData => {
  return "wallet" in wallet && wallet.wallet instanceof WA_Wallet
}