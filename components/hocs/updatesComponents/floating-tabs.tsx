"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, Rocket, Sparkles } from "lucide-react"
import { motion } from "motion/react"

interface FloatingTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  releasedCount: number
  upcomingCount: number
}

export function FloatingTabs({ activeTab, onTabChange, releasedCount, upcomingCount }: FloatingTabsProps) {
  const tabs = [
    {
      id: "all",
      label: "All",
      icon: <Sparkles className="h-4 w-4" />,
      count: releasedCount + upcomingCount,
    },
    {
      id: "released",
      label: "Released",
      icon: <Rocket className="h-4 w-4" />,
      count: releasedCount,
    },
    {
      id: "upcoming",
      label: "Coming",
      icon: <Clock className="h-4 w-4" />,
      count: upcomingCount,
    },
  ]

  return (
    <div className="sticky top-16 z-40  py-3 bg-gray-50/80 backdrop-blur-md dark:bg-bg-dark/80">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <Badge
              variant={activeTab === tab.id ? "secondary" : "outline"}
              className={`text-xs ${
                activeTab === tab.id
                  ? "bg-white/20 text-white border-white/30"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {tab.count}
            </Badge>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
