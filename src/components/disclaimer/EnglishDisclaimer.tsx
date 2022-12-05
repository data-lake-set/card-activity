import { Link } from 'react-router-dom';

type Props = {
    firstCheckbox: boolean;
    secondCheckbox: boolean;
    thirdCheckbox: boolean;
    setFirstCheckbox: (value: boolean) => void;
    setSecondCheckbox: (value: boolean) => void;
    setThirdCheckbox: (value: boolean) => void;
};

export const EnglishDisclaimer = ({
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
        <label className="text-justify my-1">
            <input
                className="mr-3"
                type="checkbox"
                checked={secondCheckbox}
                onChange={() => setSecondCheckbox(!secondCheckbox)}
            />
            I have familiarised myself with{' '}
            <Link
                className="font-medium font-kanit-medium"
                to="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
            >
                INFORMATION ABOUT THE RISKS ASSOCIATED WITH THE PROVISION OF
                SERVICES
            </Link>{' '}
            and I accept the risks indicated therein.
        </label>
        <label className="text-justify my-1">
            <input
                className="mr-3"
                type="checkbox"
                checked={thirdCheckbox}
                onChange={() => setThirdCheckbox(!thirdCheckbox)}
            />
            I consent to the commencement of services before the end of the
            withdrawal period.
        </label>
    </div>
);
