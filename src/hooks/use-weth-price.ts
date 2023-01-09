import axios from 'axios';
import { useConfig } from './use-config';

export const useWethPrice = async (blockTag?: number): Promise<number> => {
    try {
        const { lakeApiUrl } = useConfig();
        const instance = axios.create({
            baseURL: lakeApiUrl,
        });
        const resp = await instance.get(
            `/price/weth/${blockTag ? blockTag : ''}`,
        );
        return resp.data.wethPrice;
    } catch (e) {
        console.error('Failed to get WETH price: ', e);
        return 0;
    }
};
