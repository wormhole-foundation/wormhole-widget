import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import { RootState } from '../../store';
import { ParsedVaa } from '../../utils/vaa';
import { LINK } from '../../utils/style';
import { CHAINS } from '../../utils/sdk';
import InputContainer from '../../components/InputContainer';
import ArrowRight from '../../icons/components/ArrowRight';
import LaunchIcon from '@mui/icons-material/Launch';
const { REACT_APP_WORMHOLE_EXPLORER } = process.env;

const useStyles = makeStyles()((theme) => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  icon: {
    width: '24px',
    height: '24px',
  },
  network: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  link: LINK(theme),
}));

function NetworksTag() {
  const { classes } = useStyles();
  const vaa: ParsedVaa = useSelector((state: RootState) => state.redeem.vaa);
  const { fromNetwork, toNetwork } = useSelector((state: RootState) => state.transfer);
  if (!fromNetwork || !toNetwork) return <div></div>;
  const fromNetworkConfig = CHAINS[fromNetwork]!;
  const toNetworkConfig = CHAINS[toNetwork]!;
  const link = vaa && `${REACT_APP_WORMHOLE_EXPLORER}?emitterChain=${vaa.emitterChain}&emitterAddress=${vaa.emitterAddress}&sequence=${vaa.sequence}`;

  return (
    <div>
      <InputContainer>
        <div className={classes.row}>
          <div className={classes.network}>
            <img
              className={classes.icon}
              src={fromNetworkConfig.icon}
              alt={fromNetworkConfig.displayName}
            />
            <div>{fromNetworkConfig.displayName}</div>
          </div>
          <ArrowRight />
          <div className={classes.network}>
            <img
              className={classes.icon}
              src={toNetworkConfig.icon}
              alt={toNetworkConfig.displayName}
            />
            <div>{toNetworkConfig.displayName}</div>
          </div>
        </div>
      </InputContainer>
      {vaa && <a className={classes.link} href={link} target="_blank" rel="noreferrer">
        <div>View on Wormhole Explorer</div>
        <LaunchIcon />
      </a>}
    </div>
  );
}

export default NetworksTag;
