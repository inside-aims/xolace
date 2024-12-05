"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BetaBadgeProps {
  progress?: number;
}

export function ProgressBetaBadge({ progress }: BetaBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="relative overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <svg
              width="60"
              height="30"
              viewBox="0 0 60 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="badge-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#E11D48" />
                </linearGradient>
              </defs>
              <rect width="60" height="30" rx="6" fill="url(#badge-gradient)" />
              <rect
                x="1"
                y="1"
                width="58"
                height="28"
                rx="5"
                fill="white"
                fillOpacity="0.2"
              />
            </svg>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="dark:text-white text-black font-bold text-xs backdrop-blur-sm dark:bg-sky-400/10 bg-sky-500/60 px-2 py-1 rounded">
                β {Math.round(progress || 20)}%
              </div>
            </motion.div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p>
            Xolace is in beta <span className="text-sky-400">@{progress || 20}%</span> to full release. Your feedback
            helps the team improve the app! ⚗️{" "}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
