import { Contract } from 'ethers';
import { IPositionDetails } from '../interfaces/positionDetails.interface';
import { JsonRpcProvider } from '@ethersproject/providers';
import { stakingAbi } from '../abis/staking';
import { useConfig } from './use-config';
import { usePositionDetailsById } from './use-position-details-by-id';

export const useStakedPositions = async (
    provider: JsonRpcProvider,
    account: string,
): Promise<IPositionDetails[]> => {
    const stakedPositions: IPositionDetails[] = [];
    try {
        const { stakingAddress } = useConfig();
        const stakingContract = new Contract(
            stakingAddress,
            stakingAbi,
            provider.getSigner(account),
        );
        const positionIds: number[] =
            await stakingContract.callStatic.stakedBalance(account);
        if (positionIds.length > 0) {
            positionIds.forEach(async (id: number) => {
                const position = await usePositionDetailsById(provider, id);
                if (position) {
                    stakedPositions.push(position);
                }
            });
        }
    } catch (e) {
        console.error('Failed to get staked positions: ', e);
    }
    return stakedPositions;
};
