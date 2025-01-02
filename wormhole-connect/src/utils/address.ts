import {
  Chain,
  chainToPlatform,
  encoding,
  Wormhole,
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

export function isValidWalletAddress(chain: Chain, address: string): boolean {
  const platform = chainToPlatform(chain);

  // Wormhole.chainAddress() is permissive and accepts various address formats,
  // including ICAP Ethereum addresses, hex-encoded Solana addresses, and attempts to parse as a UniversalAddress if parsing fails.
  // We are being more restrictive here to prevent the user from accidentally using an incorrect address.
  switch (platform) {
    case 'Evm':
      if (!isValidEvmAddress(address)) return false;
      break;
    case 'Solana':
      if (!isValidSolanaAddress(address)) return false;
      break;
    case 'Sui':
      if (!isValidSuiAddress(address)) return false;
      break;
    case 'Aptos':
      if (!isValidAptosAddress(address)) return false;
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  try {
    // This will throw an error if the address is invalid
    Wormhole.chainAddress(chain, address);
  } catch (e) {
    console.error(
      `Invalid address for chain ${chain}: ${address}, error: ${e}`,
    );
    return false;
  }

  return true;
}
