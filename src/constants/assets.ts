import { IAsset } from '../interfaces/asset.interface';

export const ASSET_LAKE: IAsset = {
    name: 'Data Lake Token',
    symbol: 'LAKE',
    decimals: 18,
    image: 'https://data-lake.co/wp-content/uploads/2022/07/DL-Logo-Mark-Black.png',
};

export const ASSET_ETH: IAsset = {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
};

export const ASSET_DAI: IAsset = {
    name: 'DAI',
    symbol: 'DAI',
    decimals: 6,
};

export const ASSET_WETH: IAsset = {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
};

export const ASSETS: IAsset[] = [ASSET_LAKE, ASSET_ETH, ASSET_USDT, ASSET_WETH];
