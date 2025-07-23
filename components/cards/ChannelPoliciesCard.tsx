'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ShieldIcon } from 'lucide-react';

const ChannelPoliciesCard = () => {
  return (
    <>
      <Link href="/policies">
        <motion.div
          className="cursor-pointer rounded-lg bg-white p-6 text-center shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-gray-800"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShieldIcon className="mb-4 h-12 w-12 text-green-500 dark:text-green-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
            Policies
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Learn about our security and terms
          </p>
        </motion.div>
      </Link>
    </>
  );
};

export default ChannelPoliciesCard;
