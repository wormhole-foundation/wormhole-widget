import React from "react"
import DynamicWalletIcon from "utils/dynamic-wallet/walletIcon"
import { DynamicWallet } from "./utils";
import { useDynamicContext, useSwitchWallet, useUserWallets, useWalletOptions } from "@dynamic-labs/sdk-react-core";
import { Chain as WormholeChain } from "@wormhole-foundation/sdk"
import { Context } from "sdklegacy";
import type { IconType } from "utils/wallet";

export interface DynamicWalletData {
    name: string;
    type: Context;
    icon: IconType;
    isReady: boolean;
    walletId: string;
}

export type OnConnectCallback = (wallet: DynamicWallet) => void

export const useDynamicWalletOptions = () => {
    const { sdkHasLoaded } = useDynamicContext();
    const { walletOptions, selectWalletOption }  = useWalletOptions()

    const getWalletOptions = React.useCallback((chain: WormholeChain): DynamicWalletData[] => {
        if (!sdkHasLoaded) return []
        // FIXME: This wont work, we need to wait for dynamic team for the wallet chain filter feature
        // const dynamicChain: Chain = toDynamicChain(chain)
        return walletOptions.map((a) => ({
            icon: ({ size }) => React.createElement(DynamicWalletIcon, { size, walletKey: a.key }),
            isReady: true,
            name: a.name,
            // FIXME: This wont work, we need to wait for dynamic team for the wallet chain filter feature
            type: Context.ETH,
            walletId: a.key,
        }))
    }, [walletOptions, selectWalletOption, sdkHasLoaded])

    return {
        getWalletOptions,
        selectWalletOption,
    }
}

export const useDynamicWalletHelpers = () => {
    const { primaryWallet, handleLogOut, handleUnlinkWallet, sdkHasLoaded } = useDynamicContext();
    const switchWallet = useSwitchWallet()
    const userWallets = useUserWallets()

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
    }
}