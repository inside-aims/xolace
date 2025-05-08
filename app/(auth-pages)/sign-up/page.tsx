import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import SignUpForm from '@/components/forms/SignUpForm';
import xolaceImage from "../../../public/assets/images/xolace-1.png"

export const metadata: Metadata = {
  title: 'Sign-up',
}

export default function Signup() {
  return (
    <>
      <div className="main-container min-h-[calc(100dvh-(--spacing(30)))]">
        <div>
          <Image
            src={xolaceImage}
            alt="welcome banner"
            className="phone400:top-[20%] absolute left-1/2 top-[22%] h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 transform fill-current object-cover sm:top-[29%] md:top-[29%] lg:h-[26rem] lg:w-[26rem]"
            placeholder="blur"
            blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8f+pUPQAHtwLkNZHWpAAAAABJRU5ErkJggg=="
            priority={true}
            fetchPriority="high"
            loading='eager'
          />
        </div>
        <div className="mt-[270px] flex flex-col items-center justify-center max-sm:w-full sm:mt-[320px] sm:w-[70%] md:px-12 lg:mt-[330px] lg:w-[40%]">
          <SignUpForm />
        </div>
      </div>
    </>
  );
}
