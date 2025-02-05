import {
  ConfirmOptions,
  Connection,
  RpcResponseAndContext,
  SignatureResult,
} from '@solana/web3.js';

import config from 'config';

import { SolanaUnsignedTransaction } from '@wormhole-foundation/sdk-solana';
import { Network } from '@wormhole-foundation/sdk';
import { setPriorityFeeInstructions } from 'utils/solana';
import { isSolanaWallet } from '@dynamic-labs/solana';
import { ConnectedWallet } from './wallet';
import { DynamicWallet } from 'utils/dynamic-wallet/utils';

// This function signs and sends the transaction while constantly checking for confirmation
// and resending the transaction if it hasn't been confirmed after the specified interval
// See https://docs.triton.one/chains/solana/sending-txs for more information
export async function signAndSendTransaction(
  request: SolanaUnsignedTransaction<Network>,
  connectedWallet: ConnectedWallet,
  options?: ConfirmOptions,
) {
  if (!connectedWallet) throw new Error('Wallet not found');
  if (!config.rpcs.Solana) throw new Error('Solana RPC not found');
  const wallet = connectedWallet.getWallet() as DynamicWallet;

  if (!isSolanaWallet(wallet)) throw new Error('Wallet is not a Solana wallet');

  const commitment = options?.commitment ?? 'finalized';
  const connection = new Connection(config.rpcs.Solana);
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash(commitment);

  const unsignedTx = await setPriorityFeeInstructions(
    connection,
    blockhash,
    lastValidBlockHeight,
    request,
  );

  let confirmTransactionPromise: Promise<
    RpcResponseAndContext<SignatureResult>
  > | null = null;
  let confirmedTx: RpcResponseAndContext<SignatureResult> | null = null;
  let txSendAttempts = 1;
  let signature = '';
  const solanaSigner = await wallet.getSigner();
  const tx = await solanaSigner.signTransaction(unsignedTx);
  const serializedTx = tx.serialize();
  const sendOptions = {
    skipPreflight: true,
    maxRetries: 0,
    preFlightCommitment: commitment, // See PR and linked issue for why setting this matters: https://github.com/anza-xyz/agave/pull/483
  };
  signature = await connection.sendRawTransaction(serializedTx, sendOptions);
  confirmTransactionPromise = connection.confirmTransaction(
    {
      signature,
      blockhash,
      lastValidBlockHeight,
    },
    commitment,
  );

  // This loop will break once the transaction has been confirmed or the block height is exceeded.
  // An exception will be thrown if the block height is exceeded by the confirmTransactionPromise.
  // The transaction will be resent if it hasn't been confirmed after the interval.
  const txRetryInterval = 5000;
  while (!confirmedTx) {
    confirmedTx = await Promise.race([
      confirmTransactionPromise,
      new Promise<null>((resolve) =>
        setTimeout(() => {
          resolve(null);
        }, txRetryInterval),
      ),
    ]);
    if (confirmedTx) {
      break;
    }
    console.log(
      `Tx not confirmed after ${
        txRetryInterval * txSendAttempts++
      }ms, resending`,
    );
    try {
      await connection.sendRawTransaction(serializedTx, sendOptions);
    } catch (e) {
      console.error('Failed to resend transaction:', e);
    }
  }

  if (confirmedTx.value.err) {
    let errorMessage = `Transaction failed: ${confirmedTx.value.err}`;
    if (typeof confirmedTx.value.err === 'object') {
      try {
        errorMessage = `Transaction failed: ${JSON.stringify(
          confirmedTx.value.err,
          (_key, value) =>
            typeof value === 'bigint' ? value.toString() : value, // Handle bigint props
        )}`;
      } catch (e: unknown) {
        // Most likely a circular reference error, we can't stringify this error object.
        // See for more details:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#exceptions
        errorMessage = `Transaction failed: Unknown error`;
      }
    }
    throw new Error(`Transaction failed: ${errorMessage}`);
  }

  return signature;
}
