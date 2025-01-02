import {
  Chain,
  chainToPlatform,
  encoding,
  NativeAddress,
  toNative,
} from '@wormhole-foundation/sdk';
import { isValidSuiAddress } from '@mysten/sui.js';
import { PublicKey } from '@solana/web3.js';
import { getAddress } from 'ethers';

function isValidEvmAddress(address: string): boolean {
  if (
    !address.startsWith('0x') ||
    address.length !== 42 ||
    !encoding.hex.valid(address)
  ) {
    return false;
  }

  try {
    getAddress(address);
    return true;
  } catch {
    return false;
  }
}

function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

function isValidAptosAddress(address: string): boolean {
  return (
    address.startsWith('0x') &&
    address.length === 66 &&
    encoding.hex.valid(address)
  );
}

export function validateWalletAddress(
  chain: Chain,
  address: string,
): NativeAddress<Chain> | null {
  const platform = chainToPlatform(chain);

  // Wormhole.chainAddress() is permissive and accepts various address formats,
  // including ICAP Ethereum addresses, hex-encoded Solana addresses, and attempts to parse as a UniversalAddress if parsing fails.
  // We are being more restrictive here to prevent the user from accidentally using an incorrect address.
  switch (platform) {
    case 'Evm':
      if (!isValidEvmAddress(address)) return null;
      break;
    case 'Solana':
      if (!isValidSolanaAddress(address)) return null;
      break;
    case 'Sui':
      if (!isValidSuiAddress(address)) return null;
      break;
    case 'Aptos':
      if (!isValidAptosAddress(address)) return null;
      break;
    default:
      console.warn(`Unsupported platform: ${platform}`);
      return null;
  }

  try {
    // This will throw an error if the address is invalid
    return toNative(chain, address);
  } catch (e) {
    console.error(
      `Invalid address for chain ${chain}: ${address}, error: ${e}`,
    );
  }

  return null;
}
