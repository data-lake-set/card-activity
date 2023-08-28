import { JsonRpcProvider } from '@ethersproject/providers';
import { useConfig } from './use-config';
import { BigNumber, Contract } from 'ethers';
import { uniswapV3StakerAbi } from '../abis/uniswapV3Staker';

export const useClaimRewards = async (
    provider: JsonRpcProvider,
    account: string,
    rewards: BigNumber,
): Promise<void> => {
    const { uniswapV3StakerAddress, lakeAddress } = useConfig();
    const stakerContract = new Contract(
        uniswapV3StakerAddress,
        uniswapV3StakerAbi,
        provider.getSigner(),
    );

    const txn = await stakerContract.claimReward(lakeAddress, account, rewards);
    await txn.wait();
};
