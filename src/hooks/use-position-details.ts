import { Position, tickToPrice } from '@uniswap/v3-sdk';

import { IPositionDetails } from '../interfaces/positionDetails.interface';
import { JsonRpcProvider } from '@ethersproject/providers';
import { MAX_TICK } from '../constants/commons';
import { useConfig } from './use-config';
import { useToken } from './use-token';
import { useUniswapPool } from './use-uniswap-pool';

export const usePositionDetails = async (
    provider: JsonRpcProvider,
    positionId: number,
    position: any,
): Promise<IPositionDetails | undefined> => {
    try {
        const { getPool } = useConfig();
        const pool = getPool(position.token0, position.token1);
        const baseToken = useToken(position.token0, pool!.token0.symbol);
        const quoteToken = useToken(position.token1, pool!.token1.symbol);
        const posDetails = new Position({
            pool: await useUniswapPool(
                provider,
                position.token0,
                position.token1,
            ),
            liquidity: position.liquidity,
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
        });
        return {
            positionId,
            liquidity: posDetails.liquidity,
            tickLower: posDetails.tickLower,
            tickUpper: posDetails.tickUpper,
            lowerPrice:
                posDetails.tickLower === -MAX_TICK
                    ? '0'
                    : tickToPrice(
                          baseToken,
                          quoteToken,
                          position.tickLower,
                      ).toSignificant(),
            upperPrice:
                posDetails.tickUpper === MAX_TICK
                    ? '∞'
                    : tickToPrice(
                          baseToken,
                          quoteToken,
                          position.tickUpper,
                      ).toSignificant(),
            tokenAmount: Number(posDetails.amount0.toSignificant(4)),
            tokenAddress: pool!.token0.address,
            tokenSymbol: pool!.token0.symbol,
            lakeAmount: Number(posDetails.amount1.toSignificant(4)),
        };
    } catch (e) {
        console.error('Failed to get position details: ', e);
    }
};
