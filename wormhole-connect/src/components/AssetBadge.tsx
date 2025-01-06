import React from 'react';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { makeStyles } from 'tss-react/mui';

import ChainIcon from 'icons/ChainIcons';
import TokenIcon from 'icons/TokenIcons';

import type { ChainConfig, TokenConfig } from 'config/types';

const useStyles = makeStyles()((theme: any) => ({
  badgeContent: {
    border: `1.5px solid ${theme.palette.modal.background}`,
    borderRadius: '4px',
  },
}));

type Props = {
  chainConfig?: ChainConfig;
  tokenConfig?: TokenConfig;
};

function AssetBadge(props: Props) {
  const { classes } = useStyles();
  const { chainConfig, tokenConfig } = props;

  return (
    <Badge
      badgeContent={
        <Box className={classes.badgeContent}>
          <ChainIcon icon={chainConfig?.icon} height={13} />
        </Box>
      }
      sx={{
        height: '38px', // Icon height (36px) + the distance from badge's bottom (2px)
        marginRight: '8px',
        '& .MuiBadge-badge': {
          right: 2,
          top: 32,
        },
      }}
    >
      <TokenIcon icon={tokenConfig?.icon} height={36} />
    </Badge>
  );
}

export default AssetBadge;
