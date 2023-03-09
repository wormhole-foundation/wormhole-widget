import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { BigNumber } from 'ethers';
import { Theme } from '@mui/material';
import { RootState } from '../../store';
import { setFromNetworksModal, setTokensModal } from '../../store/router';
import { TransferWallet } from '../../utils/wallet';
import { setAmount } from '../../store/transfer';
import {
  setBalance as setStoreBalance,
  formatBalance,
} from '../../store/transfer';
import { ERROR_BORDER, joinClass } from '../../utils/style';
import { CHAINS, TOKENS } from '../../sdk/config';
import { getBalance, getNativeBalance } from '../../sdk/sdk';

import NetworkTile from './NetworkTile';
import InputContainer from '../../components/InputContainer';
import InputTransparent from '../../components/InputTransparent';
import ConnectWallet from '../../components/ConnectWallet';
import TokensModal from './Modals/TokensModal';
import TokenIcon from '../../icons/TokenIcons';
import ValidationError from './ValidationError';
import { validate } from '../../utils/transferValidation';

const useStyles = makeStyles((theme: Theme) => ({
  outerContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 16px',
  },
  headerTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  content: {
    display: 'flex',
    width: '100%',
    height: '158px',
  },
  inputs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    height: '100%',
    width: '100%',
  },
  input: {
    cursor: 'text',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.card.secondary,
    borderRadius: '8px',
    width: '100%',
    flexGrow: '1',
    padding: '12px',
  },
  label: {
    fontSize: '14px',
    color: theme.palette.text.secondary,
    marginBottom: '4px',
  },
  tokenIcon: {
    width: '24px',
    height: '24px',
  },
  tokenSelect: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pointer: {
    cursor: 'pointer',
  },
  amtRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: '8px',
  },
  balance: {
    maxWidth: '150px',
    flexGrow: 'unset',
    flexShrink: '2',
    backgroundColor: 'transparent',
  },
  error: ERROR_BORDER(theme),
}));

function SendFrom() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [balance, setBalance] = useState(undefined as string | undefined);

  // store values
  const showTokensModal = useSelector(
    (state: RootState) => state.router.showTokensModal,
  );
  const fromNetwork = useSelector(
    (state: RootState) => state.transfer.fromNetwork,
  );
  const walletAddr = useSelector(
    (state: RootState) => state.wallet.sending.address,
  );
  const {
    validate: showErrors,
    validations,
    token,
  } = useSelector((state: RootState) => state.transfer);
  const tokenConfig = token && TOKENS[token];
  const fromNetworkConfig = fromNetwork ? CHAINS[fromNetwork] : undefined;

  // set store values
  const openFromNetworksModal = () => dispatch(setFromNetworksModal(true));
  const openTokensModal = () => dispatch(setTokensModal(true));
  function handleAmountChange(event) {
    dispatch(setAmount(event.target.value));
  }
  function validateAmount() {
    console.log('validate amount');
    validate(dispatch);
  }

  // amount input focus
  const amtId = 'sendAmt';
  function focusAmt() {
    const input = document.getElementById(amtId);
    if (!input) return;
    input.focus();
  }

  // balance
  useEffect(() => {
    if (!fromNetwork || !tokenConfig || !walletAddr) return;
    if (tokenConfig.tokenId) {
      getBalance(walletAddr, tokenConfig.tokenId, fromNetwork).then(
        (res: BigNumber | null) => {
          const balance = formatBalance(fromNetwork, tokenConfig, res);
          setBalance(balance[tokenConfig.symbol]);
          dispatch(setStoreBalance(balance));
        },
      );
    } else {
      getNativeBalance(walletAddr, fromNetwork).then((res: BigNumber) => {
        const balance = formatBalance(fromNetwork, tokenConfig, res);
        setBalance(balance[tokenConfig.symbol]);
        dispatch(setStoreBalance(balance));
      });
    }
  }, [tokenConfig, fromNetwork, walletAddr]);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.headerTitle}>From</div>
        <ConnectWallet type={TransferWallet.SENDING} />
      </div>

      <ValidationError validations={[validations.sendingWallet]} />

      <InputContainer>
        <div className={classes.outerContainer}>
          <div className={classes.content}>
            <NetworkTile
              network={fromNetworkConfig}
              error={!!(showErrors && validations.fromNetwork)}
              onClick={openFromNetworksModal}
            />
            <div className={classes.inputs}>
              <div
                className={joinClass([
                  classes.card,
                  classes.pointer,
                  !!(showErrors && validations.token) && classes.error,
                ])}
                onClick={openTokensModal}
              >
                <div className={classes.label}>Asset</div>
                {tokenConfig ? (
                  <div className={classes.tokenSelect}>
                    <TokenIcon name={tokenConfig.icon} height={24} />
                    {tokenConfig.symbol}
                  </div>
                ) : (
                  <div className={classes.tokenSelect}>
                    <TokenIcon name="no token" height={24} />
                    Select
                  </div>
                )}
              </div>
              <div className={classes.amtRow}>
                <div
                  className={joinClass([
                    classes.card,
                    token && classes.input,
                    !!(showErrors && validations.amount) && classes.error,
                  ])}
                  onClick={focusAmt}
                >
                  <div className={classes.label}>Amount</div>
                  {token ? (
                    <InputTransparent
                      placeholder="0.00"
                      id={amtId}
                      type="number"
                      min={0}
                      step={0.1}
                      onChange={handleAmountChange}
                      onPause={validateAmount}
                    />
                  ) : (
                    <div>-</div>
                  )}
                </div>
                <div
                  className={joinClass([classes.card, classes.balance])}
                  onClick={focusAmt}
                >
                  <div className={classes.label}>Balance</div>
                  <div>{token && balance && balance ? balance : '-'}</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '8px' }}>
            <ValidationError
              validations={[
                validations.fromNetwork,
                validations.token,
                validations.amount,
              ]}
            />
          </div>
        </div>
      </InputContainer>
    </div>
  );
}

export default SendFrom;
