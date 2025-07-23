'use client';

import { motion } from 'motion/react';
import { Compass } from 'lucide-react'; // Using Lucide Icons for a tour guide feel

export default function TourGuideButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Icon inside the button */}
      <Compass className="h-8 w-8" />

      {/* Pulsating Effect */}
      <motion.span
        className="absolute h-full w-full rounded-full bg-blue-500 opacity-50"
        animate={{
          scale: [1, 1.5],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.button>
  );
}
