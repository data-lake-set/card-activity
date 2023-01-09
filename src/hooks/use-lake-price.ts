import axios from 'axios';
import { useConfig } from './use-config';

export const useLakePrice = async (blockTag?: number): Promise<number> => {
    try {
        const { lakeApiUrl } = useConfig();
        const instance = axios.create({
            baseURL: lakeApiUrl,
        });
        const resp = await instance.get(
            `/price/lake/${blockTag ? blockTag : ''}`,
        );
        return resp.data.lakePrice;
    } catch (e) {
        console.error('Failed to get LAKE price: ', e);
        return 0;
    }
};
