import {
  EvmUnsignedTransaction,
  EvmChains,
} from '@wormhole-foundation/sdk-evm';
import { Network } from '@wormhole-foundation/sdk';
import { getBigInt } from 'ethers';
import type { ConnectedWallet } from './wallet';
import config from 'config';

export async function switchChain(w: ConnectedWallet, chainId: number | string) {
  await w.switchChain?.(chainId as number);
}

export async function signAndSendTransaction(
  request: EvmUnsignedTransaction<Network, EvmChains>,
  w: ConnectedWallet,
  chainName: string,
  options: any, // TODO ?!?!!?!?
): Promise<string> {
  // TODO remove reliance on SDkv1 here (multi-provider)
  // TODO: Make sure that wont break anything from dynamic wallet
  const signer = config.whLegacy.getSigner(chainName);
  if (!signer) throw new Error('No signer found for chain' + chainName);

  // Ensure the signer is connected to the correct chain
  const provider = await signer.provider?.getNetwork();
  const expectedChainId = request.transaction.chainId
    ? getBigInt(request.transaction.chainId)
    : undefined;
  const actualChainId = provider?.chainId;

  if (!actualChainId || !expectedChainId || actualChainId !== expectedChainId) {
    throw new Error(
      `Signer is not connected to the right chain. Expected ${expectedChainId}, got ${actualChainId}`,
    );
  }

  const tx = await signer.sendTransaction(request.transaction);
  const result = await tx.wait();

  return result?.hash || "";
}
