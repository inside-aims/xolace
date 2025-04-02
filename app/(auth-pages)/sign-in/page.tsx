import type { Metadata } from 'next';
import Image from 'next/image';
import SignInForm from '@/components/forms/SignInForm';
import xolaceImage from "../../../public/assets/images/xolace-1.png"

export const metadata: Metadata = {
  title: 'Sign-in',
}

export default async function Login() {


  return (
    <div className="main-container">
      <div>
        <Image
          src={xolaceImage}
          alt="welcome banner"
          className="phone400:top-[20%] absolute left-1/2 top-[22%] h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 transform fill-current object-cover sm:top-[23%] md:top-[29%] lg:h-[26rem] lg:w-[26rem]"
          placeholder="blur"
          blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8f+pUPQAHtwLkNZHWpAAAAABJRU5ErkJggg=="
          priority={true}
          fetchPriority="high"
          loading='eager'
        />
      </div>
      <div className="mt-[270px] flex flex-col items-center justify-center py-2 max-sm:w-full sm:mt-[300px] sm:w-[70%] md:mt-[320px] md:px-12 lg:mt-[330px] lg:w-[40%]">
        <SignInForm />
      </div>
    </div>
  );
}
