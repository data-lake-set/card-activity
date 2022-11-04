import { networks } from '../constants/networks';

type DappConfig = {
    readOnlyChainId: number;
    readOnlyUrls: {
        [key: number]: string;
    };
};

type SupportedChain = 'mainnet' | 'goerli';

const chain: SupportedChain =
    process.env.REACT_APP_CHAIN_NAME === 'goerli' ? 'goerli' : 'mainnet';

export const useConfig = () => {
    const getDappConfig = (): DappConfig => {
        return {
            readOnlyChainId: networks[chain].chainId,
            readOnlyUrls: {
                [networks[chain].chainId]: networks[chain].rpcUrl,
            },
        };
    };
    return {
        ...networks[chain],
        lakeAddress: process.env.REACT_APP_LAKE_ADDRESS || '',
        vestingScheduleAddress:
            process.env.REACT_APP_VESTING_SCHEDULE_ADDRESS || '',
        usdtLakePoolAddress: process.env.REACT_APP_USDT_LAKE_POOL_ADDRESS || '',
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
        lpTokenAddress: process.env.REACT_APP_LP_TOKEN_ADDRESS || '',
        getDappConfig,
    };
};
