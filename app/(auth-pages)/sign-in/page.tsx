import Image from "next/image";
import SignInForm from "@/components/forms/SignInForm";
import { FORM_TYPES } from "@/constants";

export default async function Login(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const wantsMagicLink = searchParams.magicLink === "yes";
  const wantsPasswordRecovery = searchParams.passwordRecovery === "yes";

  let formType = FORM_TYPES.PASSWORD_LOGIN;
  if (wantsMagicLink) {
    formType = FORM_TYPES.MAGIC_LINK;
  } else if (wantsPasswordRecovery) {
    formType = FORM_TYPES.PASSWORD_RECOVERY;
  }

  return (
    <div className=" main-container ">
      <div>
        <Image
          src={"/assets/images/xolace-1.png"}
          width={600}
          height={500}
          alt="welcome banner"
          className=" object-cover absolute w-[24rem] h-[24rem] lg:w-[26rem] lg:h-[26rem] fill-current top-[22%] phone400:top-[20%] sm:top-[23%] md:top-[29%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          placeholder="blur"
          blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8f+pUPQAHtwLkNZHWpAAAAABJRU5ErkJggg=="
        />
      </div>
      <div className=" max-sm:w-full sm:w-[70%] lg:w-[40%]   flex flex-col justify-center py-2 md:px-12 mt-[270px] sm:mt-[300px] md:mt-[320px] lg:mt-[330px] items-center">
        <SignInForm formType={formType} />
      </div>
    </div>
  );
}
