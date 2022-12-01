import { ASSET_ETH, ASSET_USDT } from '../../../constants/assets';

import ReactTooltip from 'react-tooltip';
import ethLogo from './../../../assets/icons/eth-logo.svg';
import { formatValue } from '../../../utils/formatValue';
import lakeLogo from './../../../assets/icons/lake-logo.svg';
import usdtLogo from './../../../assets/icons/usdt-logo.svg';

type Props = {
    balance: number;
    tokenSymbol: string;
    tokenPrice?: number;
    inputValue: number;
    isValueValid?: boolean;
    setMaxInputValue: () => void;
    onChange: (event: any) => void;
};

export const TokenInput = ({
    balance,
    tokenSymbol,
    tokenPrice,
    inputValue,
    isValueValid,
    setMaxInputValue,
    onChange,
}: Props) => {
    const onMaxClick = () => {
        setMaxInputValue();
    };
    return (
        <div className="w-full h-[7rem] bg-black-600 flex justify-between pl-8 pr-2 pt-2 my-4 box-shadow rounded-[20px]">
            <div className="w-1/4 flex flex-col justify-center items-center mr-4">
                <span className="text-sm tracking-[.1em] text-gray-300 mb-2 text-center">
                    {tokenSymbol}
                </span>
                <img
                    className="w-[2.5rem] h-[2.5rem]"
                    src={
                        tokenSymbol === ASSET_USDT.symbol
                            ? usdtLogo
                            : tokenSymbol === ASSET_ETH.symbol
                            ? ethLogo
                            : lakeLogo
                    }
                    alt="chart"
                ></img>
            </div>
            <div className="w-full flex flex-col items-end">
                <div className="flex items-center">
                    <button
                        className="border border-gray-500 rounded-[32px] px-2 ml-2 hover:scale-105 cursor-pointer transition-transform duration-300"
                        onClick={onMaxClick}
                        data-tip
                        data-for={tokenSymbol}
                    >
                        <ReactTooltip
                            id={tokenSymbol}
                            effect="solid"
                            backgroundColor="none"
                            className="!p-0"
                            place="left"
                        >
                            <div className="font-kanit-medium whitespace-nowrap text-xs tracking-[.12em]">
                                <span>{`BALANCE: ${formatValue(
                                    balance,
                                    tokenSymbol,
                                    4,
                                )}`}</span>
                            </div>
                        </ReactTooltip>
                        <span>MAX</span>
                    </button>
                </div>

                <div className="flex flex-col items-center mt-2 mr-4">
                    <div className="flex items-center">
                        <input
                            className="font-kanit-medium color-gradient-start text-2xl font-bold truncate text-end w-[7rem] mr-2"
                            value={inputValue}
                            onChange={onChange}
                        />
                        <span className="font-kanit-medium color-gradient-end text-2xl font-bold">
                            {tokenSymbol}
                        </span>
                    </div>

                    {tokenPrice && (
                        <span
                            className={`font-kanit-medium whitespace-nowrap text-xs tracking-[.12em] ${
                                !isValueValid && 'text-red-600'
                            }`}
                        >
                            = {formatValue(inputValue * tokenPrice, '$', 2)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
