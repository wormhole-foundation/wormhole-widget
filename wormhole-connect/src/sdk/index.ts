import { Network as Environment } from '@certusone/wormhole-sdk';
import { BigNumber, utils } from 'ethers';
import {
  WormholeContext,
  TokenId,
  ChainId,
  ChainName,
  MAINNET_CHAINS,
} from '@wormhole-foundation/wormhole-connect-sdk';
import { Transaction } from '@solana/web3.js';

import { getTokenById, getTokenDecimals, getWrappedTokenId } from '../utils';
import { TOKENS, WH_CONFIG } from '../config';
import { postVaa, signSolanaTransaction, TransferWallet } from 'utils/wallet';
import { toFixedDecimals } from 'utils/balance';

export enum PaymentOption {
  MANUAL = 1,
  AUTOMATIC = 3,
}

const { REACT_APP_ENV } = process.env;

export const wh = new WormholeContext(REACT_APP_ENV! as Environment, WH_CONFIG);

export interface ParsedMessage {
  sendTx: string;
  sender: string;
  amount: string;
  payloadID: number;
  recipient: string;
  toChain: ChainName;
  fromChain: ChainName;
  tokenAddress: string;
  tokenChain: ChainName;
  tokenSymbol: string;
  tokenDecimals: number;
  emitterAddress: string;
  sequence: string;
  payload?: string;
  gasFee?: string;
}

export interface ParsedRelayerMessage extends ParsedMessage {
  relayerPayloadId: number;
  to: string;
  relayerFee: string;
  toNativeTokenAmount: string;
}

export const formatAddress = (chain: ChainName | ChainId, address: string) => {
  const context = wh.getContext(chain);
  return context.formatAddress(address);
};

export const parseAddress = (chain: ChainName | ChainId, address: string) => {
  const context = wh.getContext(chain);
  return context.parseAddress(address);
};

export const registerSigner = (chain: ChainName | ChainId, signer: any) => {
  console.log(`registering signer for ${chain}:`, signer);
  wh.registerSigner(chain, signer);
};

export const getForeignAsset = async (
  tokenId: TokenId,
  chain: ChainName | ChainId,
): Promise<string> => {
  return await wh.getForeignAsset(tokenId, chain);
};

export const getBalance = async (
  walletAddr: string,
  tokenId: TokenId,
  chain: ChainName | ChainId,
): Promise<BigNumber | null> => {
  return await wh.getTokenBalance(walletAddr, tokenId, chain);
};

export const getNativeBalance = async (
  walletAddr: string,
  chain: ChainName | ChainId,
): Promise<BigNumber> => {
  return await wh.getNativeBalance(walletAddr, chain);
};

export const parseMessageFromTx = async (
  tx: string,
  chain: ChainName | ChainId,
) => {
  const parsed: any = (await wh.parseMessageFromTx(tx, chain))[0];

  const tokenId = {
    address: parsed.tokenAddress,
    chain: parsed.tokenChain,
  };
  const decimals = await fetchTokenDecimals(tokenId, parsed.fromChain);
  const token = getTokenById(tokenId);

  const base = {
    ...parsed,
    amount: parsed.amount.toString(),
    tokenSymbol: token?.symbol,
    tokenDecimals: decimals,
    sequence: parsed.sequence.toString(),
    gasFee: parsed.gasFee ? parsed.gasFee.toString() : undefined,
  };
  // get wallet address of associated token account for Solana
  if (parsed.toChainId === MAINNET_CHAINS.solana) {
    const accountOwner = await getSolTokenAccountOwner(parsed.recipient);
    base.recipient = accountOwner;
  }
  if (parsed.payloadID === PaymentOption.MANUAL) {
    return base;
  }
  return {
    ...base,
    relayerFee: parsed.relayerFee.toString(),
    toNativeTokenAmount: parsed.toNativeTokenAmount.toString(),
  };
};

export const getRelayerFee = async (
  sourceChain: ChainName | ChainId,
  destChain: ChainName | ChainId,
  token: string,
) => {
  const EthContext: any = wh.getContext(destChain);
  const tokenConfig = TOKENS[token];
  if (!tokenConfig) throw new Error('could not get token config');
  const tokenId = tokenConfig.tokenId || getWrappedTokenId(tokenConfig);
  return await EthContext.getRelayerFee(sourceChain, destChain, tokenId);
};

export const sendTransfer = async (
  token: TokenId | 'native',
  amount: string,
  fromNetwork: ChainName | ChainId,
  fromAddress: string,
  toNetwork: ChainName | ChainId,
  toAddress: string,
  paymentOption: PaymentOption,
  toNativeToken?: string,
) => {
  console.log('preparing send');
  const fromChainId = wh.toChainId(fromNetwork);
  const decimals = getTokenDecimals(fromChainId, token);
  const parsedAmt = utils.parseUnits(amount, decimals);
  if (paymentOption === PaymentOption.MANUAL) {
    console.log('send with manual');
    const tx = await wh.send(
      token,
      parsedAmt.toString(),
      fromNetwork,
      fromAddress,
      toNetwork,
      toAddress,
      undefined,
    );
    if (fromChainId !== MAINNET_CHAINS.solana) {
      wh.registerProviders();
      return tx;
    }
    const solTx = await signSolanaTransaction(
      tx as Transaction,
      TransferWallet.SENDING,
    );
    wh.registerProviders();
    return solTx;
  } else {
    console.log('send with relay');
    const parsedNativeAmt = toNativeToken
      ? utils.parseUnits(toNativeToken, decimals).toString()
      : '0';
    const tx = await wh.sendWithRelay(
      token,
      parsedAmt.toString(),
      fromNetwork,
      fromAddress,
      toNetwork,
      toAddress,
      parsedNativeAmt,
    );
    // relay not supported on Solana, so we can just return the ethers receipt
    wh.registerProviders();
    return tx;
  }
};

