import { Contract } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { parseBigNumber } from '../utils/parseBigNumber';
import { useConfig } from './use-config';
import { vestingScheduleAbi } from '../abis/vestingSchedule';

export const useTgeTimestamp = async (
    provider: JsonRpcProvider,
): Promise<number> => {
    try {
        const { vestingScheduleAddress } = useConfig();
        const vestingScheduleContract = new Contract(
            vestingScheduleAddress,
            vestingScheduleAbi,
            provider,
        );
        const tgeTimestampAsBigNumber =
            await vestingScheduleContract.callStatic.tgeTimestamp();
        return parseBigNumber(tgeTimestampAsBigNumber, 0);
    } catch (e) {
        console.error('Failed to get TGE timestamp: ', e);
        return 0;
    }
};
