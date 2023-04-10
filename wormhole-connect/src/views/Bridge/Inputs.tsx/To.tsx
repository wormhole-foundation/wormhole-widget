import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BigNumber } from 'ethers';
import { RootState } from '../../../store';
import { setToNetworksModal } from '../../../store/router';
import { TransferWallet } from '../../../utils/wallet';
import { TOKENS } from '../../../config';
import { getBalance, getForeignAsset } from '../../../sdk';
import { formatBalance, setForeignAsset } from '../../../store/transfer';

import Inputs from './Inputs';
import Input from './Input';
import Select from './Select';
import InputTransparent from '../../../components/InputTransparent';
import { getWrappedToken } from '../../../utils';
import { Link, Typography } from '@mui/material';

const { REACT_APP_ATTEST_URL } = process.env;

function ToInputs() {
  const dispatch = useDispatch();
  const [balance, setBalance] = useState(undefined as string | undefined);

  const { validations, fromNetwork, toNetwork, token, amount, foreignAsset } =
    useSelector((state: RootState) => state.transfer);
  const wallet = useSelector((state: RootState) => state.wallet.receiving);

  const tokenConfig = TOKENS[token];

  const openToNetworksModal = () => dispatch(setToNetworksModal(true));

  // get balance on destination chain
  useEffect(() => {
    if (!fromNetwork || !toNetwork || !tokenConfig || !wallet.address) {
      return setBalance(undefined);
    }
    const { tokenId } = tokenConfig.tokenId
      ? tokenConfig
      : TOKENS[tokenConfig.wrappedAsset!];
    getBalance(wallet.address, tokenId!, toNetwork).then(
      (res: BigNumber | null) => {
        const balance = formatBalance(toNetwork, tokenConfig, res);
        setBalance(balance[tokenConfig.symbol]);
      },
    );
  }, [tokenConfig, fromNetwork, toNetwork, wallet.address]);

  // check if the destination token contract is deployed
  useEffect(() => {
    const checkWrappedTokenExists = async () => {
      if (!toNetwork || !token) {
        setForeignAsset('');
        return;
      }

      const tokenConfig = TOKENS[token];
      const config = tokenConfig.tokenId
        ? tokenConfig.tokenId
        : getWrappedToken(tokenConfig).tokenId;

      if (!config) {
        throw new Error('Could not retrieve target token info');
      }

      const address = await getForeignAsset(config, toNetwork);
      if (address) setForeignAsset(address);
    };
    checkWrappedTokenExists();
  }, [toNetwork, token]);

  // token display jsx
  const symbol = tokenConfig && getWrappedToken(tokenConfig).symbol;
  const selectedToken = tokenConfig
    ? { icon: tokenConfig.icon, text: symbol }
    : undefined;
  const tokenInput = <Select label="Asset" selected={selectedToken} />;

  // amount display jsx
  const amountInput = (
    <Input label="Amount">
      <InputTransparent placeholder="-" disabled value={amount || ''} />
    </Input>
  );

  const createAssociatedTokenAccount = (address: string) => {
    if (!address)
      throw new Error(
        'The token must be registered on Solana before an associated token account can be created',
      );
    console.log('create account');
  };

  // destination token warnings
  const tokenWarning = (
    <Typography>
      This token is not registered, you must{' '}
      <Link target={'_blank'} variant="inherit" href={REACT_APP_ATTEST_URL}>
        register
      </Link>{' '}
      it before you continue. Newly registered tokens will not have liquid
      markets.
    </Typography>
  );

  let warnings: React.ReactNode[] = [];
  if (toNetwork && token && !foreignAsset) warnings = [tokenWarning];

  return (
    <Inputs
      title="To"
      wallet={TransferWallet.RECEIVING}
      walletValidations={[validations.receivingWallet]}
      walletError={wallet.error}
      inputValidations={[validations.toNetwork]}
      network={toNetwork}
      networkValidation={validations.toNetwork}
      onNetworkClick={openToNetworksModal}
      tokenInput={tokenInput}
      amountInput={amountInput}
      balance={balance}
      warnings={warnings}
    />
  );
}

export default ToInputs;
