import React, { useState } from "react";
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'



interface Props {
  showPassword : boolean;
  setShowPassword : React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleEyeIcon = ({ showPassword, setShowPassword }: Props) => {
  // const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="absolute top-4 md:top-4 right-6 text-dark dark:text-gray-300 cursor-pointer "
      onClick={handleTogglePassword}
    >
      {showPassword ? <EyeClosedIcon className="text-dark-3 dark:text-gray-300 h-5 w-5" /> : <EyeOpenIcon className="text-dark-3 dark:text-gray-300 w-5 h-5"  style={{ fontSize: 100 }} /> }
    </div>
  );
};

export default ToggleEyeIcon;