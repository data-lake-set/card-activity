import { CurrencyAmount, Percent } from '@uniswap/sdk-core';
import { NonfungiblePositionManager, Position } from '@uniswap/v3-sdk';

import { IPositionDetails } from '../interfaces/positionDetails.interface';
import { JsonRpcProvider } from '@ethersproject/providers';
import { useConfig } from './use-config';
import { useLakeToken } from './use-lake-token';
import { useUniswapPool } from './use-uniswap-pool';
import { useUsdtToken } from './use-usdt-token';

export const useRemoveLiquidity = async (
    provider: JsonRpcProvider,
    slippageTolerance: number,
    transactionDeadline: number,
    account: string,
    positionDetails: IPositionDetails,
    percentage: number,
): Promise<void> => {
    try {
        const { nonfungiblePositionManagerAddress } = useConfig();
        const pool = await useUniswapPool(provider);
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
                liquidityPercentage: new Percent(percentage, 100),
                slippageTolerance: new Percent(slippageTolerance * 100, 10000),
                deadline,
                collectOptions: {
                    expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(
                        useUsdtToken(),
                        0,
                    ),
                    expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(
                        useLakeToken(),
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
