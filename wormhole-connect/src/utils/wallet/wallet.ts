import { ethers } from 'ethers';
import {
  DynamicWallet,
  isDynamicWallet,
  toConnectedWallet as toConnectedDynamicWallet,
} from 'utils/dynamic-wallet/utils';
import { IconType, TransferWallet } from '.';
import {
  isWalletAggregatorWallet,
  toConnectedWalletAggregator,
  WalletAggregatorData,
} from './legacy';
import { Dispatch } from '@reduxjs/toolkit';
import {
  isReadOnlyWallet,
  ReadOnlyWalletData,
  toConnectedReadOnlyWallet,
} from './ReadOnlyWallet';

export type Wallet = WalletAggregatorData | DynamicWallet | ReadOnlyWalletData;

export interface ConnectedWallet {
  address: string;
  icon: IconType;
  disconnect: () => void;
  getSigner?: () => Promise<ethers.Signer>;
  getWallet: () => Wallet;
  getNetworkInfo: () => Promise<any>;
  switchChain?: (evmChainId: number) => Promise<void>;
  getWalletKey: () => string;
}

export async function toConnectedWallet(
  wallet: Wallet,
  type: TransferWallet,
  chain: any,
  dispatch: Dispatch,
): Promise<ConnectedWallet> {
  if (isReadOnlyWallet(wallet)) {
    return await toConnectedReadOnlyWallet(wallet, type, chain, dispatch);
  }
  // Wallet aggregator wallet exports the Wallet interface as a class, so we will check if the wallet is an instance of the class
  // Dynamic wallet exports the Wallet interface as a type, so we will identify it check if two of its methods are present
  else if (isWalletAggregatorWallet(wallet)) {
    return await toConnectedWalletAggregator(wallet, type, chain, dispatch);
  } else if (isDynamicWallet(wallet)) {
    return await toConnectedDynamicWallet(wallet, type, chain, dispatch);
  }

  throw new Error('Unknown wallet type');
}
