import { useContext, useEffect, useState } from 'react';

import { ASSET_LAKE } from '../../constants/assets';
import { AccountMetric } from './AccountMetric';
import { GradientButtonWithIcon } from '../button/gradient/GradientButtonWithIcon';
import { IBeneficiaryOverview } from '../../interfaces/beneficiaryOverview.interface';
import { IVestingSchedule } from '../../interfaces/vestingSchedule.interface';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ProgressChart } from './progressChart/ProgressChart';
import { REFRESH_LAKE_PRICE_INTERVAL } from '../../constants/commons';
import { WalletConnectContext } from '../../context';
import { colors } from '../../constants/colors';
import dropIcon from '../../assets/icons/drop-icon.svg';
import { formatVestingScheduleData } from '../../utils/formatVestingScheduleData';
import keyIcon from '../../assets/icons/key-icon.svg';
import lockClosedIcon from '../../assets/icons/lock-closed-icon.svg';
import lockOpenIcon from '../../assets/icons/lock-open-icon.svg';
import { parseBigNumber } from '../../utils/parseBigNumber';
import styled from 'styled-components';
import { useBeneficiaryOverview } from '../../hooks/use-beneficiary-overview';
import { useConfig } from '../../hooks/use-config';
import { useLakePrice } from '../../hooks/use-lake-price';
import { usePositions } from '../../hooks/use-positions';
import { useTgeTimestamp } from '../../hooks/use-tge-timestamp';
import { useTokenBalance } from '@usedapp/core';

export const AccountOverview = () => {
    const { account, library, activateProvider } =
        useContext(WalletConnectContext);
    const { lakeAddress } = useConfig();
    const [lakeBalance, setLakeBalance] = useState(0);
    const [lakePrice, setLakePrice] = useState(0);
    const [totalLocked, setTotalLocked] = useState(0);
    const [totalUnlocked, setTotalUnlocked] = useState(0);
    const [totalAllocated, setTotalAllocated] = useState(0);
    const [positionsCount, setPositionsCount] = useState(0);
    const [vestingSchedules, setVestingSchedules] = useState<
        IVestingSchedule[]
    >([]);
    const lakeBalanceAsBigNumber = useTokenBalance(lakeAddress, account);

    useEffect(() => {
        const fetchData = async (library: JsonRpcProvider) => {
            setLakePrice(await useLakePrice(library));
        };

        if (library) {
            fetchData(library).catch(console.error);
            setInterval(() => {
                fetchData(library).catch(console.error);
            }, REFRESH_LAKE_PRICE_INTERVAL);
        }
    }, [library]);

    useEffect(() => {
        setLakeBalance(
            lakeBalanceAsBigNumber
                ? parseBigNumber(lakeBalanceAsBigNumber, ASSET_LAKE.decimals)
                : 0,
        );
    }, [lakeBalanceAsBigNumber]);

    useEffect(() => {
        const fetchData = async (library: JsonRpcProvider, account: string) => {
            setPositionsCount((await usePositions(library, account)).length);
        };

        if (library && account) {
            fetchData(library, account).catch(console.error);
        }
    }, [library, account]);

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
        };

        if (library && account) {
            fetchData(library, account).catch(console.error);
        }
    }, [library, account]);

    useEffect(() => {
        let locked = 0;
        let unlocked = 0;
        let allocated = 0;
        vestingSchedules.map((el) => {
            locked = locked + el.allocatedAmount - el.unlockedAmount;
            unlocked = unlocked + el.unlockedAmount - el.withdrawnAmount;
            allocated = allocated + el.allocatedAmount;
        });
        setTotalLocked(locked);
        setTotalUnlocked(unlocked);
        setTotalAllocated(allocated);
    }, [vestingSchedules]);

    const activate = async () => {
        await activateProvider();
    };

    return (
        <div className="w-full h-full bg-black-800 rounded-[30px] inset-shadow relative">
            <div
                className={`w-full h-full flex flex-col items-center px-16 py-8 ${
                    account ? '' : 'blur-sm'
                }`}
            >
                <div className="w-full font-kanit-medium color-gray-gradient text-shadow text-3xl tracking-[.12em] mb-8">
                    YOUR ACCOUNT
                </div>
                <StatContainer>
                    <div className="w-1/2 h-full mx-4 flex justify-center pl-2 pt-10">
                        <ProgressChart
                            unlocked={(totalUnlocked * 100) / totalAllocated}
                            locked={(totalLocked * 100) / totalAllocated}
                        />
                    </div>
                    <div className="w-1/2 h-full flex flex-col mx-4 py-4 justify-between">
                        <AccountMetric
                            title={'LOCKED $LAKE'}
                            icon={
                                <img
                                    className="w-[3.5rem] h-[3.5rem]"
                                    src={lockClosedIcon}
                                    alt="icon"
                                ></img>
                            }
                            value={totalLocked}
                            usdValue={totalLocked * lakePrice}
                            showDecimals={true}
                        />
                        <AccountMetric
                            title={'UNLOCKED $LAKE'}
                            icon={
                                <img
                                    className="w-[3.5rem] h-[3.5rem]"
                                    src={lockOpenIcon}
                                    alt="icon"
                                ></img>
                            }
                            value={totalUnlocked}
                            usdValue={totalUnlocked * lakePrice}
                            showDecimals={true}
                        />
                        <AccountMetric
                            title={'TOTAL $LAKE'}
                            icon={
                                <img
                                    className="w-[3.5rem] h-[3.5rem]"
                                    src={lockOpenIcon}
                                    alt="icon"
                                ></img>
                            }
                            value={totalLocked + totalUnlocked + lakeBalance}
                            usdValue={
                                (totalLocked + totalUnlocked + lakeBalance) *
                                lakePrice
                            }
                            showDecimals={true}
                        />
                        <AccountMetric
                            title={'ACTIVE LP POSITIONS'}
                            icon={
                                <img
                                    className="w-[3.5rem] h-[3.5rem]"
                                    src={dropIcon}
                                    alt="icon"
                                ></img>
                            }
                            value={positionsCount}
                            showDecimals={false}
                        />
                    </div>
                </StatContainer>
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

const StatContainer = styled.div`
    box-shadow: inset 1px 1px 1px rgba(68, 68, 68, 0.05),
        inset -1px -1px 4px rgba(134, 134, 134, 0.12);
    border-radius: 20px;
    background: ${colors.black[600]};
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;
