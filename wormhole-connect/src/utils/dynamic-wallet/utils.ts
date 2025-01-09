import {
  Chain,
  WalletOption,
  type useDynamicContext,
} from '@dynamic-labs/sdk-react-core';
import { WalletAdapterNetwork as SolanaNetwork } from '@solana/wallet-adapter-base';
import { Chain as WormholeChain } from '@wormhole-foundation/sdk';
import {} from '@wormhole-foundation/sdk-base';
import { getSigner } from '@dynamic-labs/ethers-v6';
import { Signer } from 'ethers';
import { Context } from 'sdklegacy';
import { ConnectedWallet } from 'utils/wallet/wallet';
import { getChainByChainId } from 'utils';
import config from 'config';
import { isEVMChain, TransferWallet } from 'utils/wallet';
import { Dispatch } from '@reduxjs/toolkit';
import {
  clearWallet,
  connectReceivingWallet,
  connectWallet as connectSourceWallet,
} from 'store/wallet';
import React from 'react';
import DynamicWalletIcon from './walletIcon';

export type DynamicWallet = NonNullable<
  ReturnType<typeof useDynamicContext>['primaryWallet']
>;

export const dynamicChainToContext = (chain: Chain): Context => {
  switch (chain) {
    case 'SOL':
      return Context.SOLANA;
    case 'EVM':
      return Context.ETH;
    default:
      throw new Error('Chain not supported');
  }
};

export const isDynamicWallet = (wallet: any): wallet is DynamicWallet => {
  return 'connector' in wallet && 'isAuthenticated' in wallet;
};

export const isChainSupportedByDynamicWallet = (chain: WormholeChain) => {
  return chain === 'Solana' || chain === 'Cosmoshub' || isEVMChain(chain);
};

export const getSignerFromWallet = async (
  wallet: DynamicWallet,
): Promise<Signer> => {
  const signer = await getSigner(wallet as any);

  return signer;
};

export const isDynamicWalletOptions = (
  options: any,
): options is WalletOption => {
  return Boolean(options.name && options.key);
};

export const toDynamicChain = (wormholeChain: WormholeChain): Chain => {
  switch (wormholeChain) {
    case 'Cosmoshub':
      return 'COSMOS';
    case 'Solana':
      return 'SOL';
    default: {
      if (isEVMChain(wormholeChain)) {
        return 'EVM';
      }

      throw new Error('Wormhole chain not supported');
    }
  }
};

const switchChain = async (wallet: DynamicWallet, chainId: number) => {
  if (wallet.connector.supportsNetworkSwitching()) {
    const config = getChainByChainId(chainId)!;
    const currentChain = await wallet.connector.getNetwork();
    if (Number(currentChain || 0) === chainId) return;
    if (config.context === Context.ETH) {
      console.log('Switching network to', chainId);
      await wallet.switchNetwork(chainId);
    }
  }
};

export const toConnectedWallet = async (
  wallet: DynamicWallet,
  type: TransferWallet,
  chain: WormholeChain,
  dispatch: Dispatch,
): Promise<ConnectedWallet> => {
  if (wallet.chain !== toDynamicChain(chain)) {
    throw new Error(`Expected wallet with chain ${toDynamicChain(chain)}. Received: ${wallet.chain}`);
  }
  await connectDynamicWallet(type, chain, wallet, dispatch);
  const address = wallet.address;
  const icon = (props) =>
    React.createElement(DynamicWalletIcon, {
      size: props.size,
      walletKey: wallet.connector.key,
    });
  const disconnect = () => {
    wallet.connector.emit('disconnect');
  };
  const getWalletKey = () => wallet.key;
  switch (wallet.chain) {
    case 'EVM':
      return {
        address,
        icon,
        switchChain: async (chainId) => {
          return await switchChain(wallet, chainId);
        },
        getSigner: async () => {
          return await getSigner(wallet);
        },
        getWallet: () => wallet,
        getNetworkInfo: async () => {
          return Number((await wallet.connector.getNetwork()) || 0);
        },
        disconnect,
        getWalletKey,
      };
    case 'SOL':
      return {
        address,
        icon,
        getNetworkInfo: async () => {
          return config.isMainnet
            ? SolanaNetwork.Mainnet
            : SolanaNetwork.Devnet;
        },
        getWallet: () => wallet,
        disconnect,
        getWalletKey,
      };
    default:
      throw new Error(`Wallet chain not implemented: ${wallet.chain}`);
  }
};

const connectDynamicWallet = async (
  type: TransferWallet,
  chain: WormholeChain,
  wallet: DynamicWallet,
  dispatch: Dispatch<any>,
) => {
  const address = (await wallet.connector.getAddress()) || '';

  const chainConfig = config.chains[chain];
  if (!chainConfig) {
    throw new Error(`Unable to find wallets for chain ${chain}`);
  }

  const { chainId, context } = chainConfig;
  await switchChain(wallet, Number(chainId));

  config.triggerEvent({
    type: 'wallet.connect',
    details: {
      side: type,
      chain: chain,
      wallet: wallet.connector.name.toLowerCase(),
    },
  });

  const payload = {
    address: address,
    type: dynamicChainToContext(wallet.chain as any),
    name: wallet.connector.name,
  };
  if (type === TransferWallet.SENDING) {
    dispatch(connectSourceWallet(payload));
  } else {
    dispatch(connectReceivingWallet(payload));
  }

  // clear wallet when the user manually disconnects from outside the app
  wallet.connector.on('disconnect', () => {
    wallet.connector.removeAllListeners();
    dispatch(clearWallet(type));
    localStorage.removeItem(`wormhole-connect:wallet:${context}`);
  });

  // when the user has multiple wallets connected and either changes
  // or disconnects the current wallet, clear the wallet
  wallet.connector.on('accountChange', ({ accounts }) => {
    // disconnec only if there are no accounts, or if the new account is different from the current
    const shouldDisconnect =
      accounts.length === 0 ||
      (accounts.length && address && accounts[0] !== address);

    if (shouldDisconnect) {
      wallet.connector.removeAllListeners();
      dispatch(clearWallet(type));
      localStorage.removeItem(`wormhole-connect:wallet:${context}`);
    }
  });

  localStorage.setItem(
    `wormhole-connect:wallet:${context}`,
    wallet.connector.key,
  );
};
