import { Wallet } from '@xlabs-libs/wallet-aggregator-core';
import { InputEntryFunctionData, InputMultiSigData, MoveFunctionId } from "@aptos-labs/ts-sdk"
import type { Network as AptosNetwork } from "@aptos-labs/wallet-adapter-core"
import { AptosWallet } from '@xlabs-libs/wallet-aggregator-aptos';

import type { Types } from 'aptos';

import { Network } from '@wormhole-foundation/sdk';
import {
  AptosUnsignedTransaction,
  AptosChains,
} from '@wormhole-foundation/sdk-aptos';

import config from 'config';

function convertPayloadInputV1ToV2(
  inputV1: Types.TransactionPayload
) {
  if ("function" in inputV1) {
    const inputV2: InputEntryFunctionData | InputMultiSigData = {
      function: inputV1.function as MoveFunctionId,
      functionArguments: inputV1.arguments,
      typeArguments: inputV1.type_arguments,
    };
    return inputV2;
  }

  throw new Error("Payload type not supported");
}


export function fetchOptions() {
  const aptosWalletConfig = { network: config.isMainnet ? "mainnet" as AptosNetwork : "testnet" as AptosNetwork }
  const aptosWallets: Record<string, AptosWallet> = {};
  const walletCore = AptosWallet.walletCoreFactory(aptosWalletConfig, true, [])
  walletCore.wallets.forEach((wallet) => {
    aptosWallets[wallet.name] = new AptosWallet(wallet, walletCore);
  });
  return aptosWallets;
}

export async function signAndSendTransaction(
  request: AptosUnsignedTransaction<Network, AptosChains>,
  wallet: Wallet | undefined,
) {
  // The wallets do not handle Uint8Array serialization
  const payload = request.transaction as Types.EntryFunctionPayload;
  if (payload.arguments) {
    payload.arguments = payload.arguments.map((a: any) => {
      if (a instanceof Uint8Array) {
        return Array.from(a);
      } else if (typeof a === 'bigint') {
        return a.toString();
      } else {
        return a;
      }
    });
  }

  const tx = await (wallet as AptosWallet).signAndSendTransaction({
    data: convertPayloadInputV1ToV2(payload as Types.TransactionPayload)
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
