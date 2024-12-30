"use client";

import React from "react";
import { motion } from "framer-motion";
import { LapTimerIcon } from "@radix-ui/react-icons";

const ChannelUpdateCard = () => {
  return (
    <>
      <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 text-center relative"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <LapTimerIcon className="text-blue dark:text-red-500 w-12 h-12" />
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Updates</h2>
      <p className="text-gray-600 dark:text-gray-300">Stay informed about new features</p>
      <span className=" absolute top-2 right-2 bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-sky-200 dark:text-sky-800">
        New
      </span>
    </motion.div>
    </>
  );
};

export default ChannelUpdateCard;
