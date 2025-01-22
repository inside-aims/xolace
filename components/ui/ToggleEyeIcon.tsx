import React from 'react';
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons';

interface Props {
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleEyeIcon = ({ showPassword, setShowPassword }: Props) => {
  // const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="text-dark absolute right-6 top-4 cursor-pointer dark:text-gray-300 md:top-4"
      onClick={handleTogglePassword}
    >
      {showPassword ? (
        <EyeClosedIcon className="h-5 w-5 text-dark-3 dark:text-gray-300" />
      ) : (
        <EyeOpenIcon
          className="h-5 w-5 text-dark-3 dark:text-gray-300"
          style={{ fontSize: 100 }}
        />
      )}
    </div>
  );
};

export default ToggleEyeIcon;
