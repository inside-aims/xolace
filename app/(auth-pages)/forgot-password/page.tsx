import type { Metadata } from 'next';
import { FormMessage, Message } from '@/components/shared/form-message';
import { SubmitButton } from '@/components/extras/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { urlPath } from '@/utils/url-helpers';
import Image from "next/image";
import mascot from "@/public/assets/images/mas.webp";

import React from "react";

export const metadata: Metadata = {
  title: 'Forgot Password',
}

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex min-h-[100vh] items-center justify-center overflow-hidden">
      <div className="max-sm:w-full md:w-[60%] lg:w-[40%] xl:w-[32%] flex flex-col items-center justify-center px-6 gap-8">
        <div className="flex md:hidden">
          <Image
            src={mascot}
            alt="logo"
            width={60}
            height={60}
            priority={true}
            className="w-auto h-auto"
          />
        </div>
        <div className={"w-full max-xl items-start flex flex-col gap-2"}>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className={"text-neutral-500"}>
            Entered your registered email below to receive password reset instruction
          </p>
        </div>

        <form
          className="mx-auto flex w-full flex-col gap-8 text-center text-foreground"
          method="POST"
          action={urlPath('/api/v1/auth/magic-link')}
        >
          <div className="flex flex-col">
            <input type="hidden" name="type" value="recovery"/>
            <Label htmlFor="email" className="text-start">
              Email
            </Label>
            <Input name="email" placeholder="you@example.com" required/>
            <FormMessage message={searchParams}/>
          </div>
          <SubmitButton
            className={"bg-ocean-500 hover:bg-ocean-600 transition-transform ease-in-out duration-300 hover:scale-[1.03]"}>
            Reset Password
          </SubmitButton>
          <p className="w-full text-center md:text-start font-medium">
            Remember your password?{' '}
            <Link className="text-lavender-500 hover:underline hover:text-lavender-600" href={"/sign-in"}>
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
