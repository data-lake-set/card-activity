import { ASSET_LAKE, ASSET_USDT } from '../constants/assets';
import { NonfungiblePositionManager, Position } from '@uniswap/v3-sdk';

import { IPositionDetails } from '../interfaces/positionDetails.interface';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Percent } from '@uniswap/sdk-core';
import { useConfig } from './use-config';
import { useUniswapPool } from './use-uniswap-pool';

export const useProvideLiquidity = async (
    provider: JsonRpcProvider,
    usdtAmount: number,
    lakeAmount: number,
    slippageTolerance: number,
    transactionDeadline: number,
    tickLower: number,
    tickUpper: number,
    account: string,
    selectedPosition?: IPositionDetails,
): Promise<void> => {
    try {
        const { nonfungiblePositionManagerAddress } = useConfig();
        const pool = await useUniswapPool(provider);
        const position = Position.fromAmounts({
            pool,
            amount0: Math.round(usdtAmount * 10 ** ASSET_USDT.decimals),
            amount1: Math.round(lakeAmount * 10 ** ASSET_LAKE.decimals),
            tickLower: selectedPosition
                ? selectedPosition.tickLower
                : tickLower,
            tickUpper: selectedPosition
                ? selectedPosition.tickUpper
                : tickUpper,
            useFullPrecision: true,
        });

        const deadline = (
            new Date().getTime() / 1000 +
            transactionDeadline * 60
        )
            .toFixed()
            .toString();

        const { calldata, value } = selectedPosition
            ? NonfungiblePositionManager.addCallParameters(position, {
                  tokenId: selectedPosition.positionId,
                  slippageTolerance: new Percent(
                      slippageTolerance * 100,
                      10000,
                  ),
                  deadline,
              })
            : NonfungiblePositionManager.addCallParameters(position, {
                  slippageTolerance: new Percent(
                      slippageTolerance * 100,
                      10000,
                  ),
                  recipient: account,
                  deadline,
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
        console.error('Failed to provide liquidity: ', e);
    }
};
