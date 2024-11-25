import React from "react"
import DynamicWalletIcon from "utils/dynamic-wallet/walletIcon"
import { DynamicWallet } from "./utils";
import { useDynamicContext, useSwitchWallet, useUserWallets, useWalletOptions } from "@dynamic-labs/sdk-react-core";
import { Chain as WormholeChain } from "@wormhole-foundation/sdk"
import { Context } from "sdklegacy";
import type { IconType } from "store/wallet";

export interface WalletData {
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

    const getWalletOptions = React.useCallback((chain: WormholeChain): WalletData[] => {
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
    const { primaryWallet, handleLogOut, handleUnlinkWallet, } = useDynamicContext();
    const switchWallet = useSwitchWallet()
    const userWallets = useUserWallets()

    const connectedWalletsFromDynamic = React.useMemo(() => {
        const wallets: NonNullable<typeof primaryWallet>[] = []
        if (primaryWallet) {
            wallets.push(primaryWallet)
        }
        if (userWallets) {
            wallets.push(...userWallets)
        }
        return wallets
    }, [primaryWallet, userWallets])

    const disconnectDynamicWallet = React.useCallback((walletToDisconnect: DynamicWallet) => {
        if (connectedWalletsFromDynamic.length === 0) {
            return
        }
        if (connectedWalletsFromDynamic.length === 1) {
            return handleLogOut()
        }
        if (primaryWallet && primaryWallet.id === walletToDisconnect.id) {
            switchWallet(userWallets[0].id)
            return handleUnlinkWallet(primaryWallet.id)
        }
        if (walletToDisconnect.id === userWallets[0].id) {
            return handleUnlinkWallet(userWallets[0].id)
        }
    }, [connectedWalletsFromDynamic, handleUnlinkWallet, handleLogOut])

    return {
        disconnectDynamicWallet,
    }
}