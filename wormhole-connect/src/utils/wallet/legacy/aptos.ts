import { Wallet } from '@xlabs-libs/wallet-aggregator-core';
import type { Network as AptosNetwork } from '@aptos-labs/wallet-adapter-core';
import { AptosWallet } from '@xlabs-libs/wallet-aggregator-aptos';

import { Network } from '@wormhole-foundation/sdk';
import {
  AptosUnsignedTransaction,
  AptosChains,
} from '@wormhole-foundation/sdk-aptos';

import config from 'config';
import { InputEntryFunctionData } from '@aptos-labs/ts-sdk';

export function fetchOptions() {
  const aptosWalletConfig = {
    network: config.isMainnet
      ? ('mainnet' as AptosNetwork)
      : ('testnet' as AptosNetwork),
  };
  const aptosWallets: Record<string, AptosWallet> = {};
  const walletCore = AptosWallet.walletCoreFactory(aptosWalletConfig, true, []);
  walletCore.wallets.forEach((wallet) => {
    aptosWallets[wallet.name] = new AptosWallet(wallet, walletCore);
  });
  return aptosWallets;
}

function isInputEntryFunctionData(data: any): data is InputEntryFunctionData {
  return (
    data &&
    typeof data === 'object' &&
    'function' in data &&
    'functionArguments' in data
  );
}

export async function signAndSendTransaction(
  request: AptosUnsignedTransaction<Network, AptosChains>,
  wallet: Wallet | undefined,
) {
  const payload = request.transaction;
  if (!isInputEntryFunctionData(payload)) {
    throw new Error('Unsupported transaction type');
  }
  // The wallets do not handle Uint8Array serialization
  // const payload = request.transaction as Types.EntryFunctionPayload;
  payload.functionArguments = payload.functionArguments.map((a: any) => {
    if (a instanceof Uint8Array) {
      return Array.from(a);
    } else if (typeof a === 'bigint') {
      return a.toString();
    } else {
      return a;
    }
  });

  const tx = await (wallet as AptosWallet).signAndSendTransaction({
    data: payload,
  });
  /*
   * TODO SDKV2
  const aptosClient = (
    config.wh.getContext('Aptos') as AptosContext<WormholeContext>
  ).aptosClient;
  await aptosClient.waitForTransaction(tx.id);
  */

  return tx;
}
