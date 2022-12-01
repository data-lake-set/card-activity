import { ASSETS, ASSET_LAKE } from '../../../../../constants/assets';
import {
    DEFAULT_SLIPPAGE_TOLERANCE,
    DEFAULT_TRANSACTION_DEADLINE,
    MAX_TICK,
    TICKS_RANGE,
} from '../../../../../constants/commons';
import {
    Immutables,
    getPoolImmutables,
    getPoolState,
} from '../../../../../hooks/use-uniswap-pool';
import { useContext, useEffect, useState } from 'react';
import { useTokenAllowance, useTokenBalance } from '@usedapp/core';

import { Button } from '../../../../button/Button';
import { ButtonWithSpinner } from '../../../../button/ButtonWithSpinner';
import { Contract } from 'ethers';
import { ERC20Abi } from '../../../../../abis/ERC20';
import { GradientButton } from '../../../../button/gradient/GradientButton';
import { GradientButtonWithSpinner } from '../../../../button/gradient/GradientButtonWithSpinner';
import { IPool } from '../../../../../interfaces/pool.interface';
import { IPositionDetails } from '../../../../../interfaces/positionDetails.interface';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Settings } from '../Settings';
import { TokenInput } from '../../TokenInput';
import { WalletConnectContext } from '../../../../../context';
import { nearestUsableTick } from '@uniswap/v3-sdk';
import { parseBigNumber } from '../../../../../utils/parseBigNumber';
import { parseUnits } from 'ethers/lib/utils';
import settingsIcon from './../../../../../assets/icons/settings-icon.svg';
import { useConfig } from '../../../../../hooks/use-config';
import { useLakeUsdtPrice } from '../../../../../hooks/use-lake-usdt-price';
import { usePoolContract } from '../../../../../hooks/use-pool-contract';
import { useProvideLiquidity } from '../../../../../hooks/use-provide-liquidity';
import { useTokenUsdtPrice } from '../../../../../hooks/use-token-usdt-price';

type Props = {
    pool: IPool;
    lakeBalance: number;
    selectedPosition: IPositionDetails | undefined;
    refreshPositions: () => void;
};

