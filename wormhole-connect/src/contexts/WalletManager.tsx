import React, { Fragment, useRef } from 'react';
import { Chain as WormholeChain, isChain } from '@wormhole-foundation/sdk';
import { Theme } from '@mui/material';
import WalletSidebar from 'views/v2/Bridge/WalletConnector/Sidebar';
import {
  TransferWallet,
  useConnectToLastUsedWallet,
  WalletData,
} from '../utils/wallet';
import { useDispatch } from 'react-redux';
import {
  swapWallets,
  disconnectWallet as disconnectWalletFromStore,
} from 'store/wallet';
import {
  DynamicWallet,
  isChainSupportedByDynamicWallet,
  isDynamicWallet,
} from 'utils/dynamic-wallet/utils';
import { ConfiguredDynamicContext } from 'utils/dynamic-wallet/DynamicContext';
import {
  useDynamicWalletHelpers,
  useDynamicWalletOptions,
} from 'utils/dynamic-wallet/useDynamicWallet';
import {
  ConnectedWallet,
  toConnectedWallet,
  Wallet,
} from 'utils/wallet/wallet';
import { getWalletOptions as getWalletAgreggatorOptions } from 'utils/wallet/legacy/index';
import { ChainConfig } from 'sdklegacy';
import config from 'config';
import { isReadOnlyWallet } from 'utils/wallet/ReadOnlyWallet';

interface WalletManagerProps {
  connectWallet: (type: TransferWallet) => any;
  getConnectedWallet: (type: TransferWallet) => ConnectedWallet | undefined;
  switchChain: (chainId: number, type: TransferWallet) => Promise<void>;
  getWalletOptions: (chain: ChainConfig | undefined) => Promise<WalletData[]>;
  registerWalletSigner: (
    chain: WormholeChain,
    type: TransferWallet,
  ) => Promise<void>;
  swapWalletConnections: () => void;
  disconnectWallet: (type: TransferWallet) => Promise<void>;
}
interface ConnectedWallets {
  sending?: ConnectedWallet;
  receiving?: ConnectedWallet;
  nextTypeToConnect: TransferWallet;
}

const WALLET_MANAGER_INITIAL_STATE: WalletManagerProps = {
  connectWallet: (type: TransferWallet) => {},
  getConnectedWallet: (type: TransferWallet) => undefined,
  switchChain: (chainId: number, type: TransferWallet) => Promise.resolve(),
  getWalletOptions: (chain: ChainConfig | undefined) => Promise.resolve([]),
  registerWalletSigner: (chain: WormholeChain, type: TransferWallet) =>
    Promise.resolve(),
  swapWalletConnections: () => undefined,
  disconnectWallet: (type: TransferWallet) => Promise.resolve(),
} as const;
const WalletManager = React.createContext<WalletManagerProps>(
  WALLET_MANAGER_INITIAL_STATE,
);

const useWalletManager = () => {
  const context = React.useContext(WalletManager);
  return context;
};
const defaultWalletSidebarConfig: { isOpen: boolean; type: TransferWallet } = {
  isOpen: false,
  type: TransferWallet.SENDING,
};

type OnConnectCallback = (wallet: DynamicWallet) => void;

interface InternalWMProviderProps {
  onConnectCallbackRef: React.MutableRefObject<OnConnectCallback | undefined>;
}

const InternalWMComponent: React.FC<
  React.PropsWithChildren<InternalWMProviderProps>
