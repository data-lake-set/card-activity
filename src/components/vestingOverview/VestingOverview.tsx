import { useContext, useEffect, useState } from 'react';

import { IBeneficiaryOverview } from '../../interfaces/beneficiaryOverview.interface';
import { IVestingSchedule } from '../../interfaces/vestingSchedule.interface';
import { JsonRpcProvider } from '@ethersproject/providers';
import { VestingSchedule } from './vestingSchedule/VestingSchedule';
import { WalletConnectContext } from '../../context';
import { Withdraw } from './withdraw/Withdraw';
import { formatVestingScheduleData } from '../../utils/formatVestingScheduleData';
import { useBeneficiaryOverview } from '../../hooks/use-beneficiary-overview';
import { useTgeTimestamp } from '../../hooks/use-tge-timestamp';

export const VestingOverview = () => {
    const { account, library } = useContext(WalletConnectContext);
    const [vestingSchedules, setVestingSchedules] = useState<
        IVestingSchedule[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const fetchData = async (library: JsonRpcProvider, account: string) => {
            const beneficiaryOverview = await useBeneficiaryOverview(
                library,
                account,
            );
            const tgeTimestamp = await useTgeTimestamp(library);

            const vestingSchedules = beneficiaryOverview.map(
                (el: IBeneficiaryOverview) =>
                    formatVestingScheduleData(el, tgeTimestamp),
            );

            setVestingSchedules(vestingSchedules);
            setIsLoading(false);
        };

        if (library && account) {
            setIsLoading(true);
            fetchData(library, account).catch(console.error);
        }
    }, [library, account, refresh]);

    return (
        <div className="w-full h-full flex justify-between">
            <div className="w-[77%]">
                <VestingSchedule
                    data={vestingSchedules}
                    isLoading={isLoading}
                />
            </div>
            <div className="w-[21%]">
                <Withdraw
                    data={vestingSchedules}
                    isLoading={isLoading}
                    refresh={() => setRefresh(new Date().getTime())}
                />
            </div>
        </div>
    );
};
