import {
  Chain as WormholeChain,
  chainToChainId,
  NativeAddress,
  ChainId as WormholeChainId,
} from '@wormhole-foundation/sdk';
import { TransferWallet } from '.';
import {
  connectReceivingWallet,
  connectWallet as connectSourceWallet,
} from 'store/wallet';
import { Dispatch } from '@reduxjs/toolkit';
import { ConnectedWallet } from './wallet';
import React from 'react';
import { ChainConfig, Context } from 'sdklegacy';
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

  async connect(): Promise<string[]> {
    this._isConnected = true;
    return [this._address.toString()];
  }

  async disconnect(): Promise<void> {
    this._isConnected = false;
  }

  getChainId(): WormholeChainId {
    return chainToChainId(this._chain);
  }

  getAddress(): string {
    return this._address.toString();
  }

  getAddresses(): string[] {
    return [this.getAddress()];
  }

  isConnected(): boolean {
    return this._isConnected;
  }

  supportsChain(chainId: WormholeChainId): boolean {
    return this.getChainId() === chainId;
  }
}

export function createReadOnlyWalletData(
  address: NativeAddress<WormholeChain>,
  chain: WormholeChain,
  chainConfig: ChainConfig
): ReadOnlyWalletData {
  const wallet = new ReadOnlyWallet(address, chain);

  return {
    name: wallet.getName(),
    type: chainConfig.context,
    icon: '',
    isReady: true,
    wallet,
  };
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
