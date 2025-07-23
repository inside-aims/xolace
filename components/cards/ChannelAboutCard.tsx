'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { ImageOffIcon as MaskOffIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
//import GradientTextLink from '../shared/GradientText/GradientTextLink';

const GradientTextLink = dynamic(
  () => import('../shared/GradientText/GradientTextLink'),
  {
    ssr: false,
  },
);

const ChannelAboutCard = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger className="w-full">
          <motion.div
            className="cursor-pointer rounded-lg bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-gray-800"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <MaskOffIcon className="mb-4 h-12 w-12 text-blue-500 dark:text-blue-400" />
            <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
              About Xolace
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Discover our story and mission
            </p>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[95%] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-4 text-2xl font-bold">
              💡 About Xolace | Beta
            </DialogTitle>
            <DialogDescription className="hidden">
              Everything you need to know about Xolace
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
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
            <GradientTextLink text="Explore more" link="/about" />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChannelAboutCard;
