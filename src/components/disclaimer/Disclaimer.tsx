import { Button } from '../button/Button';
import { GradientBorder } from '../GradientBorder';
import { GradientButton } from '../button/gradient/GradientButton';
import { Link } from 'react-router-dom';
import cancelIcon from '../../assets/icons/cancel-icon.svg';
import mainPage from '../../assets/icons/main-page.png';
import styled from 'styled-components';
import { useState } from 'react';

type Props = {
    onAcceptClick: () => void;
};

export const Disclaimer = ({ onAcceptClick }: Props) => {
    const [firstCheckbox, setFirstCheckbox] = useState(false);
    const [secondCheckbox, setSecondCheckbox] = useState(false);
    const [thirdCheckbox, setThirdCheckbox] = useState(false);

    return (
        <div className="w-full h-[100vh]">
            <div className="w-full h-full z-40 fixed flex items-center justify-center">
                <div className="w-[30rem] h-[25rem] flex justify-between p-8 bg-black-800 rounded-[20px] inset-shadow overflow-auto">
                    <div className="w-full flex flex-col items-center justify-between">
                        <div className="w-full flex relative items-center justify-center">
                            <span className="text-3xl color-gray-gradient text-center mt-2 mb-4 tracking-[.1em] font-medium font-kanit-medium cursor-default">
                                DISCLAIMER
                            </span>
                            <button
                                className="hover:scale-105 cursor-pointer transition-transform duration-300 absolute cursor-pointer right-0 top-2"
                                onClick={() =>
                                    window.location.replace(
                                        'https://data-lake.co/',
                                    )
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
                        <div className="flex flex-col overflow-auto">
                            <label>
                                <input
                                    className="mr-3"
                                    type="checkbox"
                                    checked={firstCheckbox}
                                    onChange={() =>
                                        setFirstCheckbox(!firstCheckbox)
                                    }
                                />
                                I accept the{' '}
                                <Link
                                    className="font-medium font-kanit-medium"
                                    to="/terms-and-conditions"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Terms & Conditions
                                </Link>{' '}
                                and{' '}
                                <Link
                                    className="font-medium font-kanit-medium"
                                    to="/privacy-policy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </label>
                            <label>
                                <input
                                    className="mr-3"
                                    type="checkbox"
                                    checked={secondCheckbox}
                                    onChange={() =>
                                        setSecondCheckbox(!secondCheckbox)
                                    }
                                />
                                I have familiarised myself with{' '}
                                <Link
                                    className="font-medium font-kanit-medium"
                                    to="/terms-and-conditions"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    INFORMATION ABOUT THE RISKS ASSOCIATED WITH
                                    THE PROVISION OF SERVICES
                                </Link>{' '}
                                and I accept the risks indicated therein.
                            </label>
                            <label>
                                <input
                                    className="mr-3"
                                    type="checkbox"
                                    checked={thirdCheckbox}
                                    onChange={() =>
                                        setThirdCheckbox(!thirdCheckbox)
                                    }
                                />
                                I consent to the commencement of services before
                                the end of the withdrawal period.
                            </label>
                        </div>
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
