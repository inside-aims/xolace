"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileTextIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ShieldIcon } from 'lucide-react';

const ChannelPoliciesCard = () => {
  return (
    <>
       <Link href="/policy">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 text-center"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <ShieldIcon className="w-12 h-12 mb-4 text-green-500 dark:text-green-400" />
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Policies</h2>
        <p className="text-gray-600 dark:text-gray-300">Learn about our security and terms</p>
      </motion.div>
    </Link>
    </>
  );
};

export default ChannelPoliciesCard;
