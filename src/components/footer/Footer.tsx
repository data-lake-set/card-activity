import { Button } from '../button/Button';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import { formatAddress } from '../../utils/formatAddress';
import linkedinIcon from '../../assets/icons/linkedin-icon.svg';
import logo from '../../assets/icons/lake-logo.svg';
import mediumIcon from '../../assets/icons/medium-icon.svg';
import telegramIcon from '../../assets/icons/telegram-icon.svg';
import twitterIcon from '../../assets/icons/twitter-icon.svg';
import { useConfig } from '../../hooks/use-config';
import youtubeIcon from '../../assets/icons/youtube-icon.svg';

export const Footer = () => {
    const { lakeAddress } = useConfig();
    return (
        <div className="w-full h-full bg-black-700 rounded-[30px] inset-shadow flex justify-between px-28 items-center">
            <div className="flex flex-col items-center">
                <img
                    className="w-[2.5rem] h-[2.5rem]"
                    src={logo}
                    alt="logo"
                ></img>
                <span className="tracking-[.1em] text-xl font-kanit-regular color-gray-gradient text-shadow my-4">
                    CONTRACT ADDRESS
                </span>
                <CopyToClipboard text={lakeAddress}>
                    <Button
                        size="small"
                        disabled={false}
                        text={formatAddress(lakeAddress)}
                    ></Button>
                </CopyToClipboard>
            </div>
            <div className="flex">
                <img
                    className="w-[3rem] h-[3rem] mx-4 cursor-pointer hover:scale-105 transition-transform duration-300"
                    src={youtubeIcon}
                    alt="youtubeIcon"
                    onClick={() =>
                        window.open(
                            'https://www.youtube.com/channel/UCAtPbl4vVyeeUhRDmdk8N_g',
                            '_blank',
                        )
                    }
                ></img>
                <img
                    className="w-[3rem] h-[3rem] mx-4 cursor-pointer hover:scale-105 transition-transform duration-300"
                    src={twitterIcon}
                    alt="twitterIcon"
                    onClick={() =>
                        window.open(
                            'https://twitter.com/DataLakeToken?s=20&t=CdHscW2S5BI3WAnGkvff6A',
                            '_blank',
                        )
                    }
                ></img>
                <img
                    className="w-[3rem] h-[3rem] mx-4 cursor-pointer hover:scale-105 transition-transform duration-300"
                    src={telegramIcon}
                    alt="telegramIcon"
                    onClick={() =>
                        window.open(
                            'https://t.me/LakeTokenAnnouncements',
                            '_blank',
                        )
                    }
                ></img>
                <img
                    className="w-[3rem] h-[3rem] mx-4 cursor-pointer hover:scale-105 transition-transform duration-300"
                    src={mediumIcon}
                    alt="mediumIcon"
                    onClick={() =>
                        window.open(
                            'https://datalaketoken.medium.com/',
                            '_blank',
                        )
                    }
                ></img>
                <img
                    className="w-[3rem] h-[3rem] mx-4 cursor-pointer hover:scale-105 transition-transform duration-300"
                    src={linkedinIcon}
                    alt="linkedinIcon"
                    onClick={() =>
                        window.open(
                            'https://www.linkedin.com/company/data-lake-co/',
                            '_blank',
                        )
                    }
                ></img>
            </div>
            <div className="flex flex-col items-center tracking-[.1em] text-lg font-kanit-light color-gray-gradient text-shadow">
                <a
                    className="my-1 cursor-pointer"
                    href="mailto:office@data-lake.co"
                >
                    CONTACT US
                </a>
                <Link
                    className="my-1 cursor-pointer"
                    to="/cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    COOKIES
                </Link>
                <Link
                    className="my-1 cursor-pointer"
                    to="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    PRIVACY POLICY
                </Link>
                <Link
                    className="my-1 cursor-pointer"
                    to="/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    DISCLAIMER
                </Link>
            </div>
        </div>
    );
};
