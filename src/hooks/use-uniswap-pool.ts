import { BigNumber, Contract } from 'ethers';

import { JsonRpcProvider } from '@ethersproject/providers';
import { Pool } from '@uniswap/v3-sdk';
import { useConfig } from './use-config';
import { usePoolContract } from './use-pool-contract';
import { useToken } from './use-token';

export interface Immutables {
    fee: number;
    tickSpacing: number;
}

interface State {
    liquidity: BigNumber;
    sqrtPriceX96: BigNumber;
    tick: number;
}

export const useUniswapPool = async (
    provider: JsonRpcProvider,
    baseTokenAddress: string,
    quoteTokenAddress: string,
    blockTag?: number,
) => {
    const { getPool } = useConfig();
    const pool = getPool(baseTokenAddress, quoteTokenAddress);
    const poolContract = usePoolContract(provider, pool!.poolAddress);
    const baseToken = useToken(baseTokenAddress, pool!.token0.symbol);
    const quoteToken = useToken(quoteTokenAddress, pool!.token1.symbol);
    const [immutables, state] = await Promise.all([
        getPoolImmutables(poolContract),
        getPoolState(poolContract, blockTag),
    ]);
    return new Pool(
        baseToken,
        quoteToken,
        immutables.fee,
        state.sqrtPriceX96.toString(),
        state.liquidity.toString(),
        state.tick,
    );
};

export const getPoolImmutables = async (
    poolContract: Contract,
): Promise<Immutables> => {
    return {
        fee: await poolContract.fee(),
        tickSpacing: await poolContract.tickSpacing(),
    };
};

export const getPoolState = async (
    poolContract: Contract,
    blockTag?: number,
): Promise<State> => {
    const [liquidity, slot] = await Promise.all([
        poolContract.liquidity({ blockTag }),
        poolContract.slot0({ blockTag }),
    ]);

    return {
        liquidity,
        sqrtPriceX96: slot[0],
        tick: slot[1],
    };
};
