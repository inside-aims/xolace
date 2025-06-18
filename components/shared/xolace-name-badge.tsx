import React from 'react';
import { cn } from '@/lib/utils';

interface XolaceBadgeProps {
    className?: string
    text?: string
}


export const XolaceBadgeV1 = ({className, text = "Xolace"}: XolaceBadgeProps) => {
  return (
    <div className={cn("inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/60 px-3 py-1 backdrop-blur-sm", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-sm font-bold text-white">
        X
      </div>
      <span className="font-medium text-purple-700">{text}</span>
    </div>
  );
};
