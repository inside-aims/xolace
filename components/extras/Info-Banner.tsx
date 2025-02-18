'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export function InfoBanner() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 50], [1, 0]);
  const y = useTransform(scrollY, [0, 50], [0, -100]);

  return (
    <motion.div
      className="fixed left-0 right-0 top-20 z-40 text-primary-foreground"
      style={{ opacity, y }}
    >
      <div className="container mx-auto px-4">
        <div className="rounded-lg bg-gradient-to-r from-purple-400/30 via-sky-500/30 to-red-500/30 shadow-lg backdrop-blur-md">
          <div className="px-4 text-center text-xs font-semibold text-black dark:text-white">
            Xolace Beta - Your feedback shapes our future! 🌟
          </div>
        </div>
      </div>
    </motion.div>
  );
}
