import { Button } from '../button/Button';
import { EnglishDisclaimer } from './EnglishDisclaimer';
import { GradientBorder } from '../GradientBorder';
import { GradientButton } from '../button/gradient/GradientButton';
import { PolishDisclaimer } from './PolishDisclaimer';
import ToggleButton from 'react-toggle-button';
import cancelIcon from '../../assets/icons/cancel-icon.svg';
import { colors } from '../../constants/colors';
import mainPage from '../../assets/icons/main-page.png';
import styled from 'styled-components';
import { useState } from 'react';

type Props = {
    onAcceptClick: () => void;
};

export const Disclaimer = ({ onAcceptClick }: Props) => {
    const [isEnglish, setIsEnglish] = useState(true);
    const [firstCheckbox, setFirstCheckbox] = useState(false);
    const [secondCheckbox, setSecondCheckbox] = useState(false);
    const [thirdCheckbox, setThirdCheckbox] = useState(false);

    return (
        <div className="w-full h-[100vh]">
            <div className="w-full h-full z-40 fixed flex items-center justify-center">
                <div className="w-[30rem] h-[25rem] flex justify-between p-8 bg-black-800 rounded-[20px] inset-shadow overflow-auto">
                    <div className="w-full flex flex-col items-center justify-between">
                        <div className="w-full flex items-center justify-between">
                            <ToggleButton
                                inactiveLabel="🇵🇱"
                                activeLabel="🇬🇧"
                                value={isEnglish}
                                onToggle={() => {
                                    setIsEnglish(!isEnglish);
                                }}
                                colors={{
                                    activeThumb: {
                                        base: colors.purple[600],
                                    },
                                    inactiveThumb: {
                                        base: colors.purple[600],
                                    },
                                    active: {
                                        base: colors.black[500],
                                    },
                                    inactive: {
                                        base: colors.black[500],
                                    },
                                }}
                            />
                            <span className="text-3xl color-gray-gradient text-center my-2 tracking-[.1em] font-medium font-kanit-medium cursor-default">
                                DISCLAIMER
                            </span>
                            <button
                                className="hover:scale-105 cursor-pointer transition-transform duration-300 cursor-pointer"
                                onClick={() =>
                                    (window.location.href =
                                        'https://data-lake.co/')
                                }
                            >
                                <GradientBorder className="p-px flex justify-center items-center rounded-[32px]">
                                    <div className="w-full h-full flex justify-center items-center rounded-[32px] bg-black-500 p-1">
                                        <img
                                            className="cursor-pointer"
                                            src={cancelIcon}
                                            alt="cancel"
                                        ></img>
                                    </div>
                                </GradientBorder>
                            </button>
                        </div>
                        {isEnglish ? (
                            <EnglishDisclaimer
                                firstCheckbox={firstCheckbox}
                                secondCheckbox={secondCheckbox}
                                thirdCheckbox={thirdCheckbox}
                                setFirstCheckbox={(val) =>
                                    setFirstCheckbox(val)
                                }
                                setSecondCheckbox={(val) =>
                                    setSecondCheckbox(val)
                                }
                                setThirdCheckbox={(val) =>
                                    setThirdCheckbox(val)
                                }
                            />
                        ) : (
                            <PolishDisclaimer
                                firstCheckbox={firstCheckbox}
                                secondCheckbox={secondCheckbox}
                                thirdCheckbox={thirdCheckbox}
                                setFirstCheckbox={(val) =>
                                    setFirstCheckbox(val)
                                }
                                setSecondCheckbox={(val) =>
                                    setSecondCheckbox(val)
                                }
                                setThirdCheckbox={(val) =>
                                    setThirdCheckbox(val)
                                }
                            />
                        )}
                        <div className="pt-6">
                            {firstCheckbox &&
                            secondCheckbox &&
                            thirdCheckbox ? (
                                <GradientButton
                                    size="small"
                                    disabled={false}
                                    text={'ACCEPT'}
                                    onClick={onAcceptClick}
                                />
                            ) : (
                                <Button
                                    size="small"
                                    disabled={true}
                                    text={'ACCEPT'}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <BackgroundImage className="w-full h-full flex justify-center items-center m-auto blur-[3px] opacity-20" />
        </div>
    );
};

const BackgroundImage = styled.div`
    background-image: url(${mainPage});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #1e1e1e;
`;
