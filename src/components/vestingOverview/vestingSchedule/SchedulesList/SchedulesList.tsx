import { IVestingSchedule } from '../../../../interfaces/vestingSchedule.interface';
import { ScheduleCard } from './ScheduleCard';

interface Props {
    data: IVestingSchedule[];
}

export const SchedulesList = ({ data }: Props) => {
    return (
        <div className="w-full mb-4">
            {data.length > 0 ? (
                <>
                    {data.map((vestingSchedule) => (
                        <ScheduleCard vestingSchedule={vestingSchedule} />
                    ))}
                </>
            ) : (
                <div className="w-full flex justify-center items-center mt-36">
                    NO VESTING SCHEDULES TO SHOW
                </div>
            )}
        </div>
    );
};
