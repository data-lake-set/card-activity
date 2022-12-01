interface IPoolToken {
    address: string;
    symbol: string;
}

export interface IPool {
    poolAddress: string;
    token0: IPoolToken;
    token1: IPoolToken;
}
