'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

export function InfoBanner() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 50], [1, 0])
  const y = useTransform(scrollY, [0, 50], [0, -100])

  return (
    <motion.div
      className="fixed top-20 left-0 right-0 text-primary-foreground z-40"
      style={{ opacity, y }}
    >
      <div className="container mx-auto px-4">
        <div className="backdrop-blur-md bg-gradient-to-r from-purple-400/30 via-sky-500/30 to-red-500/30 rounded-lg shadow-lg">
          <div className="px-4 text-center dark:text-white text-black font-semibold text-sm">
            Xolace Beta - Your feedback shapes our future! 🌟
          </div>
        </div>
      </div>
    </motion.div>
  )
}

