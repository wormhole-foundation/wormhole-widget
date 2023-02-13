import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CHAINS, TOKENS } from '../../sdk/config';
import { parseMessageFromTx, sendTransfer } from '../../sdk/sdk';
import { RootState } from '../../store';
import { setRoute } from '../../store/router';
import { setTxDetails, setSendTx } from '../../store/redeem';
// import { clearTransfer } from '../../store/transfer';
import {
  registerWalletSigner,
  switchNetwork,
  TransferWallet,
} from '../../utils/wallet';
import { displayEvmAddress } from '../../utils';
import Button from '../../components/Button';
import CircularProgress from '@mui/material/CircularProgress';

function Send(props: { valid: boolean }) {
  const dispatch = useDispatch();
  const {
    fromNetwork,
    toNetwork,
    token,
    amount,
    destGasPayment,
    toNativeToken,
  } = useSelector((state: RootState) => state.transfer);
  const { sending, receiving } = useSelector(
    (state: RootState) => state.wallet,
  );
  const [inProgress, setInProgress] = useState(false);
  const [isConnected, setIsConnected] = useState(
    sending.currentAddress.toLowerCase() === sending.address.toLowerCase(),
  );

  async function send() {
    setInProgress(true);
    try {
      registerWalletSigner(fromNetwork!, TransferWallet.SENDING);
      const { chainId } = CHAINS[fromNetwork!]!;
      await switchNetwork(chainId, TransferWallet.SENDING);
      // TODO: better validation
      if (!amount) throw new Error('invalid input, specify an amount');
      if (!token) throw new Error('invalid input, specify an asset');
      const tokenConfig = TOKENS[token];
      if (!tokenConfig) throw new Error('invalid token');
      const sendToken = tokenConfig.tokenId;

      const receipt = await sendTransfer(
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
      const message = await parseMessageFromTx(
        receipt.transactionHash,
        fromNetwork!,
      );
      dispatch(setSendTx(receipt.transactionHash));
      dispatch(setTxDetails(message));
      // TODO: clear inputs
      // dispatch(clearTransfer);
      dispatch(setRoute('redeem'));
      setInProgress(false);
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
      Connect to {displayEvmAddress(sending.address)}
    </Button>
  ) : (
    <Button
      onClick={send}
      action={props.valid}
      disabled={!props.valid || inProgress}
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
