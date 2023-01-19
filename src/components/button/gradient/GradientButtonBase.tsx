import { GradientBackground } from '../../GradientBackground';
import { ReactNode } from 'react';
import { Size } from '../Button';

interface Props {
    size: Size;
    disabled: boolean;
    children: ReactNode;
    onClick?: () => void;
}

export const GradientButtonBase = ({
    size,
    disabled,
    children,
    onClick,
}: Props) => (
    <button
        disabled={disabled}
        onClick={onClick}
        className={`${
            disabled ? '' : 'hover:scale-105 cursor-pointer'
        } transition-transform duration-300`}
    >
        <GradientBackground
            className={`${
                size === 'small'
                    ? 'min-w-[12rem] h-[2.5rem] px-2'
                    : size === 'medium'
                    ? 'min-w-[12rem] lg:min-w-[14rem] h-[2.5rem] lg:h-[3rem] p-2 lg:px-6'
                    : 'min-w-[18rem] h-[5.5rem] px-6 !rounded-[80px]'
            } flex justify-center items-center rounded-[32px]`}
        >
            {children}
        </GradientBackground>
    </button>
);
