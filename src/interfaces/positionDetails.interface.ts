import { BigintIsh } from '@uniswap/sdk-core';

export interface IPositionDetails {
    positionId: number;
    liquidity: BigintIsh;
    tickLower: number;
    tickUpper: number;
    lowerPrice: string;
    upperPrice: string;
    tokenAmount: number;
    tokenSymbol: string;
    tokenAddress: string;
    lakeAmount: number;
}
