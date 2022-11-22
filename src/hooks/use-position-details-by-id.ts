import { IPositionDetails } from '../interfaces/positionDetails.interface';
import { JsonRpcProvider } from '@ethersproject/providers';
import { isPositionActive } from '../utils/isPositionActive';
import { usePositionDetails } from './use-position-details';
import { useUniswapV3PosContract } from './use-uniswap-v3-pos-contract';

export const usePositionDetailsById = async (
    provider: JsonRpcProvider,
    positionId: number,
): Promise<IPositionDetails | undefined> => {
    try {
        const uniswapV3PosContract = useUniswapV3PosContract(provider);
        const position = await uniswapV3PosContract.callStatic.positions(
            positionId,
        );
        if (
            isPositionActive(
                position.token0,
                position.token1,
                position.liquidity,
            )
        ) {
            return await usePositionDetails(provider, positionId, position);
        }
    } catch (e) {
        console.error('Failed to get position details by id: ', e);
    }
};
