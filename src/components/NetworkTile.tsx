import { makeStyles } from '@mui/styles';
import React from 'react';
import { Theme } from '@mui/material';
import NoNetworkIcon from '../icons/no-network.png';
import { ChainConfig } from '../sdk/types';

const useStyles = makeStyles((theme: Theme) => ({
  networkTile: {
    backgroundImage: `linear-gradient(-30deg, ${theme.palette.primary[800]} 0%, ${theme.palette.card.background} 100%)`,
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '224px',
    cursor: 'pointer',
  },
  networkIcon: {
    width: '100px',
    height: '100px',
  },
  networkHeader: {
    fontSize: '14px',
    opacity: '60%',
    marginTop: '16px',
    marginBottom: '8px',
  },
  networkName: {
    fontSize: '16px',
  },
}));

type Props = {
  title: string;
  network?: ChainConfig;
  onClick: React.MouseEventHandler<HTMLDivElement>;
};

function NetworksTile(props: Props) {
  const classes = useStyles();
  return (
    <div className={classes.networkTile} onClick={props.onClick}>
      {props.network ? (
        <img
          className={classes.networkIcon}
          src={props.network.icon}
          alt={props.network.displayName}
        />
      ) : (
        <img
          className={classes.networkIcon}
          src={NoNetworkIcon}
          alt="Select Network"
        />
      )}
      <div className={classes.networkHeader}>{props.title}</div>
      <div className={classes.networkName}>
        {props.network ? props.network.displayName : 'Select network'}
      </div>
    </div>
  );
}

export default NetworksTile;
