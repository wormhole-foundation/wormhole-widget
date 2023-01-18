import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChainName } from 'sdk';

export enum PaymentOption {
  MANUAL = 1,
  AUTOMATIC = 2,
}
export interface TransferState {
  fromNetwork: ChainName | undefined;
  toNetwork: ChainName | undefined;
  token: string;
  destGasPayment: PaymentOption;
}

const initialState: TransferState = {
  fromNetwork: undefined,
  toNetwork: undefined,
  token: '',
  // TODO: check if automatic is available once networks and token are selected
  destGasPayment: PaymentOption.MANUAL,
};

export const transferSlice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    setToken: (state: TransferState, { payload }: PayloadAction<string>) => {
      console.log('set token:', payload);
      state.token = payload;
    },
    setFromNetwork: (
      state: TransferState,
      { payload }: PayloadAction<ChainName>,
    ) => {
      console.log('set from network:', payload);
      state.fromNetwork = payload;
    },
    setToNetwork: (
      state: TransferState,
      { payload }: PayloadAction<ChainName>,
    ) => {
      console.log('set to network:', payload);
      state.toNetwork = payload;
    },
    setDestGasPayment: (
      state: TransferState,
      { payload }: PayloadAction<PaymentOption>,
    ) => {
      console.log('set destination gas payment option:', payload);
      state.destGasPayment = payload;
    },
  },
});

export const { setToken, setFromNetwork, setToNetwork, setDestGasPayment } =
  transferSlice.actions;

export default transferSlice.reducer;
