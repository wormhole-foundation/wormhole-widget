import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Context } from '@wormhole-foundation/wormhole-connect-sdk';
import { CHAINS, TOKENS } from '../../sdk/config';
import { parseMessageFromTx, sendTransfer } from '../../sdk/sdk';
import { RootState } from '../../store';
import { setRoute } from '../../store/router';
import { setTxDetails, setSendTx } from '../../store/redeem';
import { validations, setValidations } from '../../utils/transferValidation';
import {
  registerWalletSigner,
  switchNetwork,
  TransferWallet,
} from '../../utils/wallet';
import { isTransferValid } from '../../utils/transferValidation';
import { displayWalletAddress } from '../../utils';
import Button from '../../components/Button';
import CircularProgress from '@mui/material/CircularProgress';

function Send(props: { valid: boolean }) {
  const dispatch = useDispatch();
  const { sending, receiving } = useSelector(
    (state: RootState) => state.wallet,
  );
  const transfer = useSelector((state: RootState) => state.transfer);
  const {
    fromNetwork,
    toNetwork,
    token,
    amount,
    destGasPayment,
    toNativeToken,
  } = transfer;
  const [inProgress, setInProgress] = useState(false);
  const [isConnected, setIsConnected] = useState(
    sending.currentAddress.toLowerCase() === sending.address.toLowerCase(),
  );

  async function send() {
    setValidations(transfer);
    const valid = isTransferValid(validations);
    if (!valid) return;
    setInProgress(true);
    try {
      const fromConfig = CHAINS[fromNetwork!];
      if (fromConfig?.context === Context.ETH) {
        registerWalletSigner(fromNetwork!, TransferWallet.SENDING);
        const { chainId } = CHAINS[fromNetwork!]!;
        await switchNetwork(chainId, TransferWallet.SENDING);
      }

      const tokenConfig = TOKENS[token]!;
      const sendToken = tokenConfig.tokenId;

      const receipt: any = await sendTransfer(
        sendToken || 'native',
        `${amount}`,
        fromNetwork!,
        sending.address,
        toNetwork!,
        receiving.address,
        destGasPayment,
        `${toNativeToken}`,
      );
      console.log('sent', receipt);
      const txId = receipt.transactionHash;
      console.log(txId);
      let message;
      const toRedeem = setInterval(async () => {
        if (message) {
          clearInterval(toRedeem);
          dispatch(setSendTx(txId));
          dispatch(setTxDetails(message));
          dispatch(setRoute('redeem'));
          setInProgress(false);
        } else {
          message = await parseMessageFromTx(txId, fromNetwork!);
        }
      }, 1000);
    } catch (e) {
      setInProgress(false);
      console.error(e);
    }
  }

  useEffect(() => {
    setIsConnected(
      sending.currentAddress.toLowerCase() === sending.address.toLowerCase(),
    );
  }, [sending]);

  return props.valid && !isConnected ? (
    <Button disabled elevated>
      Connect to {displayWalletAddress(sending.type, sending.address)}
    </Button>
  ) : (
    <Button
      onClick={send}
      action={props.valid}
      disabled={inProgress}
      elevated
    >
      {inProgress ? (
        <CircularProgress size={20} />
      ) : (
        'Approve and proceed with transaction'
      )}
    </Button>
  );
}

export default Send;
