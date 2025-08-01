"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";
import {useRouter} from "next/navigation";

export const FinishedState = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSubmitted(true);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = () => {
    router.push("/feed")
  }

  return (
    <div
      className="relative flex flex-col bg-white rounded-2xl w-full max-w-5xl h-[70vh] md:h-[60vh] overflow-hidden items-center justify-center p-8 gap-6 text-center dark:bg-gray-600 text-foreground ">

      <div className="flex flex-col items-center justify-center gap-4">
        <div className="animate-bounce-scale">
          <Image
            src={"/assets/images/mas.webp"}
            alt={"Xolace logo"}
            width={160}
            height={160}
            className="w-48 h-48"
          />
        </div>

        {!isSubmitted ? (
          <span className="text-lg text-neutral-500 dark:text-neutral-300 font-medium tracking-wide">
            Submitting<span className="inline-block animate-dots ml-1">.</span>
          </span>
        ) : (
          <>
            <span className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300">Done!</span>
            <span className="text-lg text-neutral-500 dark:text-neutral-300">Thank you for joining our circle.</span>
            <Button
              onClick={handleNavigation}
              className="group relative overflow-hidden border sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-lavender-500 dark:bg-lavender-500 dark:border-lavender-500 text-white hover:text-white rounded-lg font-medium text-sm sm:text-base transition-colors duration-300 ease-in-out"
              variant="outline"
            >
              <span
                className="absolute inset-0 bg-lavender-600 transform scale-x-0 origin-left transition-transform duration-500 ease-in-out group-hover:scale-x-100"
                aria-hidden="true"
              />
              <span className="relative z-10 flex items-center gap-2">
                <span
                  className="transition-all duration-500 ease-in-out transform group-hover:scale-105 group-hover:-translate-y-0.5">
                 Back to Xolace
                </span>
                <ArrowRight
                  className="h-4 w-4 -translate-x-1 group-hover:translate-x-0 transition-all duration-500 ease-in-out group-hover:scale-110"/>
              </span>
            </Button>
          </>
        )}
      </div>

      {isSubmitted ? (
        <div className="absolute top-0 inset-x-1 h-1 bg-white overflow-hidden">
          <div className="absolute w-[200%] h-full bg-gradient-to-r from-lavender-400 via-lavender-500 to-lavender-400 "/>
        </div>
        ) : (
        <div className="absolute top-0 inset-x-1 h-1 bg-white overflow-hidden">
          <div className="absolute w-[200%] h-full bg-gradient-to-r from-lavender-400 via-lavender-500 to-lavender-400 animate-slide"/>
        </div>
      )}
    </div>
  );
};
