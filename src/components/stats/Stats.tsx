import { useContext, useEffect, useState } from 'react';

import { ASSET_LAKE } from '../../constants/assets';
import { Button } from '../button/Button';
import CopyToClipboard from 'react-copy-to-clipboard';
import { GradientButtonWithIcon } from '../button/gradient/GradientButtonWithIcon';
import { JsonRpcProvider } from '@ethersproject/providers';
import { LakeStats } from '../../interfaces/lakeStat.interface';
import { REFRESH_STATS_INTERVAL } from '../../constants/commons';
import { StatElement } from './StatElement';
import { WalletConnectContext } from '../../context';
import { formatValue } from '../../utils/formatValue';
import metamaskIcon from './../../assets/icons/metamask-icon.svg';
import { useConfig } from '../../hooks/use-config';
import { useLakeStats } from '../../hooks/use-lake-stats';

const zeroStats = {
    marketCup: 0,
    pastMarketCup: 0,
    circulationSupply: 0,
    pastCirculationSupply: 0,
    lakePrice: 0,
    pastLakePrice: 0,
    consentsGathered: 0,
    pastConsentsGathered: 0,
};

export const Stats = () => {
    const [lakeStats, setLakeStats] = useState<LakeStats>(zeroStats);
    const { lakeAddress } = useConfig();
    const { library } = useContext(WalletConnectContext);

    useEffect(() => {
        const interval = setInterval(() => {
            if (library) {
                fetchData(library).catch(console.error);
            }
        }, REFRESH_STATS_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (library) {
            fetchData(library).catch(console.error);
        }
    }, [library]);

    const fetchData = async (library: JsonRpcProvider) => {
        setLakeStats(await useLakeStats(library));
    };

    const addToMetamask = async () => {
        try {
            const { ethereum } = window as any;
            await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: lakeAddress,
                        symbol: ASSET_LAKE.symbol,
                        decimals: ASSET_LAKE.decimals,
                        image: ASSET_LAKE.image,
                    },
                },
            });
        } catch (ex) {
            console.error(ex);
        }
    };
    return (
        <div className="w-full h-full flex flex-col items-center justify-between bg-black-800 rounded-[42px] inset-shadow px-8 py-6">
            <div className="font-kanit-medium color-gray-gradient text-shadow text-xl tracking-[.12em] pt-2 pb-4">
                $LAKE STATS
            </div>
            <div className="w-full h-full flex flex-col items-center justify-between">
                <StatElement
                    title={'MARKET CAP'}
                    currentValue={lakeStats.marketCup}
                    pastValue={lakeStats.pastMarketCup}
                    formattedValue={formatValue(lakeStats.marketCup, '$')}
                />
                <StatElement
                    title={'CIRCULATION SUPPLY'}
                    currentValue={lakeStats.circulationSupply}
                    pastValue={lakeStats.pastCirculationSupply}
                    formattedValue={formatValue(lakeStats.circulationSupply)}
                />
                <StatElement
                    title={'$LAKE PRICE'}
                    currentValue={lakeStats.lakePrice}
                    pastValue={lakeStats.pastLakePrice}
                    formattedValue={formatValue(lakeStats.lakePrice, '$', 4)}
                />
                <StatElement
                    title={'CONSENTS GATHERED'}
                    currentValue={lakeStats.consentsGathered}
                    pastValue={lakeStats.pastConsentsGathered}
                    formattedValue={formatValue(
                        lakeStats.consentsGathered,
                        '',
                        0,
                    )}
                />
            </div>
            <div className="w-full flex flex-col items-center justify-center px-4 pt-8">
                <div className="mb-5">
                    <GradientButtonWithIcon
                        size="medium"
                        disabled={false}
                        text="ADD TO METAMASK"
                        onClick={addToMetamask}
                    >
                        <img
                            src={metamaskIcon}
                            alt="metamask"
                            className="w-[2rem] h-[2rem]"
                        ></img>
                    </GradientButtonWithIcon>
                </div>

                <CopyToClipboard text={lakeAddress}>
                    <Button
                        size="medium"
                        disabled={false}
                        text={'COPY CONTRACT ADDRESS'}
                    ></Button>
                </CopyToClipboard>
            </div>
        </div>
    );
};
