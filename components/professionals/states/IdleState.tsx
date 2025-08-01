'use client';

import React from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";


export const IdleState = ({onJoinCircle} : {onJoinCircle: () => void}) =>
  (
    <>
      <div
        className="relative flex flex-col bg-white rounded-2xl w-full max-w-5xl h-[70vh] md:h-[60vh] overflow-hidden items-start justify-start p-8 gap-2 dark:bg-gray-600 text-foreground">
        <Image
          src={"/assets/images/mas.webp"}
          alt={"xolace logo"}
          width={500}
          height={500}
          className="w-30 h-30"
        />

        <div className="w-full flex flex-col md:flex-row items-start justify-center gap-8 md:gap-4">
          <div className="flex flex-col justify-center items-start w-full md:w-1/2">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-800 dark:text-gray-100">
              Welcome to <span
              className="text-lavender-600 bg-gradient-to-r from-indigo-600 dark:from-pink-600 via-lavender-600 dark:via-yellow-600 to-teal-500 bg-clip-text text-transparent">Xolace</span>
            </h1>
            <p className="mt-2 w-full md:w-[70%] text-base text-gray-600 dark:text-neutral-300">
              Your voice. Our fire. Speak freely.
            </p>
          </div>

          <div className="flex flex-col justify-center items-start w-full md:w-1/2">
            <h2 className="text-2xl font-semibold tracking-tight ">
              Your Expertise. Our Platform.
            </h2>
            <p className="text-gray-600 dark:text-neutral-300 mt-2 w-full md:w-[70%] text-base">
              Join a trusted platform to offer thoughtful, private support
              where empathy meets modern connection.
            </p>
          </div>
        </div>
        <div className="absolute bottom-8 right-8">
          <Button
            onClick={onJoinCircle}
            className="group relative overflow-hidden border dark:border-lavender-500 sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-lavender-500 dark:bg-lavender-500 text-white hover:text-white rounded-lg font-medium text-sm sm:text-base transition-colors duration-300 ease-in-out"
            variant="outline"
          >
              <span
                className="absolute inset-0 bg-lavender-600 transform scale-x-0 origin-left transition-transform duration-500 ease-in-out group-hover:scale-x-100"
                aria-hidden="true"
              />
            <span className="relative z-10 flex items-center gap-2">
                <span
                  className="transition-all duration-500 ease-in-out transform group-hover:scale-105 group-hover:-translate-y-0.5">
                 Join the Circle
                </span>
                <ArrowRight
                  className="h-4 w-4 -translate-x-1 group-hover:translate-x-0 transition-all duration-500 ease-in-out group-hover:scale-110"/>
              </span>
          </Button>
        </div>
      </div>

      <div className="flex w-full max-w-5xl text-gray-500 text-sm items-center justify-between px-2">
        <p/>
        <p className="flex items-center gap-2 md:gap-4">
          {["Help", "Privacy", "Terms"].map((option, index) => (
            <span key={index} className={"flex hover:underline cursor-pointer"}>{option}</span>
          ))}
        </p>
      </div>
    </>
  )

