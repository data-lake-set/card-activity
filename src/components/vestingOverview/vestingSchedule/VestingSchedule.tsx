import { ClipLoader } from 'react-spinners';
import { ConnectWallet } from '../../connectWallet/ConnectWallet';
import { IVestingSchedule } from '../../../interfaces/vestingSchedule.interface';
import { ScheduleTab } from './ScheduleTab';
import { SchedulesList } from './SchedulesList/SchedulesList';
import { WalletConnectContext } from '../../../context';
import { colors } from '../../../constants/colors';
import { useContext } from 'react';

interface Props {
    data: IVestingSchedule[];
    isLoading: boolean;
}

export const VestingSchedule = ({ data, isLoading }: Props) => {
    const { account } = useContext(WalletConnectContext);
    return (
        <div className="w-full h-full bg-black-700 rounded-[30px] inset-shadow relative">
            <div
                className={`w-full h-full flex flex-col items-center px-4 ${
                    account ? '' : 'blur-sm pointer-events-none'
                }`}
            >
                <div className="w-full flex justify-start py-12 lg:px-6">
                    <div className="text-center lg:text-start font-kanit-medium color-gray-gradient text-shadow text-xl tracking-[.12em]">
                        YOUR $LAKE VESTING SCHEDULE
                    </div>
                </div>
                <div className="w-full overflow-auto">
                    {isLoading ? (
                        <div className="w-full flex my-24 justify-center">
                            <ClipLoader color={colors.gray['300']} loading />
                        </div>
                    ) : (
                        <>
                            <div className="hidden lg:flex">
                                <ScheduleTab data={data} />
                            </div>
                            <div className="flex lg:hidden">
                                <SchedulesList data={data} />
                            </div>
                        </>
                    )}
                </div>
            </div>
            {!account && <ConnectWallet />}
        </div>
    );
};
