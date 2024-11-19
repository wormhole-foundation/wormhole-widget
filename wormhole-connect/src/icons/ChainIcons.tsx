import React from 'react';
import { makeStyles } from 'tss-react/mui';

import { CENTER } from 'utils/style';
import { ChainIcon } from 'config/types';
import GLMR from './Chains/GLMR';
import AVAX from './Chains/AVAX';
import CELO from './Chains/CELO';
import ETH from './Chains/ETH';
import FTM from './Chains/FTM';
import SOL from './Chains/SOL';
import APT from './Chains/APT';
import SUI from './Chains/SUI';
import BASE from './Chains/BASE';
import POLY from './Chains/POLY';
import BSC from './Chains/BSC';
import noIcon from './Chains/noIcon';
import ARBITRUM from './Chains/ARBITRUM';
import OPTIMISM from './Chains/OPTIMISM';
import KLAY from './Chains/KLAY';
import KAIA from './Chains/KAIA';
import SCROLL from './Chains/SCROLL';
import BLAST from './Chains/BLAST';
import MANTLE from './Chains/MANTLE';
import XLAYER from './Chains/XLAYER';
import OSMO from './Chains/OSMO';

const useStyles = makeStyles<{ size: number }>()((theme, { size }) => ({
  container: {
    height: size,
    width: size,
    ...CENTER,
  },
  iconImage: {
    width: size,
    height: size,
  },
  icon: {
    maxHeight: '100%',
    maxWidth: '100%',
  },
}));

const iconMap: { [key in ChainIcon]: React.JSX.Element } = {
  [ChainIcon.GLMR]: GLMR(),
  [ChainIcon.AVAX]: AVAX(),
  [ChainIcon.BSC]: BSC(),
  [ChainIcon.CELO]: CELO(),
  [ChainIcon.ETH]: ETH(),
  [ChainIcon.FANTOM]: FTM(),
  [ChainIcon.POLYGON]: POLY(),
  [ChainIcon.SOLANA]: SOL(),
  [ChainIcon.SUI]: SUI(),
  [ChainIcon.APT]: APT(),
  [ChainIcon.ARBITRUM]: ARBITRUM(),
  [ChainIcon.OPTIMISM]: OPTIMISM(),
  [ChainIcon.BASE]: BASE(),
  [ChainIcon.KAIA]: KAIA(),
  [ChainIcon.KLAY]: KLAY(),
  [ChainIcon.SCROLL]: SCROLL(),
  [ChainIcon.BLAST]: BLAST(),
  [ChainIcon.XLAYER]: XLAYER(),
  [ChainIcon.MANTLE]: MANTLE(),
  [ChainIcon.OSMO]: OSMO(),
};

function isBuiltinIcon(icon?: ChainIcon | string): icon is ChainIcon {
  return Object.values(ChainIcon).includes(icon as ChainIcon);
}

type Props = {
  icon?: ChainIcon | string;
  height?: number;
};

function TokenIcon(props: Props) {
  const size = props.height || 36;
  const { classes } = useStyles({ size });

  // Default, if icon is undefined
  let icon = noIcon;

  if (isBuiltinIcon(props.icon)) {
    icon = iconMap[props.icon] || noIcon;
  } else if (typeof props.icon === 'string') {
    icon = <img className={classes.iconImage} src={props.icon} />;
  }

  return <div className={classes.container}>{icon}</div>;
}

export default TokenIcon;
