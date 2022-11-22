import { IPositionDetails } from '../interfaces/positionDetails.interface';
import { JsonRpcProvider } from '@ethersproject/providers';
import { parseBigNumber } from '../utils/parseBigNumber';
import { usePositionDetailsById } from './use-position-details-by-id';
import { useUniswapV3PosContract } from './use-uniswap-v3-pos-contract';

export const usePositions = async (
    provider: JsonRpcProvider,
    account: string,
): Promise<IPositionDetails[]> => {
    const positions: IPositionDetails[] = [];
    try {
        const uniswapV3PosContract = useUniswapV3PosContract(provider);
        const balance = await uniswapV3PosContract.callStatic.balanceOf(
            account,
        );
        if (balance > 0) {
            for (let i = 0; i < balance; i++) {
                const positionId = parseBigNumber(
                    await uniswapV3PosContract.callStatic.tokenOfOwnerByIndex(
                        account,
                        i,
                    ),
                    0,
                );
                const posDetails = await usePositionDetailsById(
                    provider,
                    positionId,
                );
                if (posDetails) {
                    positions.push(posDetails);
                }
            }
        }
    } catch (e) {
        console.error('Failed to get positions: ', e);
    }
    return positions;
};