export const estimateGasFee = async (
  token: TokenId | 'native',
  amount: string,
  fromNetwork: ChainName | ChainId,
  fromAddress: string,
  toNetwork: ChainName | ChainId,
  toAddress: string,
  paymentOption: PaymentOption,
  toNativeToken?: string,
): Promise<string> => {
  console.log('estimating fees');
  const fromChainId = wh.toChainId(fromNetwork);
  const decimals = getTokenDecimals(fromChainId, token);
  const parsedAmt = utils.parseUnits(amount, decimals);
  const context = wh.getContext(fromNetwork) as any;
  const provider = wh.mustGetProvider(fromNetwork);
  if (fromChainId === MAINNET_CHAINS.solana) {
    // const connection = context.connection;
    // if (!connection) throw new Error('no connection');
    // const tx = await context.send(
    //   token,
    //   parsedAmt.toString(),
    //   fromNetwork,
    //   fromAddress,
    //   toNetwork,
    //   toAddress,
    //   undefined,
    // );
    // const fees = await tx.getEstimatedFee(connection);
    // const parsed = utils.parseUnits(`${fees}`, 9).toString();
    // return toFixedDecimals(parsed, 6);
    // right now, there's just a flat cost for bridge transfers from solana
    return '0.000015';
  } else {
    const gasPrice = await provider.getGasPrice();
    if (paymentOption === PaymentOption.MANUAL) {
      const tx = await context.prepareSend(
        token,
        parsedAmt.toString(),
        fromNetwork,
        fromAddress,
        toNetwork,
        toAddress,
        undefined,
      );
      const est = await provider.estimateGas(tx);
      const gasFee = est.mul(gasPrice);
      return toFixedDecimals(utils.formatEther(gasFee), 6);
    } else {
      const parsedNativeAmt = toNativeToken
        ? utils.parseUnits(toNativeToken, decimals).toString()
        : '0';
      const tx = await context.prepareSendWithRelay(
        token,
        parsedAmt.toString(),
        parsedNativeAmt,
        fromNetwork,
        fromAddress,
        toNetwork,
        toAddress,
      );
      const est = await provider.estimateGas(tx);
      const gasFee = est.mul(gasPrice);
      return toFixedDecimals(utils.formatEther(gasFee), 6);
    }
  }
};

export const estimateClaimGasFee = async (destChain: ChainName | ChainId) => {
  const destChainId = wh.toChainId(destChain);
  if (destChainId === MAINNET_CHAINS.solana) return '0.000025';

  const provider = wh.mustGetProvider(destChain);
  const gasPrice = await provider.getGasPrice();

  const est = BigNumber.from('300000');
  const gasFee = est.mul(gasPrice);
  return toFixedDecimals(utils.formatEther(gasFee), 6);
};

export const calculateMaxSwapAmount = async (
  destChain: ChainName | ChainId,
  token: TokenId,
) => {
  const EthContext: any = wh.getContext(destChain);
  return await EthContext.calculateMaxSwapAmount(destChain, token);
};

export const calculateNativeTokenAmt = async (
  destChain: ChainName | ChainId,
  token: TokenId,
  amount: BigNumber,
) => {
  const EthContext: any = wh.getContext(destChain);
  return await EthContext.calculateNativeTokenAmt(destChain, token, amount);
};

export const claimTransfer = async (
  destChain: ChainName | ChainId,
  vaa: Uint8Array,
  payerAddr: string,
) => {
  // post vaa (solana)
  // TODO: move to context
  const destChainId = wh.toChainId(destChain);
  if (destChainId === MAINNET_CHAINS.solana) {
    const destContext = wh.getContext(destChain) as any;
    const connection = destContext.connection;
    if (!connection) throw new Error('no connection');
    const contracts = wh.mustGetContracts(destChain);
    if (!contracts.core) throw new Error('contract not found');
    await postVaa(connection, contracts.core, Buffer.from(vaa));
  }

  const tx = await wh.redeem(destChain, vaa, { gasLimit: 250000 }, payerAddr);
  if (destChainId !== MAINNET_CHAINS.solana) {
    wh.registerProviders();
    return tx;
  }
  const solTx = await signSolanaTransaction(
    tx as Transaction,
    TransferWallet.RECEIVING,
  );
  wh.registerProviders();
  return solTx;
};

export const fetchTokenDecimals = async (
  tokenId: TokenId,
  chain: ChainName | ChainId,
) => {
  return await wh.fetchTokenDecimals(tokenId, chain);
};

export const getTransferComplete = async (
  destChain: ChainName | ChainId,
  signedVaa: string,
): Promise<boolean> => {
  return await wh.isTransferCompleted(destChain, signedVaa);
};

export const getTxIdFromReceipt = (
  sourceChain: ChainName | ChainId,
  receipt: any,
): string => {
  return wh.getTxIdFromReceipt(sourceChain, receipt);
};

export const getCurrentBlock = async (
  chain: ChainName | ChainId,
): Promise<number> => {
  const chainId = wh.toChainId(chain);
  const context: any = wh.getContext(chain);
  if (chainId === MAINNET_CHAINS.solana) {
    const connection = context.connection;
    if (!connection) throw new Error('no connection');
    return await connection.getSlot();
  } else {
    const provider = wh.mustGetProvider(chain);
    return await provider.getBlockNumber();
  }
};

export const getSolTokenAccountOwner = async (address: string) => {
  const context: any = wh.getContext(MAINNET_CHAINS.solana);
  return await context.getTokenAccountOwner(address);
};
