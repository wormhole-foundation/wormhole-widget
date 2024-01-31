import { makeStyles } from 'tss-react/mui';
import React from 'react';

const useStyles = makeStyles()((theme: any) => ({
  price: {
    fontSize: '10px',
  },
  alignRight: {
    textAlign: 'right',
  },
}));

interface priceProps {
  children?: string;
  textAlign?: 'left' | 'right';
}
const Price = ({ children, textAlign = 'left' }: priceProps) => {
  const { classes } = useStyles();
  return (
    <>
      {!!children ? (
        <div className={`${classes.price}`} style={{ textAlign: textAlign }}>
          {children}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Price;
