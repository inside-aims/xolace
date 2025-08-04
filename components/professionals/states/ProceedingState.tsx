import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const ProceedingState = () => {
  return (
    <div className="text-foreground relative flex h-[70vh] w-full max-w-5xl flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl bg-white p-8 text-center md:h-[60vh] dark:bg-gray-600">
      {/* Glowing image + message */}
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="animate-bounce-scale">
          {/* <Image
            src={"/assets/images/mas.webp"}
            alt={"Xolace logo"}
            width={160}
            height={160}
            className="w-48 h-48"
          /> */}
          <DotLottieReact
            src="https://lottie.host/8586490e-8c75-47c6-afc2-c8f2a6f10682/hYjxZaYm6a.lottie"
            loop
            autoplay
            style={{ width: '160px', height: '160px' }}
          />
        </div>
        <span className="text-lg font-medium tracking-wide text-neutral-500 dark:text-neutral-300">
          {'Thanks for joining, your seat by the fire is almost ready'}
          <span className="animate-dots ml-1 inline-block">.</span>
        </span>
      </div>

      <div className="absolute inset-x-1 top-0 h-1 overflow-hidden bg-white">
        <div className="from-lavender-400 via-lavender-500 to-lavender-400 animate-slide absolute h-full w-[200%] bg-gradient-to-r" />
      </div>
    </div>
  );
};
