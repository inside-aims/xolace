'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

export function InfoBanner() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 50], [1, 0])
  const y = useTransform(scrollY, [0, 50], [0, -100])

  return (
    <motion.div
      className="fixed top-20 left-0 right-0 bg-primary text-primary-foreground z-40"
      style={{ opacity, y }}
    >
      <div className="container mx-auto px-4 text-center max-sm:text-sm">
        Xolace Beta - Your feedback helps us improve the app
      </div>
    </motion.div>
  )
}

