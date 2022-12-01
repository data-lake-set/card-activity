import { BigNumber, Contract } from 'ethers';

import { ASSET_LAKE } from '../constants/assets';
import { ERC20Abi } from '../abis/ERC20';
import { JsonRpcProvider } from '@ethersproject/providers';
import { parseBigNumber } from '../utils/parseBigNumber';
import { useConfig } from './use-config';

export const useLakeCirculationSupply = async (
    provider: JsonRpcProvider,
    blockTag?: number,
): Promise<number> => {
    const { lakeAddress, vestingScheduleAddress, pools } = useConfig();
    const lakeTokenContract = new Contract(lakeAddress, ERC20Abi, provider);
    try {
        const totalSupply = await lakeTokenContract.callStatic.totalSupply();
        const vestingScheduleContractBalance =
            await lakeTokenContract.callStatic.balanceOf(
                vestingScheduleAddress,
                {
                    blockTag,
                },
            );

        let uniswapPoolBalances = BigNumber.from(0);
        pools.forEach(async (pool) => {
            uniswapPoolBalances.add(
                await lakeTokenContract.callStatic.balanceOf(pool.poolAddress, {
                    blockTag,
                }),
            );
        });

        return (
            parseBigNumber(totalSupply, ASSET_LAKE.decimals) -
            parseBigNumber(
                vestingScheduleContractBalance,
                ASSET_LAKE.decimals,
            ) -
            parseBigNumber(uniswapPoolBalances, ASSET_LAKE.decimals)
        );
    } catch (e) {
        console.error('Failed to get LAKE circulation supply: ', e);
        return 0;
    }
};
