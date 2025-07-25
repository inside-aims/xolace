'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';

interface LogoutIconProps {
  className?: string;
  height?: string;
  width?: string;
}

const pathVariants: Variants = {
  animate: {
    x: 2,
    translateX: [0, -3, 0],
    transition: {
      duration: 0.4,
    },
  },
};

const LogoutIcon = ({
  className,
  height = '25',
  width = '25',
}: LogoutIconProps) => {
  const controls = useAnimation();

  return (
    <div
      className={`hover:bg-accent flex cursor-pointer items-center justify-center rounded-md transition-colors duration-200 select-none ${className}`}
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
      onClick={() => controls.start('animate')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <motion.polyline
          points="16 17 21 12 16 7"
          variants={pathVariants}
          animate={controls}
        />
        <motion.line
          x1="21"
          x2="9"
          y1="12"
          y2="12"
          variants={pathVariants}
          animate={controls}
        />
      </svg>
    </div>
  );
};

export { LogoutIcon };
