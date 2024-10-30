"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileTextIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const ChannelPoliciesCard = () => {
  return (
    <>
      <motion.div
        className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 "
        initial={{ y: 500 }}
        animate={{
          y: 0,
          transition: { duration: 0.5 },
        }}
        viewport={{ once: true }}
      >
        <Link href={"/policy"}>
          <div className="bg-gray-200 dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg flex gap-5 p-5 items-center h-[10px] min-h-[100px] max-h-[120px] sm:h-auto">
            <div className="h-7 w-7">
              <FileTextIcon className=" dark:text-red-500 text-blue w-full h-full" />
            </div>
            <div className=" text-gray-900 dark:text-gray-100">
              <h1 className="text-lg font-bold uppercase">Policies</h1>
              <p className="text-gray-500">Security, Terms & Conditions </p>
            </div>
          </div>
        </Link>
      </motion.div>
    </>
  );
};

export default ChannelPoliciesCard;
