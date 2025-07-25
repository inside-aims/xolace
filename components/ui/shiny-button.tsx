'use client';
import React from 'react';
import {
  motion,
  type HTMLMotionProps,
  type Transition,
} from 'motion/react';
import { cn } from '@/lib/utils';

const animationProps = {
  initial: { '--x': '100%', scale: 0.8 },
  animate: { '--x': '-100%', scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: 'loop',
    repeatDelay: 1,
    type: 'spring',
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: 'spring',
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  } as Transition,
};

interface ShinyButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
}

const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        {...animationProps}
        {...props}
        className={cn(
          'bg-ocean-600! relative rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,#0536ff,transparent_100%)] dark:hover:shadow-[0_0_20px_hsl(var(--ocean-600)/10%)]',
          className,
        )}
      >
        <span
          className="relative block size-full text-sm tracking-wide text-white uppercase dark:font-light dark:text-white"
          style={{
            maskImage:
              'linear-gradient(-75deg,hsl(var(--ocean-600)) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),hsl(var(--ocean-600)) calc(var(--x) + 100%))',
          }}
        >
          {children}
        </span>
        <span
          style={{
            mask: 'linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))',
            maskComposite: 'exclude',
          }}
          className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,hsl(var(--ocean-600)/10%)_calc(var(--x)+20%),hsl(var(--ocean-600)/50%)_calc(var(--x)+25%),hsl(var(--ocean-600)/10%)_calc(var(--x)+100%))] p-px"
        ></span>
      </motion.button>
    );
  },
);

ShinyButton.displayName = 'ShinyButton';

export default ShinyButton;