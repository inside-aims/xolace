"use client";

import React from "react";
import { motion } from "framer-motion";
import { ImageOffIcon as MaskOffIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import GradientTextLink from "../shared/GradientText/GradientTextLink";

const ChannelAboutCard = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger className="w-full">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <MaskOffIcon className="w-12 h-12 mb-4 text-blue-500 dark:text-blue-400" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
              About Xolace
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Discover our story and mission
            </p>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              💡 About Xolace | Beta
            </DialogTitle>
            <DialogDescription className="hidden">
              Everything you need to know about Xolace
            </DialogDescription>
          </DialogHeader>
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              Welcome to Xolace, where anonymity meets authenticity. Share your
              deepest thoughts and connect with others in a judgment-free zone.
            </p>
            <p>
              Our platform is designed to provide a safe space for
              self-expression and community support. Join us in shaping the
              future of anonymous social interaction.
            </p>
          </div>

          <DialogFooter className="">
          <GradientTextLink text="Explore more" link="/about"/>
        </DialogFooter>
        </DialogContent>

       
      </Dialog>
    </>
  );
};

export default ChannelAboutCard;
