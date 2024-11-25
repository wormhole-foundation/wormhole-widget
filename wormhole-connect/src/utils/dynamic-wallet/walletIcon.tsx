import React, { memo } from "react"
import { WalletIcon } from "@dynamic-labs/wallet-book"

import { makeStyles } from 'tss-react/mui';
import { CENTER } from 'utils/style';

const useStyles = makeStyles<{ size: number }>()((theme, { size }) => ({
  container: {
    height: size,
    width: size,
    ...CENTER,
  },
  icon: {
    maxHeight: '100%',
    maxWidth: '100%',
  },
}));

type Props = {
  walletKey: string | undefined
  size?: number;
};

const WalletIconWrapped = (props: Props) => {
  const { walletKey, size } = props
  const { classes } = useStyles({ size: size || 32 });
  return (
    <div className={classes.container}>
      <WalletIcon walletKey={walletKey} />
    </div>
  )
}

export default memo(WalletIconWrapped)
