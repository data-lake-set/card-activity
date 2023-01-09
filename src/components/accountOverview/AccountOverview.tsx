import { useContext, useEffect, useState } from 'react';

import { ASSET_LAKE } from '../../constants/assets';
import { AccountMetric } from './AccountMetric';
import { ConnectWallet } from '../connectWallet/ConnectWallet';
import { IBeneficiaryOverview } from '../../interfaces/beneficiaryOverview.interface';
import { IVestingSchedule } from '../../interfaces/vestingSchedule.interface';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ProgressChart } from './progressChart/ProgressChart';
import { REFRESH_LAKE_PRICE_INTERVAL } from '../../constants/commons';
import { WalletConnectContext } from '../../context';
import dropIcon from '../../assets/icons/drop-icon.svg';
import { formatVestingScheduleData } from '../../utils/formatVestingScheduleData';
import lockClosedIcon from '../../assets/icons/lock-closed-icon.svg';
import lockOpenIcon from '../../assets/icons/lock-open-icon.svg';
import { parseBigNumber } from '../../utils/parseBigNumber';
import { useBeneficiaryOverview } from '../../hooks/use-beneficiary-overview';
import { useConfig } from '../../hooks/use-config';
import { useLakePrice } from '../../hooks/use-lake-price';
import { usePositions } from '../../hooks/use-positions';
import { useTgeTimestamp } from '../../hooks/use-tge-timestamp';
import { useTokenBalance } from '@usedapp/core';

export const AccountOverview = () => {
    const { account, library } = useContext(WalletConnectContext);
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
        updatePrice().catch(console.error);
        const interval = setInterval(() => {
            updatePrice().catch(console.error);
        }, REFRESH_LAKE_PRICE_INTERVAL);
        return () => clearInterval(interval);
    }, []);

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

    const updatePrice = async () => {
        setLakePrice(await useLakePrice());
    };

    return (
        <div className="w-full h-full bg-black-800 rounded-[42px] inset-shadow relative">
            <div
                className={`w-full h-full flex flex-col items-center px-16 py-10 ${
                    account ? '' : 'blur-sm pointer-events-none'
                }`}
            >
                <div className="w-full font-kanit-medium color-gray-gradient text-shadow text-3xl tracking-[.12em] mb-7">
                    YOUR ACCOUNT
                </div>
                <div className="w-full h-full flex items-center justify-center bg-black-600 rounded-[28px] box-shadow mb-5">
                    <div className="w-1/2 h-full mx-4 flex justify-center pl-2 pt-10">
                        <ProgressChart
                            unlocked={(totalUnlocked * 100) / totalAllocated}
                            locked={(totalLocked * 100) / totalAllocated}
                        />
                    </div>
                    <div className="w-1/2 h-full flex flex-col ml-3 mr-5 py-4 justify-between">
                        <AccountMetric
                            title={'LOCKED $LAKE'}
                            iconSrc={lockClosedIcon}
                            value={totalLocked}
                            usdValue={totalLocked * lakePrice}
                            showDecimals={true}
                            fontColor={'text-gray-500'}
                        />
                        <AccountMetric
                            title={'UNLOCKED $LAKE'}
                            iconSrc={lockOpenIcon}
                            value={totalUnlocked}
                            usdValue={totalUnlocked * lakePrice}
                            showDecimals={true}
                        />
                        <AccountMetric
                            title={'TOTAL $LAKE'}
                            iconSrc={lockOpenIcon}
                            value={totalLocked + totalUnlocked + lakeBalance}
                            usdValue={
                                (totalLocked + totalUnlocked + lakeBalance) *
                                lakePrice
                            }
                            showDecimals={true}
                        />
                        <AccountMetric
                            title={'ACTIVE LP POSITIONS'}
                            iconSrc={dropIcon}
                            value={positionsCount}
                            showDecimals={false}
                        />
                    </div>
                </div>
            </div>
            {!account && <ConnectWallet />}
        </div>
    );
};
