import { useEffect, useState } from 'react';

import { ClipLoader } from 'react-spinners';
import { FirstStep } from './FirstStep';
import { IPool } from '../../../../../interfaces/pool.interface';
import { IPositionDetails } from '../../../../../interfaces/positionDetails.interface';
import ReactModal from 'react-modal';
import { SecondStep } from './SecondStep';
import cancelIcon from './../../../../../assets/icons/cancel-icon.svg';
import { colors } from '../../../../../constants/colors';
import { customModalStyle } from '../../../../../constants/modal';
import { useConfig } from '../../../../../hooks/use-config';

type Props = {
    isOpen: boolean;
    isLoading: boolean;
    positions: IPositionDetails[];
    lakeBalance: number;
    refreshPositions: () => void;
    closeModal: () => void;
};

ReactModal.setAppElement('#root');

export const ProvideLiquidityModal = ({
    isOpen,
    isLoading,
    positions,
    lakeBalance,
    refreshPositions,
    closeModal,
}: Props) => {
    const { lakeAddress, ethAddress, getPool } = useConfig();
    const [step, setStep] = useState(1);
    const [pool, setPool] = useState<IPool>(getPool(ethAddress, lakeAddress)!);
    const [selectedPosition, setSelectedPosition] = useState<
        IPositionDetails | undefined
    >(undefined);

    useEffect(() => {
        setSelectedPosition(undefined);
        setStep(positions.length === 0 ? 2 : 1);
    }, [positions]);

    useEffect(() => {
        setStep(!!selectedPosition ? 2 : 1);
        const pool = getPool(
            !!selectedPosition ? selectedPosition.tokenAddress : ethAddress,
            lakeAddress,
        )!;
        setPool(pool);
    }, [selectedPosition]);

    const onCloseClick = () => {
        setSelectedPosition(undefined);
        closeModal();
    };

    return (
        <ReactModal
            isOpen={isOpen}
            style={customModalStyle}
            contentLabel="Provide Liquidity Modal"
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            onRequestClose={onCloseClick}
        >
            <div className="flex flex-col">
                <div className="flex justify-end items-center mb-6">
                    <span className="text-sm tracking-[.1em] mr-2 text-gray-500">
                        CLOSE
                    </span>
                    <div className="w-8 h-8 flex justify-center items-center rounded-[32px] border border-gray-500 p-1">
                        <img
                            className="cursor-pointer"
                            src={cancelIcon}
                            onClick={onCloseClick}
                            alt="close"
                        ></img>
                    </div>
                </div>
                <div className="flex flex-col rounded-[32px] border border-gray-500 p-8 bg-black-800">
                    {isLoading ? (
                        <div className="flex min-w-[20vw] h-[20rem] justify-center items-center">
                            <ClipLoader
                                className="!w-[5rem] !h-[5rem]"
                                color={colors.gray['300']}
                                loading
                            />
                        </div>
                    ) : (
                        <>
                            {step === 1 ? (
                                <FirstStep
                                    positions={positions}
                                    selectPosition={(position) =>
                                        setSelectedPosition(position)
                                    }
                                    onNewPositionClick={() => {
                                        setStep(2);
                                    }}
                                />
                            ) : (
                                <SecondStep
                                    pool={pool}
                                    lakeBalance={lakeBalance}
                                    selectedPosition={selectedPosition}
                                    refreshPositions={refreshPositions}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </ReactModal>
    );
};
