import { Contract } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { uniswapV3PoolAbi } from '../abis/uniswapV3Pool';

export const usePoolContract = (provider: JsonRpcProvider, address: string) => {
    return new Contract(address, uniswapV3PoolAbi, provider);
};
