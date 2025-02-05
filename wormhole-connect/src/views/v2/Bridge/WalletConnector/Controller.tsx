import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import {
  usePopupState,
  bindTrigger,
  bindPopover,
} from 'material-ui-popup-state/hooks';

import { RootState } from 'store';
import { useWalletManager } from 'contexts/WalletManager';
import { TransferWallet } from 'utils/wallet';
import { copyTextToClipboard, displayWalletAddress } from 'utils';

import DownIcon from 'icons/Down';
import config from 'config';
import ExplorerLink from './ExplorerLink';
import { Tooltip } from '@mui/material';

const useStyles = makeStyles()((theme: any) => ({
  connectWallet: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    cursor: 'pointer',
    paddingTop: '2px',
    opacity: 1.0,
  },
  walletAddress: {
    color: theme.palette.primary.main,
    marginLeft: '8px',
  },
  down: {
    color: theme.palette.primary.main,
    transition: 'transform 0.15s ease-in',
    strokeWidth: '2px',
  },
  up: {
    transform: 'scaleY(-1)',
  },
  dropdown: {
    backgroundColor: theme.palette.popover.background,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '8px',
  },
  dropdownItem: {
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.popover.secondary,
    },
  },
}));

type Props = {
  type: TransferWallet;
};

const COPY_MESSAGE_TIMOUT = 1000;

// Renders the connected state for a wallet given the type (sending | receiving)
const ConnectedWallet = (props: Props) => {
  const { getConnectedWallet, disconnectWallet: disconnectFromStore } =
    useWalletManager();

  const { classes } = useStyles();

  const wallet = useSelector((state: RootState) => state.wallet[props.type]);
  const connectedWallet = getConnectedWallet(props.type);

  const { connectWallet: _connectWallet } = useWalletManager();
  const [isCopied, setIsCopied] = useState(false);

  const popupState = usePopupState({
    variant: 'popover',
    popupId: `connected-wallet-popover-${props.type}`,
  });

  const connectWallet = useCallback(() => {
    popupState?.close();
    _connectWallet(props.type);
  }, [_connectWallet]);

  const copyAddress = useCallback(() => {
    copyTextToClipboard(wallet.address);
    popupState?.close();
    setIsCopied(true);
  }, [wallet.address]);

  const disconnectWallet = useCallback(async () => {
    await disconnectFromStore(props.type);
    popupState?.close();
  }, [props.type, disconnectFromStore]);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, COPY_MESSAGE_TIMOUT);
    }
  }, [isCopied]);

  if (!wallet?.address) {
    return <></>;
  }

  const WalletIcon = connectedWallet?.icon;

  return (
    <>
      <div className={classes.connectWallet} {...bindTrigger(popupState)}>
        {WalletIcon ? <WalletIcon size={20} /> : null}
        <Tooltip title="Copied" open={isCopied} placement="top" arrow>
          <Typography
            className={classes.walletAddress}
            fontSize={14}
            fontWeight={700}
          >
            {displayWalletAddress(wallet.type, wallet.address)}
          </Typography>
        </Tooltip>
        <DownIcon
          className={`${classes.down} ${popupState.isOpen ? classes.up : ''}`}
        />
      </div>
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List>
          <ListItemButton onClick={copyAddress}>
            <Typography fontSize={14}>Copy address</Typography>
          </ListItemButton>
          {config.ui.explorer ? (
            <ExplorerLink
              address={wallet.address}
              href={config.ui.explorer.href}
              target={config.ui.explorer.target}
              label={config.ui.explorer.label}
            />
          ) : null}
          <ListItemButton onClick={connectWallet}>
            <Typography fontSize={14}>Change wallet</Typography>
          </ListItemButton>
          <ListItemButton onClick={disconnectWallet}>
            <Typography fontSize={14}>Disconnect</Typography>
          </ListItemButton>
        </List>
      </Popover>
    </>
  );
};

export default ConnectedWallet;
