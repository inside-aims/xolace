'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function XolaceBetaBadge() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full"
        animate={{
          rotate: isHovered ? 360 : 0,
        }}
        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="relative z-10 bg-black text-white px-3 py-1 rounded-full font-bold text-sm uppercase tracking-wider"
        initial={{ scale: 1 }}
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        Xolace Beta
      </motion.div>
      <motion.div
        className="absolute -top-1 -right-1 w-3 h-3 bg-blue rounded-full"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </motion.div>
  )
}

