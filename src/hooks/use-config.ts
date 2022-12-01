import { IPool } from '../interfaces/pool.interface';
import { networks } from '../constants/networks';

type DappConfig = {
    readOnlyChainId: number;
    readOnlyUrls: {
        [key: number]: string;
    };
    multicallVersion: MulticallVersion;
};
type MulticallVersion = 1 | 2 | undefined;
type SupportedChain = 'mainnet' | 'goerli';

const chain: SupportedChain =
    process.env.REACT_APP_CHAIN_NAME === 'goerli' ? 'goerli' : 'mainnet';

const getPools = (): IPool[] => {
    const pools = (process.env.REACT_APP_POOLS || '').split(',');
    return pools.map((pool) => {
        const token0Symbol = pool.split('-')[0];
        const token1Symbol = pool.split('-')[1];
        return {
            poolAddress:
                process.env[
                    `REACT_APP_${token0Symbol}_${token1Symbol}_POOL_ADDRESS`
                ] || '',
            token0: {
                address: process.env[`REACT_APP_${token0Symbol}_ADDRESS`] || '',
                symbol: token0Symbol,
            },
            token1: {
                address: process.env[`REACT_APP_${token1Symbol}_ADDRESS`] || '',
                symbol: token1Symbol,
            },
        };
    });
};

const pools = getPools();

export const useConfig = () => {
    const getDappConfig = (): DappConfig => ({
        readOnlyChainId: networks[chain].chainId,
        readOnlyUrls: {
            [networks[chain].chainId]: networks[chain].rpcUrl,
        },
        multicallVersion: 2,
    });

    const getPool = (token0: string, token1: string): IPool | undefined =>
        pools.find(
            (el) =>
                el.token0.address.toLowerCase() === token0.toLowerCase() &&
                el.token1.address.toLowerCase() === token1.toLowerCase(),
        );

    return {
        ...networks[chain],
        lakeAddress: process.env.REACT_APP_LAKE_ADDRESS || '',
        ethAddress: process.env.REACT_APP_ETH_ADDRESS || '',
        vestingScheduleAddress:
            process.env.REACT_APP_VESTING_SCHEDULE_ADDRESS || '',
        usdtLakePoolAddress: process.env.REACT_APP_USDT_LAKE_POOL_ADDRESS || '',
        poolDeploymentBlockNumber: Number(
            process.env.REACT_APP_POOL_DEPLOYMENT_BLOCK_NUMBER,
        ),
        usdtAddress: process.env.REACT_APP_USDT_ADDRESS || '',
        etherscanBaseURL: `https://api${
            chain === 'goerli' ? '-goerli' : ''
        }.etherscan.io/api`,
        swapConvenienceFee:
            100 *
            (Number(process.env.REACT_APP_SWAP_CONVENIENCE_FEE) > 1
                ? 1
                : Number(process.env.REACT_APP_SWAP_CONVENIENCE_FEE)),
        swapConvenienceFeeRecipient:
            process.env.REACT_APP_SWAP_CONVENIENCE_FEE_RECIPIENT || '',
        nonfungiblePositionManagerAddress:
            process.env.REACT_APP_NONFUNGIBLE_POSITION_MANAGER_ADDRESSES || '',
        pools,
        getPool,
        getDappConfig,
    };
};
