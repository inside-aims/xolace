'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function XolaceBetaBadge() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
        animate={{
          rotate: isHovered ? 360 : 0,
        }}
        transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
      />
      <motion.div
        className="relative z-10 rounded-full bg-black px-3 py-1 text-sm font-bold uppercase tracking-wider text-white"
        initial={{ scale: 1 }}
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
      >
        Xolace Beta
      </motion.div>
      <motion.div
        className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-blue"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </motion.div>
  );
}
