import React, { Fragment, useRef } from "react"
import { Chain as WormholeChain, isChain } from '@wormhole-foundation/sdk';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { Theme } from "@mui/material"
import WalletSidebar from "views/v2/Bridge/WalletConnector/Sidebar"
import { TransferWallet, WalletData } from "../utils/wallet"
import { useDispatch } from "react-redux";
import { swapWallets, disconnectWallet as disconnectWalletFromStore } from 'store/wallet';
import { DynamicWallet, isChainSupportedByDynamicWallet, isDynamicWallet } from "utils/dynamic-wallet/utils";
import { ConfiguredDynamicContext } from "utils/dynamic-wallet/DynamicContext";
import { useDynamicWalletHelpers, useDynamicWalletOptions } from "utils/dynamic-wallet/useDynamicWallet";
import { ConnectedWallet, toConnectedWallet, Wallet } from "utils/wallet/wallet";
import { getWalletOptions as getWalletAgreggatorOptions } from "utils/wallet/legacy/index"
import { ChainConfig } from "sdklegacy";
import config from "config";

interface WalletManagerProps {
    connectWallet: (type: TransferWallet) => any;
    getConnectedWallet: (type: TransferWallet) => ConnectedWallet | undefined;
    switchChain: (chainId: number, type: TransferWallet) => Promise<void>;
    getWalletOptions: (chain: ChainConfig | undefined) => Promise<WalletData[]>;
    registerWalletSigner: (chain: WormholeChain, type: TransferWallet) => Promise<void>;
    swapWalletConnections: () => void;
    disconnectWallet: (type: TransferWallet) => Promise<void>;
}
interface ConnectedWallets {
    sending?: ConnectedWallet;
    receiving?: ConnectedWallet;
    nextTypeToConnect: TransferWallet
}

const WALLET_MANAGER_INITIAL_STATE: WalletManagerProps = {
    connectWallet: (type: TransferWallet) => {},
    getConnectedWallet: (type: TransferWallet) => undefined,
    switchChain: (chainId: number, type: TransferWallet) => Promise.resolve(),
    getWalletOptions: (chain: ChainConfig | undefined) => Promise.resolve([]),
    registerWalletSigner: (chain: WormholeChain, type: TransferWallet) => Promise.resolve(),
    swapWalletConnections: () => undefined,
    disconnectWallet: (type: TransferWallet) => Promise.resolve(),
} as const
const WalletManager = React.createContext<WalletManagerProps>(WALLET_MANAGER_INITIAL_STATE)

const useWalletManager = () => {
    const context = React.useContext(WalletManager)
    return context
}
const defaultWalletSidebarConfig = { isOpen: false, type: TransferWallet.SENDING };

type OnConnectCallback = (wallet: DynamicWallet) => void

interface InternalWMProviderProps {
    chainRef: React.MutableRefObject<string | undefined>
    onConnectCallbackRef: React.MutableRefObject<OnConnectCallback | undefined>
}

