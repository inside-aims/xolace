"use client";

import React from "react";
import { motion } from "framer-motion";
import { LapTimerIcon } from "@radix-ui/react-icons";

const ChannelUpdateCard = () => {
  return (
    <>
      <motion.div
        className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 mb-16 pb-5"
        initial={{ y: 900 }}
        animate={{
          y: 0,
          transition: { duration: 0.5 },
        }}
        viewport={{ once: true }}
      >
        <div className="relative bg-gray-200 dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg flex gap-5 p-5 items-center h-[10px] min-h-[100px] max-h-[120px] sm:h-auto">
          <div className=" h-7 w-7">
            <LapTimerIcon className="text-blue dark:text-red-500 w-full h-full" />
          </div>
          <div className=" text-gray-900 dark:text-gray-100">
            <h1 className="text-lg font-bold uppercase">Updates</h1>
            <p className="text-gray-500">Follow all our latest updates</p>
          </div>
          <span className=" absolute right-2 top-2 inline-block whitespace-nowrap rounded-[0.27rem] bg-sky-300 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-gray-900">
            New
          </span>
        </div>
      </motion.div>
    </>
  );
};

export default ChannelUpdateCard;
