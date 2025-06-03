import type { Metadata } from 'next';
import Image from 'next/image';
import SignInForm from '@/components/forms/SignInForm';
import signIn from "../../../public/assets/images/auth/sign-in.png"

export const metadata: Metadata = {
  title: 'Sign-in',
  description: "Sign in to access a supportive community offering mental health resources, expert advice, and a safe space to share your experiences."
}

export default async function Login() {

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full grid grid-cols-12 min-h-screen">
        {/*form section*/}
        <div className="p-2 col-span-12 md:col-span-7 flex items-center justify-center w-full lg:mx-[-8%]">
          <SignInForm/>
        </div>

        {/*image section*/}
        <div className="relative hidden md:block md:col-span-5 m-2">
          <div className="w-full h-full rounded-3xl overflow-hidden relative">
            <Image
              src={signIn}
              alt="Sign-in"
              fill
              placeholder='blur'
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
