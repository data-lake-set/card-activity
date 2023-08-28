import { JsonRpcProvider } from '@ethersproject/providers';
import { useStakerContract } from './use-staker-contract';
import { useConfig } from './use-config';
import { BigNumber } from 'ethers';

export const useRewards = async (
    provider: JsonRpcProvider,
    account: string,
): Promise<BigNumber> => {
    const { lakeAddress } = useConfig();
    const stakingContract = useStakerContract(provider);
    const rewardsAsBigNumber = await stakingContract.callStatic.rewards(
        lakeAddress,
        account,
    );
    return rewardsAsBigNumber;
};
