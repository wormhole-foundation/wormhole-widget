import { Context } from 'sdklegacy';
import config from 'config';

import { RootState } from 'store';
import { Dispatch } from 'redux';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Network, Chain, UnsignedTransaction } from '@wormhole-foundation/sdk';

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
import { DynamicWalletData } from "../dynamic-wallet/useDynamicWallet";
import { WalletAggregatorData } from './legacy';
import { ConnectedWallet } from './wallet';

export type IconType = (props: {size?: number}) => React.FunctionComponentElement<any>;

export enum TransferWallet {
  SENDING = 'sending',
  RECEIVING = 'receiving',
}

export const walletAcceptedChains = (context: Context | undefined): Chain[] => {
  if (!context) {
    return config.chainsArr.map((c) => c.key);
  }
  return config.chainsArr
    .filter((c) => c.context === context)
    .map((c) => c.key);
};

export type WalletData = WalletAggregatorData | DynamicWalletData

// Checks localStorage for previously used wallet for this chain
// and connects to it automatically if it exists.
export const connectLastUsedWallet = async (
  type: TransferWallet,
  chain: Chain,
  dispatch: Dispatch<any>,
) => {
  // const chainConfig = config.chains[chain!]!;
  // const lastUsedWallet = localStorage.getItem(
  //   `wormhole-connect:wallet:${chainConfig.context}`,
  // );
  // // if the last used wallet is not WalletConnect, try to connect to it
  // if (lastUsedWallet && lastUsedWallet !== 'WalletConnect') {
  //   const options = await getWalletOptions(chainConfig);
  //   const wallet = options.find((w) => w.name === lastUsedWallet);
  //   if (wallet) {
  //     await connectWallet(type, chain, wallet, dispatch);
  //   }
  // }
};

export const useConnectToLastUsedWallet = (): void => {
  const dispatch = useDispatch();
  const { toChain, fromChain } = useSelector(
    (state: RootState) => state.transferInput,
  );

  useEffect(() => {
    if (fromChain)
      connectLastUsedWallet(TransferWallet.SENDING, fromChain, dispatch);
    if (toChain)
      connectLastUsedWallet(TransferWallet.RECEIVING, toChain, dispatch);
  }, [fromChain, toChain]);
};

// export const switchChain = async (
//   chainId: number | string,
//   type: TransferWallet,
// ): Promise<string | undefined> => {
//   const w: Wallet = walletConnection[type]! as any;
//   if (!w) throw new Error('must connect wallet');

//   const config = getChainByChainId(chainId)!;
//   const currentChain = w.getNetworkInfo().chainId;
//   if (currentChain === chainId) return;
//   if (config.context === Context.ETH) {
//     try {
//       // some wallets may not support chain switching
//       const evm = await import('utils/wallet/evm');
//       await evm.switchChain(w, chainId as number);
//     } catch (e) {
//       if (e instanceof NotSupported) return;
//       throw e;
//     }
//   }
//   return w.getAddress();
// };

// export const disconnect = async (type: TransferWallet) => {
//   const w = walletConnection[type]! as any;
//   if (!w) return;
//   await w.disconnect();
// };

export const signAndSendTransaction = async (
  chain: Chain,
  request: UnsignedTransaction<Network, Chain>,
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

