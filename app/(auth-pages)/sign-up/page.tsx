import React from "react";
import Image from "next/image";

import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import SignUpForm from "@/components/forms/SignUpForm";

export default function Signup({ searchParams }: { searchParams: Message }) {
  return (
    <>
      <div className=" main-container ">
        <div>
          <Image
            src={"/assets/images/xolace-1.png"}
            width={600}
            height={500}
            alt="welcome banner"
            className="  object-cover absolute w-[24rem] h-[24rem] lg:w-[26rem] lg:h-[26rem] fill-current top-[22%] phone400:top-[20%] sm:top-[29%] md:top-[29%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            placeholder="blur"
            blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8f+pUPQAHtwLkNZHWpAAAAABJRU5ErkJggg=="
          />
        </div>
        <div className=" max-sm:w-full md:w-[40%] flex flex-col justify-center md:px-12 mt-[85%] md:mt-[25%] items-center ">
          <SignUpForm />
        </div>
      </div>
    </>
  );
}
