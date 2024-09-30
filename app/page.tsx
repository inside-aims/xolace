import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

export default async function Index() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-14 md:px-16 md:py-4 relative overflow-y-hidden">
        <div className="">
          <Image
            src={"/assets/images/xolace-1.png"}
            width={600}
            height={500}
            alt="welcome banner"
            className="  object-cover absolute w-[30rem] h-[30rem] fill-current top-[26%] phone400:top-[29%] sm:top-[30%] md:top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            placeholder="blur"
            blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8f+pUPQAHtwLkNZHWpAAAAABJRU5ErkJggg=="
          />
          <div className="font-tiltNeon font-tilt text-[5rem] w-full text-center absolute top-[23rem] phone400:top-[26rem]  sm:top-[60%] md:top-[63%] z-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="letter-mask ">X</span>
            <span className="letter-mask !text-amber-400">o</span>
            <span className="letter-mask">l</span>
            <span className="letter-mask">a</span>
            <span className="letter-mask">c</span>
            <span className="letter-mask">e</span>
          </div>
        </div>
        <div className=" mt-96 z-10">
          <p className="font-tiltNeon font-bold text-xl text-center px-6 mb-1 phone400:p-7">
            Welcome to Xolace, a platform where you can interact anonymously.
          </p>
        </div>
        <div>
          <Button title="Welcome" asChild>
            <Link href={"/sign-in"}>
              <RocketIcon className="mr-2 h-4 w-4" />
              Let&apos;s Start
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}
