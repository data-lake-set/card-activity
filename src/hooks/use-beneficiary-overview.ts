import { Contract } from 'ethers';
import { IBeneficiaryOverview } from '../interfaces/beneficiaryOverview.interface';
import { JsonRpcProvider } from '@ethersproject/providers';
import { useConfig } from './use-config';
import { vestingScheduleAbi } from '../abis/vestingSchedule';

export const useBeneficiaryOverview = async (
    provider: JsonRpcProvider,
    account: string,
): Promise<IBeneficiaryOverview[]> => {
    const { vestingScheduleAddress } = useConfig();
    const vestingScheduleContract = new Contract(
        vestingScheduleAddress,
        vestingScheduleAbi,
        provider,
    );
    try {
        return await vestingScheduleContract.callStatic.getBeneficiaryOverview(
            account,
        );
    } catch (e) {
        console.error('Failed to get beneficiary overview: ', e);
        return [];
    }
};
