import React, {
  ChangeEventHandler,
  ComponentProps,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import { useDebouncedCallback } from 'use-debounce';
import { useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Chain, amount as sdkAmount } from '@wormhole-foundation/sdk';

import AlertBannerV2 from 'components/v2/AlertBanner';
import { setAmount } from 'store/transferInput';
import { Token } from 'config/tokens';
import type { RootState } from 'store';
import { useGetTokens } from 'hooks/useGetTokens';

const INPUT_DEBOUNCE = 500;

const DebouncedTextField = memo(
  ({
    value,
    onChange,
    ...props
  }: Omit<ComponentProps<typeof TextField>, 'onChange' | 'value'> & {
    value: string;
    onChange: (event: string) => void;
  }) => {
    const [innerValue, setInnerValue] = useState<string>(value);
    const [isFocused, setIsFocused] = useState(false);
    const deferredOnChange = useDebouncedCallback(onChange, INPUT_DEBOUNCE);

    const onInnerChange: ChangeEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        let value = e.target.value;
        if (value === '.') value = '0.';

        const numValue = Number(value);

        if (isNaN(numValue) || numValue < 0) {
          // allows all but negative numbers
          return;
        }

        setInnerValue(e.target.value);
        deferredOnChange(e.target.value);
      },
      [],
    );

    // Propagate any outside changes to the inner TextField value
    // The way we do this is by checking when the focus is not on the input component
    useEffect(() => {
      if (!isFocused) {
        setInnerValue(value);
      }
      // We should run this sife-effect only when the value changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
      <TextField
        {...props}
        value={innerValue}
        focused={isFocused}
        onChange={onInnerChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    );
  },
);

const useStyles = makeStyles()((theme) => ({
  amountContainer: {
    width: '100%',
    maxWidth: '420px',
  },
  amountCard: {
    borderRadius: '8px',
  },
  amountCardContent: {
    display: 'flex',
    alignItems: 'center',
  },
  amountTitle: {
    color: theme.palette.text.secondary,
    display: 'flex',
    minHeight: '40px',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputError: {
    marginTop: '12px',
  },
  balance: {
    color: theme.palette.text.secondary,
  },
}));

type Props = {
  sourceChain?: Chain;
  supportedSourceTokens: Array<Token>;
  tokenBalance: sdkAmount.Amount | null;
  isFetchingTokenBalance: boolean;
  error?: string;
  warning?: string;
};

/**
 * Renders the input control to set the transaction amount
 */
const AmountInput = (props: Props) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { sending: sendingWallet } = useSelector(
    (state: RootState) => state.wallet,
  );
  const { amount } = useSelector((state: RootState) => state.transferInput);

  const [amountInput, setAmountInput] = useState(
    amount ? sdkAmount.display(amount) : '',
  );

  const { sourceToken } = useGetTokens();

  // Clear the amount input value if the amount is reset outside of this component
  // This can happen if user swaps selected source and destination assets.
  useEffect(() => {
    if (!amount && amountInput) {
      setAmountInput('');
    }
    // We should run this sife-effect only when the amount changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  const isInputDisabled = useMemo(
    () => !props.sourceChain || !sourceToken,
    [props.sourceChain, sourceToken],
  );

  const balance = useMemo(() => {
    if (isInputDisabled || !sendingWallet.address) {
      return null;
    }

    return (
      <Stack direction="row" alignItems="center">
        <Typography
          fontSize={14}
          textAlign="right"
          sx={{ marginRight: '4px' }}
          className={classes.balance}
        >
          Balance:
        </Typography>
        {props.isFetchingTokenBalance ? (
          <CircularProgress size={14} />
        ) : (
          <Typography
            fontSize={14}
            textAlign="right"
            className={classes.balance}
          >
            {props.tokenBalance
              ? sdkAmount.display(sdkAmount.truncate(props.tokenBalance, 6))
              : '0'}
          </Typography>
        )}
      </Stack>
    );
  }, [isInputDisabled, props.tokenBalance, sendingWallet.address]);

  const handleChange = useCallback((newValue: string): void => {
    dispatch(setAmount(newValue));
    setAmountInput(newValue);
  }, []);

  const maxButton = useMemo(() => {
    const maxButtonDisabled =
      isInputDisabled || !sendingWallet.address || !props.tokenBalance;
    return (
      <Button
        sx={{ minWidth: '32px', padding: '4px' }}
        disabled={maxButtonDisabled}
        onClick={() => {
          if (props.tokenBalance) {
            handleChange(sdkAmount.display(props.tokenBalance));
          }
        }}
      >
        <Typography
          fontSize={14}
          fontWeight={maxButtonDisabled ? 400 : 600}
          textTransform="none"
        >
          Max
        </Typography>
      </Button>
    );
  }, [handleChange, isInputDisabled, sendingWallet.address, props.tokenBalance]);

  return (
    <div className={classes.amountContainer}>
      <div className={classes.amountTitle}>
        <Typography variant="body2">Amount</Typography>
      </div>
      <Card className={classes.amountCard} variant="elevation">
        <CardContent
          className={classes.amountCardContent}
          style={{ paddingBottom: '16px' }}
        >
          <DebouncedTextField
            fullWidth
            disabled={isInputDisabled}
            inputProps={{
              style: {
                color: props.error
                  ? theme.palette.error.main
                  : theme.palette.text.primary,
                fontSize: 24,
                height: '40px',
                padding: '4px',
              },
              onWheel: (e) => {
                // IMPORTANT: We need to prevent the scroll behavior on number inputs.
                // Otherwise it'll increase/decrease the value when user scrolls on the input control.
                // See for details: https://github.com/mui/material-ui/issues/7960
                e.currentTarget.blur();
              },
              step: '0.1',
            }}
            placeholder="0"
            variant="standard"
            value={amountInput}
            onChange={handleChange}
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Stack alignItems="end">
                    {maxButton}
                    {balance}
                  </Stack>
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>
      <AlertBannerV2
        error={!!props.error}
        content={props.error || props.warning}
        show={!!props.error || !!props.warning}
        color={props.error ? theme.palette.error.main : theme.palette.grey.A400}
        className={classes.inputError}
      />
    </div>
  );
};

export default AmountInput;
