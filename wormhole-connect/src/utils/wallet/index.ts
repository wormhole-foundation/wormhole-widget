import { Context } from 'sdklegacy';
import config from 'config';

import { RootState } from 'store';
import { Dispatch } from 'redux';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Network, Chain as WormholeChain, UnsignedTransaction, chainToPlatform, chainIdToChain, toChainId } from '@wormhole-foundation/sdk';

import {
  EvmUnsignedTransaction,
  EvmChains,
} from '@wormhole-foundation/sdk-evm';
import {
  SuiUnsignedTransaction,
  SuiChains,
} from '@wormhole-foundation/sdk-sui';
import {
  AptosUnsignedTransaction,
  AptosChains,
} from '@wormhole-foundation/sdk-aptos';
import { SolanaUnsignedTransaction } from '@wormhole-foundation/sdk-solana';
import { DynamicWalletData, useDynamicWalletHelpers, useDynamicWalletOptions } from "../dynamic-wallet/useDynamicWallet";
import { getWalletOptions, WalletAggregatorData } from './legacy';
import { ConnectedWallet } from './wallet';
import { isChainSupportedByDynamicWallet } from 'utils/dynamic-wallet/utils';

export type IconType = (props: {size?: number}) => React.FunctionComponentElement<any>;

export enum TransferWallet {
  SENDING = 'sending',
  RECEIVING = 'receiving',
}

export const isEVMChain = (chain: WormholeChain) => {
  return chainToPlatform(chainIdToChain(toChainId(chain))) === "Evm"
}

export const fromWormholeChainToContext = (chain: WormholeChain): Context => {
  if (isEVMChain(chain)) {
    return Context.ETH;
  }
  switch(chain) {
    case 'Solana':
      return Context.SOLANA;
    case 'Sui':
      return Context.SUI;
    case 'Aptos':
      return Context.APTOS;
    default:
      throw new Error('unsupported chain');
  }
}

export const walletAcceptedChains = (context: Context | undefined): WormholeChain[] => {
  if (!context) {
    return config.chainsArr.map((c) => c.key);
  }
  return config.chainsArr
    .filter((c) => c.context === context)
    .map((c) => c.key);
};

export type WalletData = WalletAggregatorData | DynamicWalletData

export const useConnectToLastUsedWallet = (
  connectWallet: (wallet: WalletData, type: TransferWallet, chain: WormholeChain, dispatch: Dispatch<any>) => void,
): void => {
  const dispatch = useDispatch();
  const { getDynamicWalletOptions } = useDynamicWalletOptions()
  const { isDynamicWalletReady } = useDynamicWalletHelpers()
  const { toChain, fromChain } = useSelector(
    (state: RootState) => state.transferInput,
  );
  
  // Checks localStorage for previously used wallet for this chain
  // and connects to it automatically if it exists.
  const connectLastUsedWallet = React.useCallback(async (
    type: TransferWallet,
    chain: WormholeChain,
    dispatch: Dispatch<any>,
  ) => {
    let wallet: WalletData | undefined;
    const chainConfig = config.chains[chain!]!;
    const lastUsedWallet = localStorage.getItem(
      `wormhole-connect:wallet:${chainConfig.context}`,
    );

    if (lastUsedWallet && isChainSupportedByDynamicWallet(chain)) {
      const walletOptions = await getDynamicWalletOptions(chain, {});
      wallet = walletOptions.find((w) => w.walletKey === lastUsedWallet);
    } else if (lastUsedWallet && lastUsedWallet !== 'WalletConnect') {
      const walletOptions = await getWalletOptions(chainConfig);
      wallet = walletOptions.find((w) => w.name === lastUsedWallet);
    }

    if (wallet) {
      await connectWallet(wallet, type, chain, dispatch);
    }
  }, [connectWallet, getWalletOptions])

  React.useEffect(() => {
    if (!isDynamicWalletReady()) return;
    if (fromChain)
      connectLastUsedWallet(TransferWallet.SENDING, fromChain, dispatch);
    if (toChain)
      connectLastUsedWallet(TransferWallet.RECEIVING, toChain, dispatch);
    // TODO: Should we add `connectLastUsedWallet` function as a dependency?. It will trigger many times this useEffect
  }, [fromChain, toChain]);
};

export const signAndSendTransaction = async (
  chain: WormholeChain,
  request: UnsignedTransaction<Network, WormholeChain>,
  wallet: ConnectedWallet,
  options: any = {},
): Promise<string> => {
  const chainConfig = config.chains[chain]!;

  if (chainConfig.context === Context.ETH) {
    const evm = await import('utils/wallet/evm');
    const tx = await evm.signAndSendTransaction(
      request as EvmUnsignedTransaction<Network, EvmChains>,
      wallet,
      chain,
      options,
    );
    return tx;
  } else if (chainConfig.context === Context.SOLANA) {
    const solana = await import('utils/wallet/solana');
    const signature = await solana.signAndSendTransaction(
      request as SolanaUnsignedTransaction<Network>,
      wallet,
      options,
    );
    return signature;
  } else if (chainConfig.context === Context.SUI) {
    const sui = await import('utils/wallet/legacy/sui');
    const tx = await sui.signAndSendTransaction(
      request as SuiUnsignedTransaction<Network, SuiChains>,
      wallet.getWallet() as any,
    );
    return tx.id;
  } else if (chainConfig.context === Context.APTOS) {
    const aptos = await import('utils/wallet/legacy/aptos');
    const tx = await aptos.signAndSendTransaction(
      request as AptosUnsignedTransaction<Network, AptosChains>,
      wallet.getWallet() as any,
    );
    return tx.id;
  } else {
    throw new Error('unimplemented');
  }
};

