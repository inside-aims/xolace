'use client';

// import { Button } from "@/components/ui/button"
import { HelpCircle } from 'lucide-react';
import { useTour } from '@reactour/tour';
import { motion } from 'framer-motion';

export default function TourButton() {
  const { setIsOpen } = useTour();
  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="bg-blue relative flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110 md:hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Icon inside the button */}
        <HelpCircle className="h-6 w-6" />
        {/* <Binoculars size={20} strokeWidth={2.25} color="#342adb" /> */}
        {/* Pulsating Effect */}
        <motion.span
          className="bg-sky-500 absolute h-full w-full rounded-full opacity-60"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'reverse',
          }}
        />
      </motion.button>

      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative hidden items-center justify-center rounded-full bg-sky-500 h-12 w-32 font-bold text-white shadow-lg transition-colors duration-200 hover:bg-sky-600 md:flex"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <HelpCircle className="mr-2" />
        Start Tour

        <motion.span
          className="bg-sky-500 absolute h-full w-full rounded-full opacity-50"
          animate={{
            scale: [1, 1.5 , 1],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </motion.button>
    </>
  );
}
