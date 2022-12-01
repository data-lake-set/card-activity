import { ASSET_LAKE, ASSET_USDT } from '../../../constants/assets';
import { useContext, useEffect, useState } from 'react';

import { Button } from '../../button/Button';
import { GradientButton } from '../../button/gradient/GradientButton';
import { IPositionDetails } from '../../../interfaces/positionDetails.interface';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ProvideLiquidityModal } from './liquidity/provide/ProvideLiquidityModal';
import { RemoveLiquidityModal } from './liquidity/RemoveLiquidityModal';
import { WalletConnectContext } from '../../../context';
import { formatValue } from '../../../utils/formatValue';
import { parseBigNumber } from '../../../utils/parseBigNumber';
import { useConfig } from '../../../hooks/use-config';
import { usePositions } from '../../../hooks/use-positions';
import { useTokenBalance } from '@usedapp/core';

export const ProvideLiquidityWidget = () => {
    const { account, library } = useContext(WalletConnectContext);
    const { lakeAddress } = useConfig();
    const [arePositionsLoading, setArePositionsLoading] = useState(true);
    const [positions, setPositions] = useState<IPositionDetails[]>([]);
    const [isProvideLiquidityModalOpen, setIsProvideLiquidityModalOpen] =
        useState(false);
    const [isRemoveLiquidityModalOpen, setIsRemoveLiquidityModalOpen] =
        useState(false);
    const [refreshPositions, setRefreshPositions] = useState(0);
    const [lakeBalance, setLakeBalance] = useState(0);
    const lakeBalanceAsBigNumber = useTokenBalance(lakeAddress, account);

    useEffect(() => {
        const fetchData = async (account: string, library: JsonRpcProvider) => {
            setPositions(await usePositions(library, account));
            setArePositionsLoading(false);
        };

        if (library && account) {
            setArePositionsLoading(true);
            fetchData(account, library).catch(console.error);
        }
    }, [library, account, refreshPositions]);

    useEffect(() => {
        setLakeBalance(
            lakeBalanceAsBigNumber
                ? parseBigNumber(lakeBalanceAsBigNumber, ASSET_LAKE.decimals)
                : 0,
        );
    }, [lakeBalanceAsBigNumber]);

    return (
        <div className="w-full flex flex-col items-center mt-10 mb-4">
            <div className="w-full flex flex-col items-center">
                <GradientButton
                    size="medium"
                    disabled={false}
                    text="PROVIDE LIQUIDITY"
                    onClick={() => {
                        setIsProvideLiquidityModalOpen(true);
                    }}
                />
                <span className="text-sm tracking-[.1em] my-2">
                    {formatValue(lakeBalance, ASSET_LAKE.symbol, 0)} AVAILABLE
                </span>
                <ProvideLiquidityModal
                    isOpen={isProvideLiquidityModalOpen}
                    isLoading={arePositionsLoading}
                    positions={positions}
                    lakeBalance={lakeBalance}
                    closeModal={() => {
                        setIsProvideLiquidityModalOpen(false);
                    }}
                    refreshPositions={() => {
                        setRefreshPositions(new Date().getTime());
                    }}
                />
            </div>
            <div className="w-full flex flex-col items-center mt-8">
                <Button
                    size="medium"
                    disabled={positions.length === 0}
                    text="REMOVE LIQUIDITY"
                    onClick={() => {
                        setIsRemoveLiquidityModalOpen(true);
                    }}
                />
                <span className="text-sm tracking-[.1em] my-2">
                    {positions.length} ACTIVE POSITIONS
                </span>
                <RemoveLiquidityModal
                    isOpen={isRemoveLiquidityModalOpen}
                    isLoading={arePositionsLoading}
                    positions={positions}
                    closeModal={() => {
                        setIsRemoveLiquidityModalOpen(false);
                    }}
                    refreshPositions={() => {
                        setRefreshPositions(new Date().getTime());
                    }}
                />
            </div>
        </div>
    );
};
