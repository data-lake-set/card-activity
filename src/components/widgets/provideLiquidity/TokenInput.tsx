import { colors } from '../../../constants/colors';
import { formatValue } from '../../../utils/formatValue';
import lakeLogo from './../../../assets/icons/lake-logo.svg';
import styled from 'styled-components';
import usdtLogo from './../../../assets/icons/usdt-logo.svg';

type Props = {
    tokenSymbol: string;
    tokenPrice: number;
    inputValue: number;
    isValueValid: boolean;
    setMaxInputValue: () => void;
    onChange: (event: any) => void;
};

export const TokenInput = ({
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
        <InputContainer className="w-full h-[7rem] flex justify-between pl-8 pr-2 pt-2 my-4">
            <div className="w-1/4 flex flex-col justify-center items-center mr-4">
                <span className="text-sm tracking-[.1em] text-gray-300 mb-2">
                    {tokenSymbol}
                </span>
                <img
                    className="w-[2.5rem] h-[2.5rem]"
                    src={tokenSymbol === 'USDT' ? usdtLogo : lakeLogo}
                    alt="chart"
                ></img>
            </div>
            <div className="w-full flex flex-col items-end">
                <button
                    className="border border-gray-500 rounded-[32px] px-2 "
                    onClick={onMaxClick}
                >
                    <span>MAX</span>
                </button>
                <div className="flex flex-col items-center mt-2 mr-4">
                    <div className="flex items-center">
                        <input
                            className="font-kanit-medium color-gradient text-2xl font-bold truncate text-end w-[7rem] mr-2"
                            value={inputValue}
                            onChange={onChange}
                        />
                        <span className="font-kanit-medium color-gradient text-2xl font-bold">
                            {tokenSymbol}
                        </span>
                    </div>

                    <span
                        className={`font-kanit-medium whitespace-nowrap text-xs tracking-[.12em] ${
                            !isValueValid && 'text-red-600'
                        }`}
                    >
                        = {formatValue(inputValue * tokenPrice, '$', 0)}
                    </span>
                </div>
            </div>
        </InputContainer>
    );
};

const InputContainer = styled.div`
    box-shadow: inset 1px 1px 1px rgba(68, 68, 68, 0.05),
        inset -1px -1px 4px rgba(134, 134, 134, 0.12);
    border-radius: 20px;
    background: ${colors.black[600]};
`;
