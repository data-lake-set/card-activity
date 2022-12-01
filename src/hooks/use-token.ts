import { ASSETS } from '../constants/assets';
import { Token } from '@uniswap/sdk-core';
import { useConfig } from './use-config';

export const useToken = (address: string, symbol: string) => {
    const { chainId } = useConfig();
    const asset = ASSETS.find((el) => el.symbol === symbol)!;
    return new Token(
        chainId,
        address,
        asset.decimals,
        asset.symbol,
        asset.name,
    );
};
