import { IVestingSchedule } from '../../../../interfaces/vestingSchedule.interface';
import { TabProgressBar } from '../../../progressBar/TabProgressBar';
import { formatValue } from '../../../../utils/formatValue';

interface Props {
    vestingSchedule: IVestingSchedule;
}

export const ScheduleCard = ({ vestingSchedule }: Props) => {
    return (
        <div className="w-full mt-4 flex bg-black-700 rounded-[20px] inset-shadow overflow-auto">
            <div className="w-full flex flex-col py-4 px-2">
                <div className="w-full flex flex-col items-center justify-between">
                    <div className="w-full flex justify-between items-center">
                        <div className="w-[40%] flex justify-between">
                            <span className="font-kanit-regular color-gray-gradient text-shadow text-xs tracking-[.1em]">
                                STATUS
                            </span>
                            <span
                                className={`font-kanit-regular text-center text-xs ${
                                    vestingSchedule.isUnlocked
                                        ? 'text-gray-500'
                                        : 'color-gradient'
                                }`}
                            >
                                {vestingSchedule.isUnlocked
                                    ? 'Unlocked'
                                    : 'Vesting'}
                            </span>
                        </div>
                        <div className="w-[55%] flex justify-between">
                            <span className="w-1/2 font-kanit-regular color-gray-gradient text-shadow text-xs tracking-[.1em]">
                                VESTING RATE
                            </span>
                            <span
                                className={`flex text-xs text-end items-center ${
                                    vestingSchedule.isUnlocked
                                        ? 'text-gray-500'
                                        : 'color-gradient'
                                }`}
                            >
                                {vestingSchedule.vestingRateAsString}
                            </span>
                        </div>
                    </div>

                    <div className="w-full flex justify-between items-center mt-4">
                        <div className="w-[40%] flex justify-between">
                            <span className="font-kanit-regular color-gray-gradient text-shadow text-xs tracking-[.1em]">
                                SCHEDULE
                            </span>
                            <span
                                className={`text-center text-xs ${
                                    vestingSchedule.isUnlocked
                                        ? 'text-gray-500'
                                        : 'color-gradient'
                                }`}
                            >
                                {vestingSchedule.name}
                            </span>
                        </div>
                        <div className="w-[55%] flex justify-between">
                            <span className="w-1/2 text-start font-kanit-regular color-gray-gradient text-shadow text-xs tracking-[.1em]">
                                AMOUNT AVAILABLE
                            </span>
                            <span className="flex text-xs text-end items-center color-gradient">
                                {formatValue(
                                    vestingSchedule.availableAmount,
                                    '',
                                    0,
                                )}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col items-center justify-between mt-8">
                    <div className="w-full flex justify-between">
                        <span className="w-[30%] font-kanit-regular color-gray-gradient text-shadow text-xs tracking-[.1em] text-center">
                            CLIFF
                        </span>
                        <span className="w-[30%] font-kanit-regular color-gray-gradient text-shadow text-xs tracking-[.1em] text-center">
                            UNLOCKED
                        </span>
                        <span className="w-[30%] font-kanit-regular color-gray-gradient text-shadow text-xs tracking-[.1em] text-center">
                            WITHDRAWN
                        </span>
                    </div>
                    <div className="w-full flex justify-between items-end mt-2">
                        <div className="w-[30%] flex flex-col items-center">
                            <span
                                className={`flex text-center mb-2 text-xs mb-2 ${
                                    vestingSchedule.isUnlocked
                                        ? 'text-gray-500'
                                        : ''
                                }`}
                            >
                                {vestingSchedule.durationLeft} DAYS LEFT
                            </span>
                            <TabProgressBar
                                completed={vestingSchedule.durationProgress}
                            />
                        </div>
                        <div className="w-[30%] flex flex-col items-center">
                            <span
                                className={`flex text-center mb-2 text-xs mb-2 ${
                                    vestingSchedule.isUnlocked
                                        ? 'text-gray-500'
                                        : ''
                                }`}
                            >
                                {formatValue(
                                    vestingSchedule.unlockedAmount,
                                    '',
                                    0,
                                )}{' '}
                                /{' '}
                                {formatValue(
                                    vestingSchedule.allocatedAmount,
                                    '',
                                    0,
                                )}
                            </span>
                            <TabProgressBar
                                completed={
                                    (vestingSchedule.unlockedAmount * 100) /
                                    vestingSchedule.allocatedAmount
                                }
                            />
                        </div>
                        <div className="w-[30%] flex flex-col items-center">
                            <span
                                className={`flex text-center mb-2 text-xs mb-2 ${
                                    vestingSchedule.isUnlocked
                                        ? 'text-gray-500'
                                        : ''
                                }`}
                            >
                                {formatValue(
                                    vestingSchedule.withdrawnAmount,
                                    '',
                                    0,
                                )}{' '}
                                /{' '}
                                {formatValue(
                                    vestingSchedule.allocatedAmount,
                                    '',
                                    0,
                                )}
                            </span>
                            <TabProgressBar
                                completed={
                                    (vestingSchedule.withdrawnAmount * 100) /
                                    vestingSchedule.allocatedAmount
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
