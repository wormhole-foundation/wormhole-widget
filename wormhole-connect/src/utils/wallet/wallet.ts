import { Wallet as WA_Wallet } from '@xlabs-libs/wallet-aggregator-core';
import { ethers } from 'ethers';
import { DynamicWallet, isDynamicWallet, toConnectedWallet as toConnectedDynamicWallet } from 'utils/dynamic-wallet/utils';


export type Wallet = WA_Wallet | DynamicWallet

export interface ConnectedWallet {
  disconnect: () => void
  getSigner?: () => Promise<ethers.Signer>
  getWallet: () => Wallet
  getNetworkInfo: () => Promise<any>
  switchChain?: (evmChainId: number) => Promise<void>
}

export const isWalletAggregatorWallet = (wallet: Wallet): wallet is WA_Wallet => {
  return "wallet" in wallet && wallet.wallet instanceof WA_Wallet
}

export async function toConnectedWallet (wallet: Wallet): Promise<ConnectedWallet> {
  // Wallet aggregator wallet exports the Wallet interface as a class, so we will check if the wallet is an instance of the class
  // Dynamic wallet exports the Wallet interface as a type, so we will identify it check if two of its methods are present
  if (isWalletAggregatorWallet(wallet)) {
    // TODO: Wallet Aggregator Wallet
  }
  else if (isDynamicWallet(wallet)) {
    return toConnectedDynamicWallet(wallet)
  }

  throw new Error("Unknown wallet type")
}