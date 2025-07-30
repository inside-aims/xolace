import Image from "next/image";
import React from "react";

export const ProceedingState = () => {
  return (
    <div
      className="relative flex flex-col bg-white rounded-2xl w-full max-w-5xl h-[70vh] md:h-[60vh] overflow-hidden items-center justify-center p-8 gap-6 text-center">
      {/* Glowing image + message */}
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
        <span className="text-lg text-neutral-500 font-medium tracking-wide">
         {"Thanks for joining, your seat by the fire is almost ready"}
          <span className="inline-block animate-dots ml-1">.</span>
        </span>
      </div>

      <div className="absolute top-0 inset-x-1 h-1 bg-white overflow-hidden">
        <div
          className="absolute w-[200%] h-full bg-gradient-to-r from-lavender-400 via-lavender-500 to-lavender-400 animate-slide"/>
      </div>
    </div>
  )
}