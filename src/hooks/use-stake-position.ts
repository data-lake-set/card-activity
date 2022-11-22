import { Contract } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { stakingAbi } from '../abis/staking';
import { useConfig } from './use-config';

export const useStakePosition = async (
    provider: JsonRpcProvider,
    account: string,
    positionId: number,
): Promise<void> => {
    try {
        const { stakingAddress } = useConfig();
        const stakingContract = new Contract(
            stakingAddress,
            stakingAbi,
            provider.getSigner(account),
        );
        const tx = await stakingContract.stake(positionId);
        return await tx.wait();
    } catch (e) {
        console.error('Failed to stake position: ', e);
    }
};
