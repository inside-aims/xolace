import React from "react";
import { AnimatePresence, motion } from 'motion/react';

export const ShadowBtn = (
  { value, icon, onClick, className, disabled = false }:
    { value: string | number; icon?: React.ReactNode; onClick?: () => void; className?: string, disabled?: boolean }
) => {
  return(
    <button
      className={`flex items-center px-4 py-[6px] shadow-md rounded-2xl border border-neutral-200 text-gray-600 dark:text-white gap-2 cursor-pointer hover:shadow-lg text-sm transition-colors ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{icon && (icon)}</span> 
       <AnimatePresence mode="wait">
                <motion.span
                  key={value}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="min-w-[2ch] text-center font-button-small"
                  id="value-count"
                >
                  {value}
                </motion.span>
              </AnimatePresence>
    </button>
  )
}