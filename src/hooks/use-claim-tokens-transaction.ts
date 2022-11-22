import { Contract, ContractTransaction } from 'ethers';

import { JsonRpcSigner } from '@ethersproject/providers';
import { useConfig } from './use-config';
import { vestingScheduleAbi } from '../abis/vestingSchedule';

export const useClaimTokensTransaction = async (
    signer: JsonRpcSigner,
): Promise<ContractTransaction | undefined> => {
    const { vestingScheduleAddress } = useConfig();
    const vestingScheduleContract = new Contract(
        vestingScheduleAddress,
        vestingScheduleAbi,
        signer,
    );
    try {
        return await vestingScheduleContract.claimAllTokens();
    } catch (e) {
        console.error('Failed to claim tokens: ', e);
    }
};
