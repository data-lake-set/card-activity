import { PriceRange } from './PriceRange';

type Props = {
    isRangeVisible: boolean;
    tickLower?: number;
    tickUpper?: number;
    nearestTick?: number;
    tickSpacing?: number;
    slippageTolerance: number;
    transactionDeadline: number;
    tokenAddress?: string;
    tokenSymbol?: string;
    decreaseTickLower?: () => void;
    increaseTickLower?: () => void;
    decreaseTickUpper?: () => void;
    increaseTickUpper?: () => void;
    onSlippageToleranceChange: (event: any) => void;
    onTransactionDeadlineChange: (event: any) => void;
    onFullRangeClick?: () => void;
};

export const Settings = ({
    isRangeVisible,
    tickLower,
    nearestTick,
    tickSpacing,
    tickUpper,
    slippageTolerance,
    transactionDeadline,
    tokenAddress,
    tokenSymbol,
    decreaseTickLower,
    increaseTickLower,
    decreaseTickUpper,
    increaseTickUpper,
    onSlippageToleranceChange,
    onTransactionDeadlineChange,
    onFullRangeClick,
}: Props) => {
    return (
        <div className="w-full flex flex-col bg-black-600 rounded-[20px] p-4 my-4 font-kanit-medium whitespace-nowrap text-xs box-shadow">
            {isRangeVisible && (
                <PriceRange
                    tickLower={tickLower!}
                    tickUpper={tickUpper!}
                    nearestTick={nearestTick!}
                    tickSpacing={tickSpacing!}
                    tokenAddress={tokenAddress!}
                    tokenSymbol={tokenSymbol!}
                    decreaseTickLower={decreaseTickLower!}
                    increaseTickLower={increaseTickLower!}
                    decreaseTickUpper={decreaseTickUpper!}
                    increaseTickUpper={increaseTickUpper!}
                    onFullRangeClick={onFullRangeClick!}
                />
            )}
            <div className="flex w-full justify-between">
                <div className="tracking-[.12em] flex items-center">
                    SLIPPAGE TOLERANCE:
                </div>
                <div className="flex w-[5rem]">
                    <input
                        className="color-gradient text-base font-bold truncate text-end w-full"
                        value={slippageTolerance}
                        onChange={onSlippageToleranceChange}
                    />
                    <div className="tracking-[.12em] ml-2 flex items-center">
                        %
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-between">
                <div className="tracking-[.12em] flex items-center">
                    TRANSACTION DEADLINE:
                </div>
                <div className="flex w-[5rem]">
                    <input
                        className="color-gradient text-base font-bold truncate text-end w-full"
                        value={transactionDeadline}
                        onChange={onTransactionDeadlineChange}
                    />
                    <div className="tracking-[.12em] ml-2 flex items-center">
                        MIN
                    </div>
                </div>
            </div>
        </div>
    );
};
