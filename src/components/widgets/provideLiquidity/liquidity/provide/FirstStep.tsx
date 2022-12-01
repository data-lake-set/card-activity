import { Button } from '../../../../button/Button';
import { IPositionDetails } from '../../../../../interfaces/positionDetails.interface';
import { PositionsList } from '../../PositionsList';

type Props = {
    positions: IPositionDetails[];
    selectPosition: (position: IPositionDetails) => void;
    onNewPositionClick: () => void;
};

export const FirstStep = ({
    positions,
    selectPosition,
    onNewPositionClick,
}: Props) => (
    <>
        <div className="font-kanit-medium color-gray-gradient text-shadow text-xl tracking-[.12em] text-center mb-4">
            CHOOSE POSITION
        </div>
        <div className="flex min-w-[20vw]">
            <PositionsList
                positions={positions}
                onClick={(position) => selectPosition(position)}
            />
        </div>
        <div className="flex flex-col items-center">
            <div className="mt-8">
                <Button
                    size="medium"
                    disabled={false}
                    text="NEW POSITION"
                    onClick={onNewPositionClick}
                />
            </div>
        </div>
    </>
);
