import React from "react"
import DynamicWalletIcon from "utils/dynamic-wallet/walletIcon"
import { DynamicWallet } from "./utils";
import { useDynamicContext, useSwitchWallet, useUserWallets, useWalletOptions } from "@dynamic-labs/sdk-react-core";
import { Chain as WormholeChain } from "@wormhole-foundation/sdk"
import { Context } from "sdklegacy";
import { fromWormholeChainToContext, type IconType } from "utils/wallet";
import type { ConnectedWallet } from "utils/wallet/wallet";

export interface DynamicWalletData {
    name: string;
    type: Context;
    icon: IconType;
    isReady: boolean;
    walletKey: string;
}

export type OnConnectCallback = (wallet: DynamicWallet) => void


export const useDynamicWalletOptions = () => {
    const { sdkHasLoaded, primaryWallet } = useDynamicContext();
    const { walletOptions, selectWalletOption }  = useWalletOptions()
    const userWallets = useUserWallets()

    const getDynamicWalletOptions = React.useCallback((chain: WormholeChain, wallets: { sending?: ConnectedWallet, receiving?: ConnectedWallet }): DynamicWalletData[] => {
        if (!sdkHasLoaded) return []
        // FIXME: This wont work, we need to wait for dynamic team for the wallet chain filter feature
        // const dynamicChain: Chain = toDynamicChain(chain)
        return walletOptions.map((a): DynamicWalletData => ({
            icon: ({ size }) => React.createElement(DynamicWalletIcon, { size, walletKey: a.key }),
            isReady: true,
            name: a.name,
            type: fromWormholeChainToContext(chain),
            walletKey: a.key,
        })).filter((a) => 
            // TODO: Add more wallets
            (a.walletKey.includes("metamask") || a.walletKey.includes("phantom")) || a.walletKey.includes("connect")
        )
    }, [walletOptions, selectWalletOption, sdkHasLoaded])

    const selectDynamicWalletOption = React.useCallback(async (walletId: string, connectCallback: (wallet: DynamicWallet) => Promise<void>) => {
        if (!sdkHasLoaded) return

        // Check if the wallet is already connected
        if (primaryWallet?.key === walletId) {
            return await connectCallback(primaryWallet)
        }
        const connectedWallet = userWallets.find((w) => w.key === walletId)
        if (connectedWallet) {
            return await connectCallback(connectedWallet)
        }

        console.log("Selecting wallet option", walletId)
        await selectWalletOption(walletId)
    }, [sdkHasLoaded, primaryWallet, selectWalletOption])

    return {
        getDynamicWalletOptions,
        selectDynamicWalletOption,
    }
}

export const useDynamicWalletHelpers = () => {
    const { primaryWallet, handleLogOut, handleUnlinkWallet, sdkHasLoaded } = useDynamicContext();
    const switchWallet = useSwitchWallet()
    const userWallets = useUserWallets()

    const isDynamicWalletReady = React.useCallback(() => sdkHasLoaded, [sdkHasLoaded])

    const disconnectDynamicWallet = React.useCallback(async (walletToDisconnect: DynamicWallet) => {
        if (userWallets.length === 0) {
            return
        }
        if (userWallets.length === 1) {
            return await handleLogOut()
        }
        if (primaryWallet?.id === walletToDisconnect.id && userWallets.length > 1) {
            await switchWallet(userWallets.filter((w) => w.id !== walletToDisconnect.id)[0].id)
        }

        await handleUnlinkWallet(walletToDisconnect.id)
    }, [primaryWallet, userWallets, handleUnlinkWallet, handleLogOut, sdkHasLoaded])

    return {
        disconnectDynamicWallet,
        isDynamicWalletReady,
    }
}