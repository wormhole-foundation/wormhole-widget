import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BigNumber, utils } from 'ethers';
import CircularProgress from '@mui/material/CircularProgress';
import { ChainName, Context } from '@wormhole-foundation/wormhole-connect-sdk';
import { RootState } from '../../store';
import { setRedeemTx, setTransferComplete } from '../../store/redeem';
import { displayAddress } from '../../utils';
import {
  registerWalletSigner,
  switchNetwork,
  TransferWallet,
} from '../../utils/wallet';
import { toDecimals } from '../../utils/balance';
import {
  wh,
  claimTransfer,
  estimateClaimGasFee,
  parseAddress,
  PaymentOption,
} from '../../sdk';
import { CHAINS } from '../../config';
import WalletsModal from '../WalletModal';
import { GAS_ESTIMATES } from '../../config/testnet';

import Header from './Header';
import AlertBanner from '../../components/AlertBanner';
// import Confirmations from './Confirmations';
import Button from '../../components/Button';
import Spacer from '../../components/Spacer';
import { RenderRows, RowsData } from '../../components/RenderRows';
import InputContainer from '../../components/InputContainer';

const calculateGas = async (chain: ChainName, receiveTx: string) => {
  if (chain === 'solana') {
    return toDecimals(BigNumber.from(GAS_ESTIMATES.solana!.claim), 9, 6);
  }
  if (receiveTx) {
    const provider = wh.mustGetProvider(chain);
    const receipt = await provider.getTransactionReceipt(receiveTx);
    return receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);
  }
  return await estimateClaimGasFee(chain);
};

const getRows = async (txData: any, receiveTx: string): Promise<RowsData> => {
  const decimals = txData.tokenDecimals > 8 ? 8 : txData.tokenDecimals;
  const type = txData.payloadID;
  const { gasToken } = CHAINS[txData.toChain]!;

  // get gas used (if complete) or gas estimate if not
  const gas = await calculateGas(txData.toChain, receiveTx);

  // manual transfers
  if (type === PaymentOption.MANUAL) {
    const formattedAmt = utils.formatUnits(txData.amount, decimals);
    return [
      {
        title: 'Amount',
        value: `${formattedAmt} ${txData.tokenSymbol}`,
      },
      {
        title: receiveTx ? 'Gas fee' : 'Gas estimate',
        value: `${gas} ${gasToken}`,
      },
    ];
  }

  // automatic transfers
  const receiveAmt = BigNumber.from(txData.amount).sub(
    BigNumber.from(txData.relayerFee),
  );
  const formattedAmt = utils.formatUnits(receiveAmt, decimals);
  const formattedToNative = utils.formatUnits(
    txData.toNativeTokenAmount,
    decimals,
  );
  return [
    {
      title: 'Amount',
      value: `${formattedAmt} ${txData.tokenSymbol}`,
    },
    {
      title: 'Native gas token',
      value: `${formattedToNative} ${gasToken}`,
    },
  ];
};

function SendTo() {
  const dispatch = useDispatch();
  const { vaa, redeemTx, transferComplete } = useSelector(
    (state: RootState) => state.redeem,
  );
  const txData = useSelector((state: RootState) => state.redeem.txData)!;
  const wallet = useSelector((state: RootState) => state.wallet.receiving);
  const [claimError, setClaimError] = useState('');

  const connect = () => {
    setWalletModal(true);
  };

  const checkConnection = () => {
    if (!txData) return;
    const addr = wallet.address.toLowerCase();
    const curAddr = wallet.currentAddress.toLowerCase();
    const formattedRecipient = parseAddress(txData.toChain, txData.recipient);
    const reqAddr = formattedRecipient.toLowerCase();
    return addr === curAddr && addr === reqAddr;
  };

  const [inProgress, setInProgress] = useState(false);
  const [isConnected, setIsConnected] = useState(checkConnection());
  const [rows, setRows] = useState([] as RowsData);
  const [openWalletModal, setWalletModal] = useState(false);

  useEffect(() => {
    if (!txData) return;
    const populate = async () => {
      const rows = await getRows(txData, redeemTx);
      setRows(rows);
    };
    populate();
  }, []);

  const claim = async () => {
    setInProgress(true);
    setClaimError('');
    if (!wallet || !isConnected) {
      setClaimError('Connect to receiving wallet');
      throw new Error('Connect to receiving wallet');
    }
    const networkConfig = CHAINS[txData.toChain]!;
    if (!networkConfig) {
      setClaimError('Your claim has failed, please try again');
      throw new Error('invalid destination chain');
    }
    try {
      if (networkConfig!.context === Context.ETH) {
        registerWalletSigner(txData.toChain, TransferWallet.RECEIVING);
        await switchNetwork(networkConfig.chainId, TransferWallet.RECEIVING);
      }
      const receipt = await claimTransfer(
        txData.toChain,
        utils.arrayify(vaa.bytes),
        wallet.address,
      );
      dispatch(setRedeemTx(receipt.transactionHash));
      dispatch(setTransferComplete(true));
      setInProgress(false);
      setClaimError('');
    } catch (e) {
      setInProgress(false);
      setClaimError('Your claim has failed, please try again');
      console.error(e);
    }
  };

  useEffect(() => {
    setIsConnected(checkConnection());
  }, [wallet]);

  return (
    <div>
      <InputContainer>
        <Header
          network={txData.toChain}
          address={txData.recipient}
          loading={inProgress && !transferComplete}
          txHash={redeemTx}
          error={claimError ? 'Error please retry . . .' : ''}
        />
        <RenderRows rows={rows} />
      </InputContainer>
      {txData.payloadID === PaymentOption.MANUAL && !transferComplete && (
        <>
          <Spacer height={8} />
          <AlertBanner
            show={!!claimError}
            content={claimError}
            error
            margin="0 0 8px 0"
          />
          {wallet.address ? (
            isConnected ? (
              <Button onClick={claim} action disabled={inProgress}>
                {inProgress ? <CircularProgress size={22} /> : 'Claim'}
              </Button>
            ) : (
              <Button onClick={connect} elevated>
                Connect to {displayAddress(txData.toChain, txData.recipient)}
              </Button>
            )
          ) : (
            <Button onClick={connect} action>
              Connect wallet
            </Button>
          )}
        </>
      )}
      {openWalletModal && (
        <WalletsModal
          type={TransferWallet.RECEIVING}
          chain={txData.toChain}
          onClose={() => setWalletModal(false)}
        />
      )}
      {/* {pending && <Confirmations confirmations={vaa.guardianSignatures} />} */}
    </div>
  );
}

export default SendTo;
