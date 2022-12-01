import { useConfig } from '../hooks/use-config';

export const isPositionActive = (
    tokenA: string,
    tokenB: string,
    liquidity: number,
) => {
    const { lakeAddress, getPool } = useConfig();
    return (
        !!getPool(tokenA, tokenB) &&
        (tokenA === lakeAddress || tokenB === lakeAddress) &&
        liquidity > 0
    );
};
