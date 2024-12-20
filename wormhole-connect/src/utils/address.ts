import { Chain, chainToPlatform, Wormhole } from '@wormhole-foundation/sdk';
import { isValidSuiAddress } from '@mysten/sui.js';
import { PublicKey } from '@solana/web3.js';
import { getAddress } from 'ethers';

function isEvmAddress(address: string): boolean {
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return false;
  try {
    getAddress(address);
    return true;
  } catch {
    return false;
  }
}

function isSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

function isAptosAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(address);
}

export function isValidWalletAddress(chain: Chain, address: string): boolean {
  const platform = chainToPlatform(chain);

  // Wormhole.chainAddress() is permissive and accepts various address formats,
  // including ICAP Ethereum addresses, hex-encoded Solana addresses, and attempts to parse as a UniversalAddress if parsing fails.
  // We are being more restrictive here to prevent the user from accidentally using an incorrect address.
  switch (platform) {
    case 'Evm':
      if (!isEvmAddress(address)) return false;
      break;
    case 'Solana':
      if (!isSolanaAddress(address)) return false;
      break;
    case 'Sui':
      if (!isValidSuiAddress(address)) return false;
      break;
    case 'Aptos':
      if (!isAptosAddress(address)) return false;
      break;
    default:
      break;
  }

  try {
    // This will throw an error if the address is invalid
    Wormhole.chainAddress(chain, address);
  } catch (e) {
    return false;
  }

  return true;
}
