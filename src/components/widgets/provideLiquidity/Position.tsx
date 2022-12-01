import { ASSET_LAKE } from '../../../constants/assets';
import { GradientBorder } from '../../GradientBorder';
import { IPositionDetails } from '../../../interfaces/positionDetails.interface';
import ethLogo from '../../../assets/icons/eth-logo.svg';
import { formatValue } from '../../../utils/formatValue';
import lakeLogo from '../../../assets/icons/lake-logo.svg';
import usdtLogo from '../../../assets/icons/usdt-logo.svg';
import { useConfig } from '../../../hooks/use-config';

type Props = {
    position: IPositionDetails;
    disabled?: boolean;
    onClick?: () => void;
};

export const Position = ({ position, disabled, onClick }: Props) => {
    const { ethAddress } = useConfig();
    return (
        <button
            className="hover:scale-105 cursor-pointer transition-transform duration-300"
            disabled={disabled}
            onClick={onClick}
        >
            <GradientBorder className="min-w-[18rem] h-[5.5rem] p-px flex justify-center items-center rounded-[32px]">
                <div className="w-full h-full flex justify-center items-center rounded-[32px] bg-black-500 px-4">
                    <div className="w-full flex justify-between items-center">
                        <div className="flex flex-col">
                            <div className="flex items-center justify-center">
                                <img
                                    className="w-[2rem] h-[3rem]"
                                    src={
                                        position.tokenAddress === ethAddress
                                            ? ethLogo
                                            : usdtLogo
                                    }
                                    alt="logo"
                                ></img>
                                <img
                                    className="w-[2rem] h-[3rem]"
                                    src={lakeLogo}
                                    alt="logo"
                                ></img>
                            </div>
                            <span className="color-gradient-light tracking-[.1em] text-xs text-start whitespace-nowrap">
                                ID: {position.positionId}
                            </span>
                        </div>
                        <div className="flex flex-col color-gradient-light tracking-[.1em] text-base text-start whitespace-nowrap font-kanit-medium font-normal mx-6">
                            <span>
                                {ASSET_LAKE.symbol}:{' '}
                                {formatValue(position.lakeAmount, '', 2)}
                            </span>
                            <span>
                                {position.tokenSymbol}:{' '}
                                {formatValue(position.tokenAmount, '', 2)}
                            </span>
                        </div>
                        <div className="w-full flex flex-col color-gradient-light tracking-[.1em] text-xs">
                            <span>PRICE RANGE</span>
                            <span className="font-kanit-medium font-normal text-sm">
                                {position.lowerPrice} - {position.upperPrice}
                            </span>
                            <span>
                                {ASSET_LAKE.symbol} PER {position.tokenSymbol}
                            </span>
                        </div>
                    </div>
                </div>
            </GradientBorder>
        </button>
    );
};
