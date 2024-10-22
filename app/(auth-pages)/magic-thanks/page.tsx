import Link from "next/link";
import { Button } from "@/components/ui/button";

import { FORM_TYPES } from "@/constants";
import { urlPath } from "@/utils/url-helpers";

const MagicLinkSuccessPage = ({ searchParams }: any) => {
  const { type } = searchParams;
  const isPasswordRecovery = type === FORM_TYPES.PASSWORD_RECOVERY;

  return (
    <div className=" text-center pt-10 main-container">
      <h1 className=" text-2xl font-bold mb-5">
        {isPasswordRecovery && "Password "}
        Magic On its Way !! 🪄
      </h1>
      <p className="text-gray-500">
        {isPasswordRecovery
          ? "Thanks! You should get a link to reset password in a few seconds"
          : "Thanks! You should get a link to login in a few seconds"}
      </p>
      <Link href={urlPath("/sign-in")} className=" mt-5">
        Go back
      </Link>
    </div>
  );
};

export default MagicLinkSuccessPage;
