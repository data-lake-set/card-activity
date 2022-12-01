import { JsonRpcProvider } from '@ethersproject/providers';
import { useConfig } from './use-config';
import { useLakeEthPrice } from './use-lake-eth-price';
import { useTokenUsdtPrice } from './use-token-usdt-price';

export const useLakeUsdtPrice = async (
    provider: JsonRpcProvider,
    blockTag?: number,
): Promise<number> => {
    const { ethAddress } = useConfig();
    const lakeEthPrice = await useLakeEthPrice(provider, blockTag);
    const ethUsdPrice = await useTokenUsdtPrice(provider, ethAddress, blockTag);
    return lakeEthPrice * ethUsdPrice;
};