export const SecondStep = ({
    pool,
    lakeBalance,
    selectedPosition,
    refreshPositions,
}: Props) => {
    const { account, library } = useContext(WalletConnectContext);
    const {
        lakeAddress,
        ethAddress,
        usdtAddress,
        nonfungiblePositionManagerAddress,
    } = useConfig();
    const [tokenAddress, setTokenAddress] = useState<string>(ethAddress);
    const [tokenDecimals, setTokenDecimals] = useState(0);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [tokenPrice, setTokenPrice] = useState(0);
    const [lakePrice, setLakePrice] = useState(0);
    const [areSettingsOpen, setAreSettingsOpen] = useState(false);
    const [slippageTolerance, setSlippageTolerance] = useState(
        DEFAULT_SLIPPAGE_TOLERANCE,
    );
    const [transactionDeadline, setTransactionDeadline] = useState(
        DEFAULT_TRANSACTION_DEADLINE,
    );
    const [tickLower, setTickLower] = useState(-MAX_TICK);
    const [tickUpper, setTickUpper] = useState(MAX_TICK);
    const [immutables, setImmutables] = useState<Immutables | undefined>(
        undefined,
    );
    const [nearestTick, setNearestTick] = useState(0);
    const [tokenInputValue, setTokenInputValue] = useState(0);
    const [lakeInputValue, setLakeInputValue] = useState(0);
    const [isTokenValueValid, setIsTokenValueValid] = useState(true);
    const [isLakeValueValid, setIsLakeValueValid] = useState(true);
    const [isTokenApproved, setIsTokenApproved] = useState(false);
    const [isLakeApproved, setIsLakeApproved] = useState(false);
    const [isTokenApproving, setIsTokenApproving] = useState(false);
    const [isLakeApproving, setIsLakeApproving] = useState(false);
    const [isLiquidityProviding, setIsLiquidityProviding] = useState(false);
    const tokenBalanceAsBigNumber = useTokenBalance(tokenAddress, account);
    const tokenAllowance = useTokenAllowance(
        tokenAddress,
        account,
        nonfungiblePositionManagerAddress,
    );
    const lakeAllowance = useTokenAllowance(
        lakeAddress,
        account,
        nonfungiblePositionManagerAddress,
    );

    useEffect(() => {
        const fetchData = async (library: JsonRpcProvider) => {
            if (
                !!selectedPosition &&
                selectedPosition.tokenAddress !== usdtAddress
            ) {
                setTokenPrice(await useTokenUsdtPrice(library, tokenAddress));
            } else {
                setTokenPrice(1);
            }
        };
        if (library) {
            fetchData(library).catch(console.error);
        }
    }, []);

    useEffect(() => {
        setTokenBalance(
            tokenBalanceAsBigNumber
                ? parseBigNumber(tokenBalanceAsBigNumber, tokenDecimals)
                : 0,
        );
    }, [tokenBalanceAsBigNumber]);

    useEffect(() => {
        setDefaultSettings();
    }, [areSettingsOpen]);

    useEffect(() => {
        const fetchData = async (poolContract: Contract) => {
            const immutables = await getPoolImmutables(poolContract);
            const state = await getPoolState(poolContract);
            setImmutables(immutables);
            setNearestTick(
                nearestUsableTick(state.tick, immutables.tickSpacing),
            );
        };
        if (library && pool) {
            const poolContract = usePoolContract(library, pool.poolAddress);
            fetchData(poolContract).catch(console.error);
        }
    }, [pool]);

    useEffect(() => {
        setTokenDecimals(
            ASSETS.find((el) => el.symbol === pool.token0.symbol)!.decimals,
        );
    }, [tokenAddress]);

    useEffect(() => {
        const fetchData = async (library: JsonRpcProvider) => {
            setLakePrice(await useLakeUsdtPrice(library));
        };
        if (library) {
            fetchData(library).catch(console.error);
        }
    }, [library]);

    useEffect(() => {
        setIsTokenApproved(
            (!!tokenAllowance &&
                !!pool &&
                parseBigNumber(tokenAllowance, tokenDecimals) >=
                    tokenInputValue) ||
                tokenInputValue === 0,
        );
    }, [tokenInputValue]);

    useEffect(() => {
        setIsLakeApproved(
            (!!lakeAllowance &&
                parseBigNumber(lakeAllowance, ASSET_LAKE.decimals) >=
                    lakeInputValue) ||
                lakeInputValue === 0,
        );
    }, [lakeInputValue]);

    useEffect(() => {
        setTokenAddress(
            !!selectedPosition ? selectedPosition.tokenAddress : ethAddress,
        );
    }, [selectedPosition]);

    const setDefaultSettings = () => {
        setSlippageTolerance(DEFAULT_SLIPPAGE_TOLERANCE);
        setTransactionDeadline(DEFAULT_TRANSACTION_DEADLINE);
        setTickLower(-MAX_TICK);
        setTickUpper(MAX_TICK);
    };

    const onProvideLiquidityClick = async () => {
        if (library && account) {
            setIsLiquidityProviding(true);
            await useProvideLiquidity(
                library,
                tokenInputValue,
                tokenAddress,
                tokenDecimals,
                lakeInputValue,
                slippageTolerance,
                transactionDeadline,
                tickLower,
                tickUpper,
                account,
                selectedPosition,
            );
            setIsLiquidityProviding(false);
            setLakeInputValue(0);
            setTokenInputValue(0);
            setAreSettingsOpen(false);
            refreshPositions();
        }
    };

    const onTokenValueChange = (value: number) => {
        setTokenInputValue(value);
        setIsTokenValueValid(value <= tokenBalance);
        const lakeAmount = (value * tokenPrice) / lakePrice;
        setLakeInputValue(lakeAmount);
        setIsLakeValueValid(lakeAmount <= lakeBalance);
    };

    const onLakeValueChange = (value: number) => {
        setLakeInputValue(value);
        setIsLakeValueValid(value <= lakeBalance);
        const usdtAmount = (value * lakePrice) / tokenPrice;
        setTokenInputValue(usdtAmount);
        setIsTokenValueValid(usdtAmount <= tokenBalance);
    };

    const onApproveClick = async (tokenAddress: string, amount: number) => {
        tokenAddress === lakeAddress
            ? setIsLakeApproving(true)
            : setIsTokenApproving(true);

        const tokenContract = new Contract(
            tokenAddress,
            ERC20Abi,
            library?.getSigner(account),
        );

        const resp = tokenContract.approve(
            nonfungiblePositionManagerAddress,
            parseUnits(amount.toString(), tokenDecimals),
        );

        await resp.wait();

        tokenAddress === lakeAddress
            ? setIsLakeApproving(false)
            : setIsTokenApproving(false);
    };

    return (
        <>
            <div className="w-full flex items-center mb-4 justify-around">
                <div className="font-kanit-medium color-gray-gradient text-shadow text-xl tracking-[.12em] text-center">
                    PROVIDE LIQUIDITY
                </div>
                <img
                    className="w-[1.5rem] h-[1.5rem] hover:scale-105 cursor-pointer transition-transform duration-300"
                    src={settingsIcon}
                    alt="settings"
                    onClick={() => {
                        setAreSettingsOpen(!areSettingsOpen);
                    }}
                ></img>
            </div>

            {areSettingsOpen && (
                <Settings
                    isRangeVisible={!selectedPosition}
                    tickLower={tickLower}
                    tickUpper={tickUpper}
                    nearestTick={nearestTick}
                    tickSpacing={immutables!.tickSpacing}
                    slippageTolerance={slippageTolerance}
                    transactionDeadline={transactionDeadline}
                    tokenAddress={tokenAddress}
                    tokenSymbol={pool.token0.symbol}
                    increaseTickLower={() => {
                        setTickLower(
                            tickLower === -MAX_TICK
                                ? nearestTick -
                                      (TICKS_RANGE / 2) *
                                          immutables!.tickSpacing
                                : tickLower + immutables!.tickSpacing,
                        );
                    }}
                    decreaseTickLower={() => {
                        setTickLower(tickLower - immutables!.tickSpacing);
                    }}
                    increaseTickUpper={() => {
                        setTickUpper(tickUpper + immutables!.tickSpacing);
                    }}
                    decreaseTickUpper={() => {
                        setTickUpper(
                            tickUpper === MAX_TICK
                                ? nearestTick +
                                      (TICKS_RANGE / 2) *
                                          immutables!.tickSpacing
                                : tickUpper - immutables!.tickSpacing,
                        );
                    }}
                    onSlippageToleranceChange={(event: any) => {
                        setSlippageTolerance(
                            event.target.value || DEFAULT_SLIPPAGE_TOLERANCE,
                        );
                    }}
                    onTransactionDeadlineChange={(event: any) => {
                        setTransactionDeadline(
                            event.target.value || DEFAULT_TRANSACTION_DEADLINE,
                        );
                    }}
                    onFullRangeClick={() => {
                        setTickLower(-MAX_TICK);
                        setTickUpper(MAX_TICK);
                    }}
                />
            )}
            <div className="flex min-w-[20vw]">
                <div className="w-full flex flex-col">
                    <TokenInput
                        balance={tokenBalance}
                        tokenSymbol={pool!.token0.symbol}
                        tokenPrice={tokenPrice}
                        inputValue={tokenInputValue}
                        isValueValid={isTokenValueValid}
                        setMaxInputValue={() =>
                            onTokenValueChange(tokenBalance)
                        }
                        onChange={(event: any) =>
                            onTokenValueChange(event.target.value || '')
                        }
                    />
                    <TokenInput
                        balance={lakeBalance}
                        tokenSymbol="LAKE"
                        tokenPrice={lakePrice}
                        inputValue={lakeInputValue}
                        isValueValid={isLakeValueValid}
                        setMaxInputValue={() => onLakeValueChange(lakeBalance)}
                        onChange={(event: any) =>
                            onLakeValueChange(event.target.value || '')
                        }
                    />
                </div>
            </div>
            <div className="flex flex-col items-center">
                {!isTokenApproved && (
                    <div className="mt-8">
                        {isTokenApproving ? (
                            <GradientButtonWithSpinner
                                size="medium"
                                disabled={true}
                            />
                        ) : (
                            <GradientButton
                                size="medium"
                                disabled={false}
                                text={`APPROVE ${pool?.token0.symbol}`}
                                onClick={() =>
                                    onApproveClick(
                                        tokenAddress,
                                        tokenInputValue,
                                    )
                                }
                            />
                        )}
                    </div>
                )}
                {!isLakeApproved && (
                    <div className="mt-8">
                        {isLakeApproving ? (
                            <GradientButtonWithSpinner
                                size="medium"
                                disabled={true}
                            />
                        ) : (
                            <GradientButton
                                size="medium"
                                disabled={false}
                                text="APPROVE LAKE"
                                onClick={() =>
                                    onApproveClick(lakeAddress, lakeInputValue)
                                }
                            />
                        )}
                    </div>
                )}
                {isLakeApproved && isTokenApproved && (
                    <div className="mt-8">
                        {isLiquidityProviding ? (
                            <ButtonWithSpinner size="medium" disabled={true} />
                        ) : (
                            <Button
                                size="medium"
                                disabled={
                                    lakeInputValue === 0 ||
                                    tokenInputValue === 0 ||
                                    !isLakeValueValid ||
                                    !isTokenValueValid
                                }
                                text="PROVIDE LIQUIDITY"
                                onClick={onProvideLiquidityClick}
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    );
};
