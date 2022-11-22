import { Position, tickToPrice } from '@uniswap/v3-sdk';

import { IPositionDetails } from '../interfaces/positionDetails.interface';
import { JsonRpcProvider } from '@ethersproject/providers';
import { MAX_TICK } from '../constants/commons';
import { useLakeToken } from './use-lake-token';
import { useUniswapPool } from './use-uniswap-pool';
import { useUsdtToken } from './use-usdt-token';

export const usePositionDetails = async (
    provider: JsonRpcProvider,
    positionId: number,
    position: any,
): Promise<IPositionDetails | undefined> => {
    try {
        const quoteToken = useLakeToken();
        const baseToken = useUsdtToken();
        const posDetails = new Position({
            pool: await useUniswapPool(provider),
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
            usdtAmount: Number(posDetails.amount0.toSignificant(4)),
            lakeAmount: Number(posDetails.amount1.toSignificant(4)),
        };
    } catch (e) {
        console.error('Failed to get position details: ', e);
    }
};
