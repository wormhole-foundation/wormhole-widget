import React, { Fragment, PropsWithChildren } from 'react';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { SolanaWalletConnectors } from '@dynamic-labs/solana';
import { OnConnectCallback } from './useDynamicWallet';
import { Theme } from '@mui/material';
import config from 'config';

interface ConfiguredDynamicContextProps {
  theme?: Theme;
  onConnectCallbackRef: React.MutableRefObject<OnConnectCallback | undefined>;
}

export const ConfiguredDynamicContext: React.FC<
  PropsWithChildren<ConfiguredDynamicContextProps>
> = ({ children, onConnectCallbackRef }) => {
  return (
    <Fragment>
      <DynamicContextProvider
        // TODO: Config theme
        // theme={ theme ?? { mode: "dark" } }
        theme={'dark'}
        settings={{
          environmentId: config.dynamicWalletConfig.environmentId,
          enableVisitTrackingOnConnectOnly: false,
          initialAuthenticationMode: 'connect-only',
          walletConnectors: [EthereumWalletConnectors, SolanaWalletConnectors],
          networkValidationMode: 'never',
          events: {
            onAuthSuccess: ({ primaryWallet }) => {
              console.log(
                'onAuthSuccess',
                primaryWallet?.chain,
                primaryWallet?.address,
                primaryWallet?.connector.name,
              );
              if (primaryWallet) onConnectCallbackRef.current?.(primaryWallet);
            },
            onWalletAdded: ({ wallet }) => {
              console.log(
                'onAuthSuccess',
                wallet?.chain,
                wallet?.address,
                wallet?.connector.name,
              );
              onConnectCallbackRef.current?.(wallet);
            },
            onLogout: (user) => {
              console.log('onLogout');
            },
            onWalletRemoved: (w) => {
              console.log('onWalletRemoved', w.wallet.connector.name);
            },
          },
          walletConnectPreferredChains: [
            'eip155:1', // Ethereum
            'eip155:56', // Binance Smart Chain
            'eip155:8453', // Base
            'eip155:42161', // Arbitrum
            'eip155:43114', // Avalanche
            'eip155:10', // Optimism
            'eip155:137', // Polygon
            'eip155:250', // Fantom
            'eip155:5000', // Gnosis
          ],
        }}
      >
        {children}
      </DynamicContextProvider>
    </Fragment>
  );
};
