import { ASSET_LAKE, ASSET_USDT } from '../../../constants/assets';
import { useContext, useEffect, useState } from 'react';

import { Button } from '../../button/Button';
import { GradientButton } from '../../button/gradient/GradientButton';
import { JsonRpcProvider } from '@ethersproject/providers';
import { REFRESH_LAKE_PRICE_INTERVAL } from '../../../constants/commons';
import ReactModal from 'react-modal';
import { TokenInput } from './TokenInput';
import { WalletConnectContext } from '../../../context';
import cancelIcon from './../../../assets/icons/cancel-icon.svg';
import { parseBigNumber } from '../../../utils/parseBigNumber';
import { useConfig } from '../../../hooks/use-config';
import { useTokenBalance } from '@usedapp/core';
import { useUniswap } from '../../../hooks/use-uniswap';

type Props = {
    isOpen: boolean;
    closeModal: () => void;
};

const customStyles = {
    overlay: {
        background: 'rgba(0, 0, 0, 0.8)',
    },
    content: {
        background: 'transparent',
        border: 'none',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

ReactModal.setAppElement('#root');

export const ProvideLiquidityModal = ({ isOpen, closeModal }: Props) => {
    const { account, library } = useContext(WalletConnectContext);
    const { usdtAddress, lakeAddress } = useConfig();
    const [usdtBalance, setUsdtBalance] = useState(0);
    const [lakeBalance, setLakeBalance] = useState(0);
    const [usdtInputValue, setUsdtInputValue] = useState(0);
    const [lakeInputValue, setLakeInputValue] = useState(0);
    const [isUsdtValueValid, setIsUsdtValueValid] = useState(true);
    const [isLakeValueValid, setIsLakeValueValid] = useState(true);
    const usdtBalanceAsBigNumber = useTokenBalance(usdtAddress, account);
    const lakeBalanceAsBigNumber = useTokenBalance(lakeAddress, account);
    const { getLakePrice } = useUniswap();
    const usdtPrice = 1;
    const [lakePrice, setLakePrice] = useState(0);

    useEffect(() => {
        const fetchData = async (library: JsonRpcProvider) => {
            setLakePrice(await getLakePrice(library));
        };

        if (library) {
            fetchData(library).catch(console.error);
            setInterval(() => {
                fetchData(library).catch(console.error);
            }, REFRESH_LAKE_PRICE_INTERVAL);
        }
    }, [library]);

    useEffect(() => {
        setBalances();
    }, [usdtBalanceAsBigNumber, lakeBalanceAsBigNumber]);

    const setBalances = () => {
        setUsdtBalance(
            usdtBalanceAsBigNumber
                ? parseBigNumber(usdtBalanceAsBigNumber, ASSET_USDT.decimals)
                : 0,
        );
        setLakeBalance(
            lakeBalanceAsBigNumber
                ? parseBigNumber(lakeBalanceAsBigNumber, ASSET_LAKE.decimals)
                : 0,
        );
    };

    const onUsdtValueChange = (value: number) => {
        setUsdtInputValue(value);
        setIsUsdtValueValid(value <= usdtBalance);
        const lakeAmount = (value * usdtPrice) / lakePrice;
        setLakeInputValue(lakeAmount);
        setIsLakeValueValid(lakeAmount <= lakeBalance);
    };

    const onLakeValueChange = (value: number) => {
        setLakeInputValue(value);
        setIsLakeValueValid(value <= lakeBalance);
        const usdtAmount = (value * lakePrice) / usdtPrice;
        setUsdtInputValue(usdtAmount);
        setIsUsdtValueValid(usdtAmount <= usdtBalance);
    };

    const onApproveClick = () => {
        console.log('approve');
    };
    const onProvideLiquidityClick = () => {
        console.log('provide');
    };
    return (
        <ReactModal
            isOpen={isOpen}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div className="flex flex-col">
                <div className="flex justify-end items-center mb-6">
                    <span className="text-sm tracking-[.1em] mr-2 text-gray-500">
                        CLOSE
                    </span>
                    <div className="w-8 h-8 flex justify-center items-center rounded-[32px] border border-gray-500 p-1">
                        <img
                            className="cursor-pointer"
                            src={cancelIcon}
                            onClick={closeModal}
                            alt="copy"
                        ></img>
                    </div>
                </div>
                <div className="flex flex-col rounded-[32px] border border-gray-500 p-8 bg-black-800">
                    <div className="font-kanit-medium color-gray-gradient text-shadow text-xl tracking-[.12em] text-center mb-4">
                        PROVIDE LIQUIDITY
                    </div>
                    <div className="flex flex-col min-w-[20vw]">
                        <TokenInput
                            tokenSymbol="USDT"
                            tokenPrice={usdtPrice}
                            inputValue={usdtInputValue}
                            isValueValid={isUsdtValueValid}
                            setMaxInputValue={() =>
                                onUsdtValueChange(usdtBalance)
                            }
                            onChange={(event: any) =>
                                onUsdtValueChange(event.target.value || 0)
                            }
                        />
                        <TokenInput
                            tokenSymbol="LAKE"
                            tokenPrice={lakePrice}
                            inputValue={lakeInputValue}
                            isValueValid={isLakeValueValid}
                            setMaxInputValue={() =>
                                onLakeValueChange(lakeBalance)
                            }
                            onChange={(event: any) =>
                                onLakeValueChange(event.target.value || 0)
                            }
                        />
                    </div>
                    <div className="flex flex-col mt-8 items-center">
                        <GradientButton
                            size="medium"
                            disabled={false}
                            text="APPROVE LAKE"
                            onClick={onApproveClick}
                        />
                        <div className="mt-6 mb-2">
                            <Button
                                size="medium"
                                disabled={false}
                                text="PROVIDE LIQUIDITY"
                                onClick={onProvideLiquidityClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
};
