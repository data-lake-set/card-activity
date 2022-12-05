import { Link } from 'react-router-dom';

type Props = {
    firstCheckbox: boolean;
    secondCheckbox: boolean;
    thirdCheckbox: boolean;
    setFirstCheckbox: (value: boolean) => void;
    setSecondCheckbox: (value: boolean) => void;
    setThirdCheckbox: (value: boolean) => void;
};

export const PolishDisclaimer = ({
    firstCheckbox,
    secondCheckbox,
    thirdCheckbox,
    setFirstCheckbox,
    setSecondCheckbox,
    setThirdCheckbox,
}: Props) => (
    <div className="flex flex-col overflow-auto">
        <label className="text-justify my-1">
            <input
                className="mr-3"
                type="checkbox"
                checked={firstCheckbox}
                onChange={() => setFirstCheckbox(!firstCheckbox)}
            />
            Akceptuję postanowienia{' '}
            <Link
                className="font-medium font-kanit-medium"
                to="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
            >
                Regulaminu
            </Link>{' '}
            i{' '}
            <Link
                className="font-medium font-kanit-medium"
                to="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
            >
                Polityki Prywatności
            </Link>
            .
        </label>
        <label className="text-justify my-1">
            <input
                className="mr-3"
                type="checkbox"
                checked={secondCheckbox}
                onChange={() => setSecondCheckbox(!secondCheckbox)}
            />
            Zapoznałem się z{' '}
            <Link
                className="font-medium font-kanit-medium"
                to="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
            >
                INFORMACJĄ O RYZYKACH ZWIĄZANYCH ZE ŚWIADCZENIEM USŁUG
            </Link>{' '}
            i akceptuję wskazane tam ryzyko.
        </label>
        <label className="text-justify my-1">
            <input
                className="mr-3"
                type="checkbox"
                checked={thirdCheckbox}
                onChange={() => setThirdCheckbox(!thirdCheckbox)}
            />
            Wyrażam zgodę na rozpoczęcie świadczenia usług przed upływem terminu
            na odstąpienie od umowy.
        </label>
    </div>
);
