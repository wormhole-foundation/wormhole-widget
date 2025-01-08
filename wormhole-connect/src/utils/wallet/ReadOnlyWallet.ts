import {
  Chain as WormholeChain,
  chainToChainId,
  NativeAddress,
  ChainId,
} from '@wormhole-foundation/sdk';
import { TransferWallet } from '.';
import {
  connectReceivingWallet,
  connectWallet as connectSourceWallet,
} from 'store/wallet';
import { Dispatch } from '@reduxjs/toolkit';
import { ConnectedWallet } from './wallet';
import React from 'react';
import { Context } from 'sdklegacy';
import config from 'config';
import EventEmitter from 'eventemitter3';

export type ReadOnlyWalletData = {
  name: string;
  type: Context;
  icon: any;
  isReady: boolean;
  wallet: ReadOnlyWallet;
};

export class ReadOnlyWallet extends EventEmitter {
  private _isConnected = true;

  static readonly NAME = 'ReadyOnlyWallet';

  constructor(
    readonly _address: NativeAddress<WormholeChain>,
    readonly _chain: WormholeChain,
  ) {
    super();
  }

  getName(): string {
    return ReadOnlyWallet.NAME;
  }

  getUrl(): string {
    return '';
  }

  async connect(): Promise<string[]> {
    this._isConnected = true;
    return [this._address.toString()];
  }

  async disconnect(): Promise<void> {
    this._isConnected = false;
  }

  getChainId(): ChainId {
    // TODO: wallet aggregator should use SDK ChainId type
    return chainToChainId(this._chain) as ChainId;
  }

  getNetworkInfo() {
    throw new Error('Method not implemented.');
  }

  getAddress(): string {
    return this._address.toString();
  }

  getAddresses(): string[] {
    return [this.getAddress()];
  }

  setMainAddress(address: string): void {
    // No-op: can't change address for read-only wallet
  }

  async getBalance(): Promise<string> {
    // Could implement this to fetch balance from RPC if needed
    throw new Error('Address only wallet cannot fetch balance');
  }

  isConnected(): boolean {
    return this._isConnected;
  }

  async signTransaction(tx: any): Promise<any> {
    throw new Error('Address only wallet cannot sign transactions');
  }

  async sendTransaction(tx: any): Promise<any> {
    throw new Error('Address only wallet cannot send transactions');
  }

  async signMessage(msg: any): Promise<any> {
    throw new Error('Address only wallet cannot sign messages');
  }

  async signAndSendTransaction(tx: any): Promise<any> {
    throw new Error('Address only wallet cannot sign or send transactions');
  }

  getFeatures(): string[] {
    return [];
  }

  supportsChain(chainId: ChainId): boolean {
    return this.getChainId() === chainId;
  }
}

export function isReadOnlyWallet(wallet: any): wallet is ReadOnlyWalletData {
  return wallet && wallet.wallet instanceof ReadOnlyWallet;
}

export async function toConnectedReadOnlyWallet(
  walletInfo: ReadOnlyWalletData,
  type: TransferWallet,
  chain: WormholeChain,
  dispatch: Dispatch,
): Promise<ConnectedWallet> {
  const wallet = walletInfo.wallet;

  config.triggerEvent({
    type: 'wallet.connect',
    details: {
      side: type,
      chain: chain,
      wallet: wallet.getName(),
    },
  });

  const payload = {
    address: wallet.getAddress(),
    type: walletInfo.type,
    name: wallet.getName(),
  };
  if (type === TransferWallet.SENDING) {
    dispatch(connectSourceWallet(payload));
  } else {
    dispatch(connectReceivingWallet(payload));
  }

  return {
    address: wallet.getAddress(),
    disconnect: async () => {
      wallet.disconnect();
    },
    getWallet: () => walletInfo,
    getNetworkInfo: () => Promise.resolve(null),
    getWalletKey: () => wallet.getName(),
    // TODO: Create an icon for readonly wallets
    icon: () => React.createElement('div') as any,
    // onDisconnect: (listener) => wallet.on("disconnect", listener)
  };
}
