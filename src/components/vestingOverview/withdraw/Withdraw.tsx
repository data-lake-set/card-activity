import {
    FAILED_TRANSACTION_DELAY,
    SUCCESSFUL_TRANSACTION_DELAY,
} from '../../../constants/commons';
import { Status, TransactionStatus } from '../../TransactionStatus';
import { useContext, useEffect, useState } from 'react';

import { Button } from '../../button/Button';
import { ClipLoader } from 'react-spinners';
import { GradientButton } from '../../button/gradient/GradientButton';
import { GradientButtonWithIcon } from '../../button/gradient/GradientButtonWithIcon';
import { GradientButtonWithSpinner } from '../../button/gradient/GradientButtonWithSpinner';
import { IVestingSchedule } from '../../../interfaces/vestingSchedule.interface';
import { WalletConnectContext } from '../../../context';
import { colors } from '../../../constants/colors';
import { formatValue } from '../../../utils/formatValue';
import keyIcon from './../../../assets/icons/key-icon.svg';
import logo from '../../../assets/icons/lake-logo.svg';
import styled from 'styled-components';
import { useClaimTokensTransaction } from '../../../hooks/use-claim-tokens-transaction';

interface Props {
    data: IVestingSchedule[];
    isLoading: boolean;
    refresh: () => void;
}

export const Withdraw = ({ data, isLoading, refresh }: Props) => {
    const { library, account, activateProvider } =
        useContext(WalletConnectContext);
    const [isClaiming, setIsClaiming] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState<
        Status | undefined
    >(undefined);
    const [transactionHash, setTransactionHash] = useState('');
    const [totalLocked, setTotalLocked] = useState(0);
    const [totalUnlocked, setTotalUnlocked] = useState(0);

    useEffect(() => {
        let locked = 0;
        let unlocked = 0;
        data.map((el) => {
            locked = locked + el.allocatedAmount - el.unlockedAmount;
            unlocked = unlocked + el.unlockedAmount - el.withdrawnAmount;
        });
        setTotalLocked(locked);
        setTotalUnlocked(unlocked);
    }, [data]);

    const onWithdrawClick = async () => {
        if (library && account) {
            setIsClaiming(true);
            setTransactionStatus('PENDING');
            const tx = await useClaimTokensTransaction(
                library.getSigner(account),
            );
            if (tx) {
                setTransactionHash(tx.hash);
                const receipt = await tx.wait();
                setTransactionStatus(
                    receipt.status === 1 ? 'SUCCESSFUL' : 'FAILED',
                );
                setTimeout(
                    () => {
                        setTransactionStatus(undefined);
                    },
                    receipt.status === 1
                        ? SUCCESSFUL_TRANSACTION_DELAY
                        : FAILED_TRANSACTION_DELAY,
                );
            } else {
                setTransactionStatus(undefined);
            }
            setIsClaiming(false);
            refresh();
        }
    };

    const activate = async () => {
        await activateProvider();
    };

    return (
        <>
            <div className="w-full bg-black-700 rounded-[30px] inset-shadow relative">
                <div
                    className={`w-full flex flex-col items-center justify-between px-8 py-6 overflow-auto ${
                        account ? '' : 'blur-sm'
                    }`}
                >
                    <div className="w-full flex justify-center font-kanit-medium color-gray-gradient text-shadow text-lg tracking-[.12em]">
                        WITHDRAW
                    </div>
                    {isLoading ? (
                        <div className="mt-20 mb-36">
                            <ClipLoader color={colors.gray['300']} loading />
                        </div>
                    ) : (
                        <>
                            <div className="w-full flex flex-col items-center my-6">
                                <div className="flex flex-col text-gray-600">
                                    <div className="flex items-end">
                                        <span
                                            className={`${
                                                totalLocked >= 10 ** 6
                                                    ? 'text-2xl'
                                                    : 'text-4xl'
                                            } tracking-[.1em]`}
                                        >
                                            {formatValue(
                                                Math.trunc(totalLocked),
                                                '',
                                                0,
                                            )}
                                        </span>
                                        <span className="tracking-[.1em]">
                                            {Math.abs(
                                                totalLocked -
                                                    Math.trunc(totalLocked),
                                            )
                                                .toFixed(2)
                                                .slice(1)}
                                        </span>
                                    </div>
                                    <span className="text-sm tracking-[.1em] mt-1">
                                        TOTAL LOCKED
                                    </span>
                                </div>
                                <Line />
                                <div className="flex items-center justify-center">
                                    <img
                                        className="w-[3rem] h-[3rem] mr-2"
                                        src={logo}
                                        alt="logo"
                                    ></img>
                                    <div className="flex flex-col">
                                        <div className="flex items-end">
                                            <span
                                                className={`${
                                                    totalLocked >= 10 ** 6
                                                        ? 'text-2xl'
                                                        : 'text-4xl'
                                                } tracking-[.1em] color-gradient`}
                                            >
                                                {formatValue(
                                                    Math.trunc(totalUnlocked),
                                                    '',
                                                    0,
                                                )}
                                            </span>
                                            <span className="tracking-[.1em] color-gradient">
                                                {Math.abs(
                                                    totalUnlocked -
                                                        Math.trunc(
                                                            totalUnlocked,
                                                        ),
                                                )
                                                    .toFixed(2)
                                                    .slice(1)}
                                            </span>
                                        </div>
                                        <span className="text-sm tracking-[.1em] text-gray-600">
                                            TOTAL UNLOCKED
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex flex-col items-center justify-center my-6">
                                {isClaiming ? (
                                    <GradientButtonWithSpinner
                                        size="small"
                                        disabled={true}
                                    />
                                ) : (
                                    <>
                                        {totalUnlocked === 0 ? (
                                            <Button
                                                size="small"
                                                disabled={true}
                                                text="NOTHING TO WITHDRAW"
                                            />
                                        ) : (
                                            <GradientButton
                                                size="small"
                                                disabled={false}
                                                text={`WITHDRAW ${formatValue(
                                                    totalUnlocked,
                                                    '',
                                                    0,
                                                )} LAKE`}
                                                onClick={onWithdrawClick}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
                {!account && (
                    <div className="absolute top-[50%] left-[6%]">
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
            {transactionStatus && (
                <div className="w-full bg-black-700 rounded-[30px] inset-shadow mt-6 flex flex-col">
                    <TransactionStatus
                        status={transactionStatus}
                        transactionHash={transactionHash}
                    />
                </div>
            )}
        </>
    );
};

const Line = styled.div`
    background: ${colors.gray['700']};
    width: 100%;
    height: 0.5px;
    margin: 1.5rem 0;
`;
