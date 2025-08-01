import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import SignUpForm from '@/components/forms/SignUpForm';
import signIn from "../../../public/assets/images/auth/sign-up.png"

export const metadata: Metadata = {
  title: 'Sign-up',
  description: "Create an account to access a supportive community offering mental health resources, expert advice, and a safe space to share your experiences."
}

export default function Signup() {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full grid grid-cols-12 min-h-screen">

        {/*image section*/}
        <div className="relative hidden md:block md:col-span-5 m-4">
          <div className="w-full h-full rounded-3xl overflow-hidden relative">
            <Image
              src={signIn}
              alt="Sign-up"
              fill
              placeholder='blur'
              priority
              sizes="(max-width: 767px) 0px, (min-width: 768px) 42vw"
            />
          </div>
        </div>

        {/*form section*/}
        <div className="p-2 col-span-12 md:col-span-7 flex items-center justify-center w-full">
          <Suspense fallback={null}>
            <SignUpForm/>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
