'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface BetaBadgeProps {
  progress?: number
}

export function ProgressBetaBadge({ progress }: BetaBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold text-sm shadow-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            Beta {Math.round(progress || 20)}%
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p>This app is in beta. Your feedback helps shape its future!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

