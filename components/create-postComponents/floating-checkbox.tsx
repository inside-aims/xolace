'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock } from 'lucide-react';

interface FloatingCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string
}

const Hours = () => <p className="text-[9px]">24h</p>;

export const FloatingCheckbox = React.memo(function FloatingCheckbox({
  checked,
  onCheckedChange,
  id
}: FloatingCheckboxProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverStart = useCallback(() => setIsHovered(true), []);
  const handleHoverEnd = useCallback(() => setIsHovered(false), []);

  return (
    <motion.div
      className="absolute right-2 top-0 flex cursor-pointer items-center space-x-2 rounded-full bg-background/80 p-2 backdrop-blur-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      id={id}
    >
      <Checkbox
        id="24-hour-mode"
        indicator={<Hours />}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-amber-300 data-[state=checked]:text-primary-foreground"
      />
      <Clock
        className={`h-4 w-4 transition-colors ${checked ? 'text-primary' : 'text-muted-foreground'}`}
      />
      <AnimatePresence>
        {(isHovered || checked) && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden whitespace-nowrap text-xs font-medium"
          >
            24h post
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
