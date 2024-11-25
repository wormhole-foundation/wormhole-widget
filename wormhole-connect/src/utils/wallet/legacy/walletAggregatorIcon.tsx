import WalletIcon from 'icons/WalletIcons';
import React from 'react';

interface WalletAggregatorIconProps {
    walletName: string;
    walletIcon: string;
    iconSize?: number;
}

export const WalletAggregatorIcon = ({walletIcon, walletName, iconSize}: WalletAggregatorIconProps) => {
    return <WalletIcon name={walletName} icon={walletIcon} size={iconSize} />
}