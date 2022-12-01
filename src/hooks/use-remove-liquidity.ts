import { CurrencyAmount, Percent } from '@uniswap/sdk-core';
import { NonfungiblePositionManager, Position } from '@uniswap/v3-sdk';

import { ASSET_LAKE } from '../constants/assets';
import { IPositionDetails } from '../interfaces/positionDetails.interface';
import { JsonRpcProvider } from '@ethersproject/providers';
import { useConfig } from './use-config';
import { useToken } from './use-token';
import { useUniswapPool } from './use-uniswap-pool';

export const useRemoveLiquidity = async (
    provider: JsonRpcProvider,
    slippageTolerance: number,
    transactionDeadline: number,
    account: string,
    positionDetails: IPositionDetails,
    percentage: number,
): Promise<void> => {
    try {
        const { nonfungiblePositionManagerAddress, lakeAddress } = useConfig();
        const pool = await useUniswapPool(
            provider,
            positionDetails.tokenAddress,
            lakeAddress,
        );
        const position = new Position({
            pool,
            liquidity: positionDetails.liquidity,
            tickLower: positionDetails.tickLower,
            tickUpper: positionDetails.tickUpper,
        });

        const deadline = (
            new Date().getTime() / 1000 +
            transactionDeadline * 60
        )
            .toFixed()
            .toString();

        const { calldata, value } =
            NonfungiblePositionManager.removeCallParameters(position, {
                tokenId: positionDetails.positionId,
                liquidityPercentage: new Percent(percentage * 100, 10000),
                slippageTolerance: new Percent(slippageTolerance * 100, 10000),
                deadline,
                collectOptions: {
                    expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(
                        useToken(
                            positionDetails.tokenAddress,
                            positionDetails.tokenSymbol,
                        ),
                        0,
                    ),
                    expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(
                        useToken(lakeAddress, ASSET_LAKE.symbol),
                        0,
                    ),
                    recipient: account,
                },
            });

        const txn: { to: string; data: string; value: string } = {
            to: nonfungiblePositionManagerAddress,
            data: calldata,
            value,
        };

        const gasLimit = await provider.getSigner().estimateGas(txn);
        const newTxn = {
            ...txn,
            gasLimit,
        };
        const resp = await provider.getSigner().sendTransaction(newTxn);
        await resp.wait();
    } catch (e) {
        console.error('Failed to remove liquidity: ', e);
    }
};
