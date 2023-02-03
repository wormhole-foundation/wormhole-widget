import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { RootState } from '../../store';
import { PaymentOption } from '../../store/transfer';
import { registerWalletSigner, Wallet } from '../../utils/wallet';
import { ParsedVaa } from '../../utils/vaa';
import { claimTransfer } from '../../sdk/sdk';
import Header from './Header';
// import Confirmations from './Confirmations';
import Button from '../../components/Button';
import Spacer from '../../components/Spacer';
import { RenderRows } from '../../components/RenderRows';
import InputContainer from '../../components/InputContainer';
import { handleConnect } from '../../components/ConnectWallet';
import CircularProgress from '@mui/material/CircularProgress';
import { displayEvmAddress } from '../../utils';

const rows = [
  {
    title: 'Amount',
    value: '20.1 MATIC',
  },
  {
    title: 'Native gas token',
    value: '0.5 FTM',
  },
];

function SendTo() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const vaa: ParsedVaa = useSelector((state: RootState) => state.redeem.vaa);
  const toNetwork = useSelector((state: RootState) => state.transfer.toNetwork);
  const destGasPayment = useSelector(
    (state: RootState) => state.transfer.destGasPayment,
  );
  const toAddr = useSelector(
    (state: RootState) => state.wallet.receiving.address,
  );
  const receiving = useSelector(
    (state: RootState) => state.wallet.receiving,
  )
  const [inProgress, setInProgress] = useState(false);
  const [isConnected, setIsConnected] = useState(receiving.currentAddress.toLowerCase() === receiving.address.toLowerCase());
  // const pending = vaa.guardianSignatures < REQUIRED_CONFIRMATIONS;
  const claim = async () => {
    setInProgress(true);
    try {
      registerWalletSigner(Wallet.RECEIVING);
      claimTransfer(toNetwork!, Buffer.from(vaa.bytes));
      setInProgress(false);
    } catch(e) {
      setInProgress(false);
    }
  }
  const connect = async () => {
    handleConnect(dispatch, theme, Wallet.RECEIVING);
  }

  useEffect(() => {
    setIsConnected(receiving.currentAddress.toLowerCase() === receiving.address.toLowerCase());
  }, [receiving])

  return (
    <div>
      <InputContainer>
        <Header network={toNetwork!} address={toAddr!} txHash={vaa?.txHash} />
        <RenderRows rows={rows} />
      </InputContainer>
      {destGasPayment === PaymentOption.MANUAL && (
        <>
          <Spacer height={8} />
          {toAddr ? isConnected ? (
            <Button onClick={claim} action disabled={inProgress}>
              {inProgress ? <CircularProgress size={18} /> : 'Claim'}
            </Button>
          ) : (
            <Button disabled elevated>Connect to {displayEvmAddress(receiving.address)}</Button>
          ) : (
            <Button onClick={connect} action>Connect wallet</Button>
          )}
        </>
      )}
      {/* {pending && <Confirmations confirmations={vaa.guardianSignatures} />} */}
    </div>
  );
}

export default SendTo;