> = ({ children, onConnectCallbackRef }) => {
  const { getDynamicWalletOptions, selectDynamicWalletOption } =
    useDynamicWalletOptions();
  const { disconnectDynamicWallet } = useDynamicWalletHelpers();
  const [walletSidebarProps, setWalletSidebarProps] = React.useState<
    typeof defaultWalletSidebarConfig
  >(defaultWalletSidebarConfig);
  const dynamicWormholeChainRef = React.useRef<WormholeChain>('Ethereum');
  const dispatch = useDispatch();

  const walletConnection = React.useRef<ConnectedWallets>({
    nextTypeToConnect: TransferWallet.SENDING,
  }).current;

  const createConnectedWallet = React.useCallback(
    async (wallet: Wallet, wormholeChain: WormholeChain): Promise<void> => {
      walletConnection[walletConnection.nextTypeToConnect] =
        await toConnectedWallet(
          wallet,
          walletConnection.nextTypeToConnect,
          wormholeChain,
          dispatch,
        );
      // TODO: Send disconnectWallet function to onDisconnectEvent of the wallet
      // walletConnection[walletConnection.nextTypeToConnect].onDisconnect(disconnectWallet)
    },
    [walletConnection, disconnectDynamicWallet],
  );

  const sidebarOnConnectWallet = React.useCallback(
    async (
      walletInfo: WalletData,
      type: TransferWallet,
      chain: WormholeChain,
    ) => {
      // TODO: `useLastConnectedWallet` is calling `sidebarOnConnectWallet` when the user clicks on swap wallets connections.
      // We should not allow to connect the same wallet twice. The connection must persist.
      walletConnection.nextTypeToConnect = type;
      if ('walletKey' in walletInfo) {
        // Saving the chain for `onConnectCallbackRef` callback because it is not available in the DynamicWallet object
        dynamicWormholeChainRef.current = chain;
        console.log(
          'Dynamic Wallet will continue the connection flow',
          walletInfo,
        );
        return await selectDynamicWalletOption(walletInfo.walletKey, (w) =>
          createConnectedWallet(w, chain),
        );
      }

      await createConnectedWallet(walletInfo, chain);
      walletConnection.nextTypeToConnect = type;
      if (walletSidebarProps.isOpen) {
        setWalletSidebarProps(defaultWalletSidebarConfig);
      }
    },
    [createConnectedWallet, selectDynamicWalletOption],
  );

  const getWalletOptions = React.useCallback(
    async (chain: ChainConfig | undefined) => {
      if (
        chain &&
        isChain(chain.key) &&
        isChainSupportedByDynamicWallet(chain.key)
      ) {
        return getDynamicWalletOptions(chain.key, walletConnection);
      }

      return getWalletAgreggatorOptions(chain);
    },
    [getDynamicWalletOptions],
  );

  const registerWalletSigner = React.useCallback(
    async (chain: WormholeChain, type: TransferWallet) => {
      const w = walletConnection[type];
      if (!w) throw new Error('must connect wallet');
      const signer = await w.getSigner?.();
      if (!signer) throw new Error('must have signer');
      config.whLegacy.registerSigner(chain, signer);
    },
    [],
  );

  const disconnectWallet = React.useCallback(
    async (type: TransferWallet) => {
      if (walletConnection[type]) {
        const wallet = walletConnection[type].getWallet();
        if (isDynamicWallet(wallet)) {
          await disconnectDynamicWallet(wallet);
        }
        await walletConnection[type].disconnect();
        walletConnection[type] = undefined;
        dispatch(disconnectWalletFromStore(type));
      }
    },
    [walletConnection, disconnectDynamicWallet],
  );

  const swapWalletConnections = React.useCallback(async () => {
    const temp = walletConnection.sending;
    walletConnection.sending = walletConnection.receiving;
    walletConnection.receiving = temp;
    walletConnection.nextTypeToConnect =
      walletConnection.nextTypeToConnect === TransferWallet.SENDING
        ? TransferWallet.RECEIVING
        : TransferWallet.SENDING;
    dispatch(swapWallets());
    if (isReadOnlyWallet(walletConnection.sending?.getWallet())) {
      await disconnectWallet(TransferWallet.SENDING);
    }
  }, [walletConnection, dispatch]);

  const connectWallet = React.useCallback(
    async (type: TransferWallet) => {
      walletConnection.nextTypeToConnect = type;
      setWalletSidebarProps({ isOpen: true, type });
    },
    [setWalletSidebarProps],
  );

  const switchChain = React.useCallback(
    async (chainId: number, type: TransferWallet) => {
      await walletConnection[type]?.switchChain?.(chainId);
    },
    [walletConnection],
  );

  const getConnectedWallet = React.useCallback(
    (type: TransferWallet) => {
      return walletConnection[type];
    },
    [walletConnection],
  );

  const walletManager = React.useMemo(
    () => ({
      connectWallet,
      getConnectedWallet,
      switchChain,
      getWalletOptions,
      registerWalletSigner,
      swapWalletConnections,
      disconnectWallet,
    }),
    [
      connectWallet,
      getConnectedWallet,
      switchChain,
      registerWalletSigner,
      getWalletOptions,
      swapWalletConnections,
      disconnectWallet,
    ],
  );

  React.useEffect(() => {
    onConnectCallbackRef.current = async (wallet) => {
      try {
        await createConnectedWallet(wallet, dynamicWormholeChainRef.current);
      } catch (err) {
        // Something wrong happened here
        console.log(err);
      }
    };
  }, [createConnectedWallet]);

  useConnectToLastUsedWallet(sidebarOnConnectWallet);

  return (
    <>
      <WalletManager.Provider value={walletManager}>
        {children}
        <WalletSidebar
          onConnectWallet={sidebarOnConnectWallet}
          open={walletSidebarProps.isOpen}
          type={walletSidebarProps.type}
          onClose={() => setWalletSidebarProps(defaultWalletSidebarConfig)}
          showAddressInput={
            walletConnection.nextTypeToConnect === TransferWallet.RECEIVING
          }
        />
      </WalletManager.Provider>
    </>
  );
};

const WalletManagerProvider: React.FC<
  React.PropsWithChildren<{ theme?: Theme }>
> = ({ children, theme }) => {
  const onConnectRef = useRef<OnConnectCallback | undefined>(undefined);
  return (
    <Fragment>
      <ConfiguredDynamicContext onConnectCallbackRef={onConnectRef}>
        <InternalWMComponent onConnectCallbackRef={onConnectRef}>
          {children}
        </InternalWMComponent>
      </ConfiguredDynamicContext>
    </Fragment>
  );
};

export { WalletManagerProvider, useWalletManager };
