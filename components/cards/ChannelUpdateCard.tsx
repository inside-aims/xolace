'use client';

import React from 'react';
import { motion } from 'motion/react';
import { LapTimerIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const ChannelUpdateCard = () => {
  return (
    <>
      <Link href="/updates">
        <motion.div
          className="relative cursor-pointer rounded-lg bg-white p-6 text-center shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-gray-800"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <LapTimerIcon className="text-blue h-12 w-12 dark:text-red-500" />
          <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
            Updates
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Stay informed about new features
          </p>
          <span className="absolute top-2 right-2 rounded bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-800 dark:bg-sky-200 dark:text-sky-800">
            New
          </span>
        </motion.div>
      </Link>
    </>
  );
};

export default ChannelUpdateCard;
