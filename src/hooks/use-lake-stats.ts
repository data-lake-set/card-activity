import { BLOCKS_PER_DAY } from '../constants/commons';
import { JsonRpcProvider } from '@ethersproject/providers';
import { useConfig } from './use-config';
import { useLakeCirculationSupply } from './use-lake-circulation-supply';
import { useLakeUsdtPrice } from './use-lake-usdt-price';

export const useLakeStats = async (provider: JsonRpcProvider) => {
    const { poolDeploymentBlockNumber } = useConfig();
    const pastBlock = (await provider.getBlockNumber()) - BLOCKS_PER_DAY;
    const lakePrice = await useLakeUsdtPrice(provider);
    const pastLakePrice = await useLakeUsdtPrice(
        provider,
        pastBlock < poolDeploymentBlockNumber
            ? poolDeploymentBlockNumber
            : pastBlock,
    );
    const circulationSupply = await useLakeCirculationSupply(provider);
    const pastCirculationSupply = await useLakeCirculationSupply(
        provider,
        pastBlock < poolDeploymentBlockNumber
            ? poolDeploymentBlockNumber
            : pastBlock,
    );
    return {
        marketCup: circulationSupply * lakePrice,
        pastMarketCup: pastCirculationSupply * pastLakePrice,
        circulationSupply,
        pastCirculationSupply,
        lakePrice,
        pastLakePrice,
        consentsGathered: 0,
        pastConsentsGathered: 0,
    };
};
