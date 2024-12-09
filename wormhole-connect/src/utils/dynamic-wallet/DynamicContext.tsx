import React, { Fragment, PropsWithChildren } from "react"
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core"
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum"
import { SolanaWalletConnectors } from "@dynamic-labs/solana"
import { OnConnectCallback } from "./useDynamicWallet"
import { Theme } from "@mui/material"

interface ConfiguredDynamicContextProps {
    theme?: Theme
    onConnectCallbackRef: React.MutableRefObject<OnConnectCallback | undefined>
}

export const ConfiguredDynamicContext: React.FC<PropsWithChildren<ConfiguredDynamicContextProps>> = (
    { children, onConnectCallbackRef }
) => {
    return <Fragment>
        <DynamicContextProvider
            // TODO: Config theme
            // theme={ theme ?? { mode: "dark" } }
            theme={"dark"}
            settings={{
                environmentId: "4d965b25-755b-4e7f-bfae-14cf0e2613b0",
                initialAuthenticationMode: "connect-only",
                walletConnectors: [
                    EthereumWalletConnectors,
                    SolanaWalletConnectors,
                ],
                events: {
                    onAuthSuccess: ({ primaryWallet }) => {
                        console.log("onAuthSuccess", primaryWallet?.chain, primaryWallet?.address, primaryWallet?.connector.name)
                        if (primaryWallet)
                            onConnectCallbackRef.current?.(primaryWallet)
                    },
                    onWalletAdded: ({ wallet }) => {
                        console.log("onAuthSuccess", wallet?.chain, wallet?.address, wallet?.connector.name)
                        onConnectCallbackRef.current?.(wallet)
                    },
                    onLogout: (user) => {
                        console.log("onLogout")
                    },
                    onWalletRemoved: (w) => {
                        console.log("onWalletRemoved", w.wallet.connector.name)
                    }
                },
                // // TODO: Config networks
                // overrides: {
                //     evmNetworks: [],
                // },
                // walletConnectPreferredChains: [],
            }}
        >
            {children}
        </DynamicContextProvider>
    </Fragment>
}