const InternalWMComponent: React.FC<React.PropsWithChildren<InternalWMProviderProps>> = ({ children, chainRef, onConnectCallbackRef }) => {
    const { sdkHasLoaded } = useDynamicContext();
    const { getWalletOptions: getDynamicWalletOptions, selectWalletOption: selectDynamicWalletOption } = useDynamicWalletOptions()
    const { disconnectDynamicWallet } = useDynamicWalletHelpers()
    const [walletSidebarProps, setWalletSidebarProps] = React.useState<{ isOpen: boolean, type: TransferWallet }>(defaultWalletSidebarConfig);
    const dynamicwormholeChainRef = React.useRef<WormholeChain>("Ethereum")
    const dispatch = useDispatch();

    const walletConnection = React.useRef<ConnectedWallets>({ nextTypeToConnect: TransferWallet.SENDING }).current

    const createConnectedWallet = React.useCallback(async (wallet: Wallet): Promise<void> => {
        if (walletConnection.nextTypeToConnect === TransferWallet.SENDING) {
            if (walletConnection.sending) {
                if (isDynamicWallet(walletConnection.sending)) {
                    disconnectDynamicWallet(walletConnection.sending)
                }
                walletConnection.sending.disconnect()
            }
            walletConnection.sending = await toConnectedWallet(wallet, walletConnection.nextTypeToConnect, dynamicwormholeChainRef.current, dispatch)
        } else {
            if (walletConnection.receiving) {
                if (isDynamicWallet(walletConnection.receiving)) {
                    disconnectDynamicWallet(walletConnection.receiving)
                }
                walletConnection.receiving.disconnect()
            }
            walletConnection.receiving = await toConnectedWallet(wallet, walletConnection.nextTypeToConnect, dynamicwormholeChainRef.current, dispatch)
        }
    }, [walletConnection])

    const sidebarOnConnectWallet = React.useCallback(async (walletInfo: WalletData, type: TransferWallet, chain: WormholeChain) => {
        walletConnection.nextTypeToConnect = type
        if ("walletId" in walletInfo) {
            // Dynamic Wallet will continue the connection flow
            dynamicwormholeChainRef.current = chain
            console.log("Dynamic Wallet will continue the connection flow", walletInfo)
            return await selectDynamicWalletOption(walletInfo.walletId)
        }

        await createConnectedWallet(walletInfo)
        await connectWallet(walletConnection.nextTypeToConnect)
    }, [createConnectedWallet, selectDynamicWalletOption])

    const getWalletOptions = React.useCallback(async (chain: ChainConfig | undefined) => {
        if (chain && isChain(chain.key) && isChainSupportedByDynamicWallet(chain.key)) {
            return getDynamicWalletOptions(chain.key, walletConnection)
        }

        return getWalletAgreggatorOptions(chain)
    }, [getDynamicWalletOptions])

    const registerWalletSigner = React.useCallback(async (chain: WormholeChain, type: TransferWallet) => {
        const w = walletConnection[type]
        if (!w) throw new Error('must connect wallet');
        const signer = await w.getSigner?.();
        if (!signer) throw new Error('must have signer');
        config.whLegacy.registerSigner(chain, signer);
    }, [])

    const swapWalletConnections = React.useCallback(() => {
        const temp = walletConnection.sending
        walletConnection.sending = walletConnection.receiving
        walletConnection.receiving = temp
        dispatch(swapWallets())
    }, [walletConnection, dispatch])

    const connectWallet = React.useCallback(async (type: TransferWallet) => {
        walletConnection.nextTypeToConnect = type
        setWalletSidebarProps({ isOpen: true, type })
    }, [setWalletSidebarProps])

    const switchChain = React.useCallback(async (chainId: number, type: TransferWallet) => {
        await walletConnection[type]?.switchChain?.(chainId)
    }, [walletConnection])

    const getConnectedWallet = React.useCallback((type: TransferWallet) => {
        return walletConnection[type]
    }, [walletConnection])

    const disconnectWallet = React.useCallback(async (type: TransferWallet) => {
        if (walletConnection[type]) {
            const wallet = walletConnection[type].getWallet()
            if (isDynamicWallet(wallet)) {
                await disconnectDynamicWallet(wallet)
            }
            await walletConnection[type].disconnect()
            walletConnection[type] = undefined
            dispatch(disconnectWalletFromStore(type))
        }
    }, [walletConnection, disconnectDynamicWallet])

    const walletManager = React.useMemo(() => ({
        connectWallet,
        getConnectedWallet,
        switchChain,
        getWalletOptions,
        registerWalletSigner,
        swapWalletConnections,
        disconnectWallet,
    }), [
        connectWallet,
        getConnectedWallet,
        switchChain,
        registerWalletSigner,
        getWalletOptions,
        swapWalletConnections,
        disconnectWallet,
    ])

    React.useEffect(() => {
        onConnectCallbackRef.current = async (wallet) => {
            console.log("onConnectCallbackRef")
            try {
                await createConnectedWallet(wallet)
            } catch (err) {
                console.log(err)
                // Something wrong happened here
                // TODO: Handle this error
                // Best option, ignore and allow the user to try again re-using the primaryWallet/wallets[i] reference
            }
        }
    }, [sdkHasLoaded, createConnectedWallet])

    return <>
        <WalletManager.Provider value={walletManager}>
            {children}
            <WalletSidebar
                onConnectWallet={sidebarOnConnectWallet}
                open={walletSidebarProps.isOpen}
                type={walletSidebarProps.type}
                onClose={() => {
                        setWalletSidebarProps(defaultWalletSidebarConfig)
                    }
                }
            />
        </WalletManager.Provider>
    </>
}

const WalletManagerProvider: React.FC<React.PropsWithChildren<{ theme?: Theme }>> = ({ children, theme }) => {
    const chainRef = useRef<WormholeChain | undefined>(undefined)
    const onConnectRef = useRef<OnConnectCallback | undefined>(undefined)
    return <Fragment>
        <ConfiguredDynamicContext chainRef={chainRef} onConnectCallbackRef={onConnectRef}>
            <InternalWMComponent chainRef={chainRef} onConnectCallbackRef={onConnectRef}>
                {children}
            </InternalWMComponent>
        </ConfiguredDynamicContext>
    </Fragment>
}

export { WalletManagerProvider, useWalletManager }