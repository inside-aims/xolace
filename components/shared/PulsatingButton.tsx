"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react"; // Using Lucide Icons for a tour guide feel

export default function TourGuideButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Icon inside the button */}
      <Compass className="w-8 h-8" />

      {/* Pulsating Effect */}
      <motion.span
        className="absolute w-full h-full bg-blue-500 rounded-full opacity-50"
        animate={{
          scale: [1, 1.5],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
}
