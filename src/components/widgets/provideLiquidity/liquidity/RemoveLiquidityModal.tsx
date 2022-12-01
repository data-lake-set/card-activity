import '../../../../assets/rc-slider.css';

import { ASSET_LAKE, ASSET_USDT } from '../../../../constants/assets';
import {
    DEFAULT_SLIPPAGE_TOLERANCE,
    DEFAULT_TRANSACTION_DEADLINE,
} from '../../../../constants/commons';
import { useContext, useEffect, useState } from 'react';

import { Button } from '../../../button/Button';
import { ButtonWithSpinner } from '../../../button/ButtonWithSpinner';
import { ClipLoader } from 'react-spinners';
import { IPositionDetails } from '../../../../interfaces/positionDetails.interface';
import { PositionsList } from '../PositionsList';
import ReactModal from 'react-modal';
import { Settings } from './Settings';
import Slider from 'rc-slider';
import { WalletConnectContext } from '../../../../context';
import cancelIcon from '../../../../assets/icons/cancel-icon.svg';
import { colors } from '../../../../constants/colors';
import { customModalStyle } from '../../../../constants/modal';
import { formatValue } from '../../../../utils/formatValue';
import settingsIcon from './../../../../assets/icons/settings-icon.svg';
import { useRemoveLiquidity } from '../../../../hooks/use-remove-liquidity';

type Props = {
    isOpen: boolean;
    isLoading: boolean;
    positions: IPositionDetails[];
    refreshPositions: () => void;
    closeModal: () => void;
};

ReactModal.setAppElement('#root');

export const RemoveLiquidityModal = ({
    isOpen,
    isLoading,
    positions,
    refreshPositions,
    closeModal,
}: Props) => {
    const { account, library } = useContext(WalletConnectContext);
    const [step, setStep] = useState(1);
    const [selectedPosition, setSelectedPosition] = useState<
        IPositionDetails | undefined
    >(undefined);
    const [inputValue, setInputValue] = useState(0);
    const [isLiquidityRemoving, setIsLiquidityRemoving] = useState(false);
    const [areSettingsOpen, setAreSettingsOpen] = useState(false);
    const [slippageTolerance, setSlippageTolerance] = useState(
        DEFAULT_SLIPPAGE_TOLERANCE,
    );
    const [transactionDeadline, setTransactionDeadline] = useState(
        DEFAULT_TRANSACTION_DEADLINE,
    );

    useEffect(() => {
        setStep(!!selectedPosition ? 2 : 1);
    }, [selectedPosition]);

    useEffect(() => {
        setSelectedPosition(undefined);
    }, [positions]);

    useEffect(() => {
        setDefaultSettings();
    }, [areSettingsOpen]);

    const setDefaultSettings = () => {
        setSlippageTolerance(DEFAULT_SLIPPAGE_TOLERANCE);
        setTransactionDeadline(DEFAULT_TRANSACTION_DEADLINE);
    };

    const onRemoveLiquidityClick = async () => {
        if (library && account && selectedPosition) {
            setIsLiquidityRemoving(true);
            await useRemoveLiquidity(
                library,
                slippageTolerance,
                transactionDeadline,
                account,
                selectedPosition,
                inputValue,
            );
            setInputValue(0);
            setIsLiquidityRemoving(false);
            refreshPositions();
            setStep(1);
        }
    };

    const onCloseClick = () => {
        setSelectedPosition(undefined);
        setStep(1);
        setInputValue(0);
        closeModal();
    };

    return (
        <ReactModal
            isOpen={isOpen}
            style={customModalStyle}
            contentLabel="Remove Liquidity Modal"
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
                                <div className="font-kanit-medium color-gray-gradient text-shadow text-xl tracking-[.12em] text-center mb-4">
                                    CHOOSE POSITION
                                </div>
                            ) : (
                                <div className="w-full flex items-center mb-4 justify-around">
                                    <div className="font-kanit-medium color-gray-gradient text-shadow text-xl tracking-[.12em] text-center">
                                        REMOVE LIQUIDITY
                                    </div>
                                    <img
                                        className="w-[1.5rem] h-[1.5rem] cursor-pointer"
                                        src={settingsIcon}
                                        alt="settings"
                                        onClick={() => {
                                            setAreSettingsOpen(
                                                !areSettingsOpen,
                                            );
                                        }}
                                    ></img>
                                </div>
                            )}
                            {areSettingsOpen && (
                                <Settings
                                    isRangeVisible={false}
                                    slippageTolerance={slippageTolerance}
                                    transactionDeadline={transactionDeadline}
                                    onSlippageToleranceChange={(event: any) => {
                                        setSlippageTolerance(
                                            event.target.value ||
                                                DEFAULT_SLIPPAGE_TOLERANCE,
                                        );
                                    }}
                                    onTransactionDeadlineChange={(
                                        event: any,
                                    ) => {
                                        setTransactionDeadline(
                                            event.target.value ||
                                                DEFAULT_TRANSACTION_DEADLINE,
                                        );
                                    }}
                                />
                            )}
                            <div className="flex flex-col min-w-[20vw]">
                                {step === 1 ? (
                                    <PositionsList
                                        positions={positions}
                                        onClick={(position) =>
                                            setSelectedPosition(position)
                                        }
                                    />
                                ) : (
                                    <>
                                        <div className="w-full flex mt-8 mb-10">
                                            <Slider
                                                onChange={(value) => {
                                                    setInputValue(
                                                        value as number,
                                                    );
                                                }}
                                                min={0}
                                                max={100}
                                                marks={{
                                                    0: '0%',
                                                    25: '25%',
                                                    50: '50%',
                                                    75: '75%',
                                                    100: '100%',
                                                }}
                                                defaultValue={inputValue}
                                                step={0.1}
                                                handleRender={(renderProps) => (
                                                    <div {...renderProps.props}>
                                                        <span className="font-kanit-medium whitespace-nowrap text-xs tracking-[.12em] absolute top-[-1.5rem] left-[-0.75rem]">
                                                            {inputValue} %
                                                        </span>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                        <div className="w-full flex justify-between">
                                            <span className="font-kanit-medium whitespace-nowrap text-xs tracking-[.12em]">
                                                {ASSET_LAKE.symbol}:{' '}
                                                {formatValue(
                                                    (selectedPosition!
                                                        .lakeAmount *
                                                        inputValue) /
                                                        100,
                                                    '',
                                                    2,
                                                )}
                                            </span>
                                            <span className="font-kanit-medium whitespace-nowrap text-xs tracking-[.12em]">
                                                {selectedPosition!.tokenSymbol}:{' '}
                                                {formatValue(
                                                    (selectedPosition!
                                                        .tokenAmount *
                                                        inputValue) /
                                                        100,
                                                    '',
                                                    2,
                                                )}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                            {step === 2 && (
                                <div className="flex flex-col items-center">
                                    <div className="mt-8">
                                        {isLiquidityRemoving ? (
                                            <ButtonWithSpinner
                                                size="medium"
                                                disabled={true}
                                            />
                                        ) : (
                                            <Button
                                                size="medium"
                                                disabled={inputValue === 0}
                                                text="REMOVE LIQUIDITY"
                                                onClick={onRemoveLiquidityClick}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </ReactModal>
    );
};
