import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { RocketIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import React from 'react';
import XolaceBetaBadge from '@/components/shared/XolaceBetaBadge';
import xolaceImage from "../public/assets/images/xolace-1.png"

export default async function Index() {
  return (
    <>
      <main className="relative flex min-h-screen flex-col items-center justify-between overflow-y-hidden p-14 md:px-16 md:py-4">
        <div className="">
          <Image
            src={xolaceImage}
            alt="welcome banner"
            className="phone400:top-[29%] absolute left-1/2 top-[26%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 transform fill-current object-cover sm:top-[30%] md:top-[30%]"
            placeholder="blur"
            blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8f+pUPQAHtwLkNZHWpAAAAABJRU5ErkJggg=="
            priority={true}
            fetchPriority="high"
          />
          <div className="font-tilt phone400:top-[26rem] z-5 absolute left-1/2 top-[23rem] w-full -translate-x-1/2 -translate-y-1/2 transform text-center font-tiltNeon text-[5rem] sm:top-[60%] md:top-[63%]">
            <span className="letter-mask">X</span>
            <span className="letter-mask !text-amber-400">o</span>
            <span className="letter-mask">l</span>
            <span className="letter-mask">a</span>
            <span className="letter-mask">c</span>
            <span className="letter-mask">e</span>
          </div>
        </div>
        <div className="z-10 mt-[370px]">
          <p className="phone400:p-7 mb-1 px-6 text-center font-tiltNeon text-xl font-bold">
            Welcome to Xolace, a platform where you can interact anonymously.
          </p>
          <div className="absolute right-10 top-10 md:right-28">
            <XolaceBetaBadge />
          </div>
        </div>
        <div>
          <Button title="Welcome" asChild>
            <Link href={'/sign-in'}>
              <RocketIcon className="mr-2 h-4 w-4" />
              Let&apos;s Start
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}
