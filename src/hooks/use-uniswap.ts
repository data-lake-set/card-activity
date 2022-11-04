import { ASSET_LAKE, ASSET_USDT } from '../constants/assets';
import { BigNumber, Contract } from 'ethers';

import { JsonRpcProvider } from '@ethersproject/providers';
import { Pool } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core';
import { uniswapV3PoolAbi } from '../abis/uniswapV3Pool';
import { useConfig } from './use-config';

interface Immutables {
    fee: number;
}

interface State {
    liquidity: BigNumber;
    sqrtPriceX96: BigNumber;
    tick: number;
}

export const useUniswap = () => {
    const { chainId, lakeAddress, usdtAddress, usdtLakePoolAddress } =
        useConfig();

    const getLakePrice = async (provider: JsonRpcProvider): Promise<number> => {
        const poolContract = new Contract(
            usdtLakePoolAddress,
            uniswapV3PoolAbi,
            provider,
        );

        const [immutables, state] = await Promise.all([
            getPoolImmutables(poolContract),
            getPoolState(poolContract),
        ]);

        const usdt = new Token(
            chainId,
            usdtAddress,
            ASSET_USDT.decimals,
            ASSET_USDT.symbol,
            ASSET_USDT.name,
        );

        const lake = new Token(
            chainId,
            lakeAddress,
            ASSET_LAKE.decimals,
            ASSET_LAKE.symbol,
            ASSET_LAKE.name,
        );

        const pool = new Pool(
            usdt,
            lake,
            immutables.fee,
            state.sqrtPriceX96.toString(),
            state.liquidity.toString(),
            state.tick,
        );
        return Number(pool.token1Price.toSignificant());
    };

    const getPoolImmutables = async (
        poolContract: Contract,
    ): Promise<Immutables> => {
        return {
            fee: await poolContract.fee(),
        };
    };

    const getPoolState = async (poolContract: Contract): Promise<State> => {
        const [liquidity, slot] = await Promise.all([
            poolContract.liquidity(),
            poolContract.slot0(),
        ]);

        return {
            liquidity,
            sqrtPriceX96: slot[0],
            tick: slot[1],
        };
    };

    return {
        getLakePrice,
    };
};
