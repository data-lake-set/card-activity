import { ClipLoader } from 'react-spinners';
import { GradientButtonWithIcon } from '../../button/gradient/GradientButtonWithIcon';
import { IVestingSchedule } from '../../../interfaces/vestingSchedule.interface';
import { ScheduleTab } from './ScheduleTab';
import { WalletConnectContext } from '../../../context';
import { colors } from '../../../constants/colors';
import keyIcon from './../../../assets/icons/key-icon.svg';
import { useContext } from 'react';

interface Props {
    data: IVestingSchedule[];
    isLoading: boolean;
}

export const VestingSchedule = ({ data, isLoading }: Props) => {
    const { account, activateProvider } = useContext(WalletConnectContext);

    const activate = async () => {
        await activateProvider();
    };
    return (
        <div className="w-full h-full bg-black-700 rounded-[30px] inset-shadow relative">
            <div
                className={`w-full h-full flex flex-col items-center px-4 ${
                    account ? '' : 'blur-sm'
                }`}
            >
                <div className="w-full flex justify-start py-10 px-6">
                    <div className="font-kanit-medium color-gray-gradient text-shadow text-xl tracking-[.12em]">
                        YOUR $LAKE VESTING SCHEDULE
                    </div>
                </div>
                <div className="w-full flex flex-col items-center justify-center">
                    {isLoading ? (
                        <div className="my-24">
                            <ClipLoader color={colors.gray['300']} loading />
                        </div>
                    ) : (
                        <ScheduleTab data={data} />
                    )}
                </div>
            </div>
            {!account && (
                <div className="absolute top-[50%] left-[37%]">
                    <GradientButtonWithIcon
                        size="medium"
                        disabled={false}
                        text="CONNECT WALLET"
                        onClick={activate}
                    >
                        <img src={keyIcon} alt="key"></img>
                    </GradientButtonWithIcon>
                </div>
            )}
        </div>
    );
};
