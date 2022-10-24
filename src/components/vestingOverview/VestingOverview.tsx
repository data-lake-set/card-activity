import { useContext, useEffect, useState } from 'react';

import { IBeneficiaryOverview } from '../../interfaces/beneficiaryOverview.interface';
import { IVestingSchedule } from '../../interfaces/vestingSchedule.interface';
import { JsonRpcProvider } from '@ethersproject/providers';
import { VestingSchedule } from './vestingSchedule/VestingSchedule';
import { WalletConnectContext } from '../../context';
import { Withdraw } from './withdraw/Withdraw';
import { formatVestingScheduleData } from '../../utils/formatVestingScheduleData';
import { useBeneficiaryOverview } from '../../hooks/use-beneficiary-overview';

export const VestingOverview = () => {
    const { account, library } = useContext(WalletConnectContext);
    const [vestingSchedules, setVestingSchedules] = useState<
        IVestingSchedule[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getBeneficiaryOverview } = useBeneficiaryOverview();

    useEffect(() => {
        const fetchData = async (library: JsonRpcProvider, account: string) => {
            const beneficiaryOverview = await getBeneficiaryOverview(
                library,
                account,
            );
            const vestingSchedules = beneficiaryOverview.map(
                (el: IBeneficiaryOverview) => formatVestingScheduleData(el),
            );

            setVestingSchedules(vestingSchedules);
            setIsLoading(false);
        };

        if (library && account) {
            setIsLoading(true);
            fetchData(library, account).catch(console.error);
        }
    }, [library, account]);

    return (
        <div className="w-full h-full flex justify-between">
            <div className="w-[77%]">
                <VestingSchedule
                    data={vestingSchedules}
                    isLoading={isLoading}
                />
            </div>
            <div className="w-[21%]">
                <Withdraw data={vestingSchedules} isLoading={isLoading} />
            </div>
        </div>
    );
};
