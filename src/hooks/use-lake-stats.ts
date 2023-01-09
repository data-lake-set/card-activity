import { BLOCKS_PER_DAY } from '../constants/commons';
import { JsonRpcProvider } from '@ethersproject/providers';
import { useConfig } from './use-config';
import { useLakeCirculationSupply } from './use-lake-circulation-supply';
import { useLakePrice } from './use-lake-price';

export const useLakeStats = async (provider: JsonRpcProvider) => {
    const { poolDeploymentBlockNumber } = useConfig();
    const pastBlock = (await provider.getBlockNumber()) - BLOCKS_PER_DAY;
    const lakePrice = await useLakePrice();
    const pastLakePrice = await useLakePrice(
        pastBlock < poolDeploymentBlockNumber
            ? poolDeploymentBlockNumber
            : pastBlock,
    );
    const circulationSupply = await useLakeCirculationSupply();
    const pastCirculationSupply = await useLakeCirculationSupply(
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
