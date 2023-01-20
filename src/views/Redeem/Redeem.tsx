import React from 'react';
import { makeStyles } from '@mui/styles';
import Header from '../../components/Header';
import Spacer from '../../components/Spacer';
import NetworksTag from './Tag';
import { Theme } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import Stepper from './Stepper';
import { LINK } from '../../utils/style';

const useStyles = makeStyles((theme: Theme) => ({
  milestoneContent: {
    margin: 'auto',
    maxWidth: '700px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: LINK(theme),
  redirectIcon: {
    marginLeft: '8px',
  },
}));

function Redeem() {
  const classes = useStyles();

  return (
    <div className={classes.milestoneContent}>
      <Header text="Bridge" align="center" />
      <Spacer height={40} />
      <NetworksTag fromNetwork="polygon" toNetwork="fantom" />
      <a
        className={classes.link}
        href="https://wormhole.com/"
        target="_blank"
        rel="noreferrer"
      >
        <div>View on Wormhole Explorer</div>
        <LaunchIcon />
      </a>
      <Stepper />
      <Spacer height={60} />
    </div>
  );
}

export default Redeem;
