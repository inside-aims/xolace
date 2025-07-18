"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"
import type { VideoSortFilter } from "./videos-section"

interface VideosFilterProps {
  sortFilter: VideoSortFilter
  onSortFilterChange: (filter: VideoSortFilter) => void
}

export function VideosFilter({ sortFilter, onSortFilterChange }: VideosFilterProps) {
  const filterLabels = {
    recent: "Most Recent",
    "most-liked": "Most Liked",
  }

  return (
    <div className="flex items-center justify-between px-3">
      <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-white">Videos</h2>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white backdrop-blur-sm"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="hidden sm:inline">{filterLabels[sortFilter]}</span>
            <span className="sm:hidden">Sort</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 dark:bg-gray-900 border-gray-700">
          <DropdownMenuRadioGroup
            value={sortFilter}
            onValueChange={(value) => onSortFilterChange(value as VideoSortFilter)}
          >
            <DropdownMenuRadioItem value="recent" className="dark:text-gray-300 focus:bg-gray-800 focus:text-white">
              Most Recent
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="most-liked" className="dark:text-gray-300 focus:bg-gray-800 focus:text-white">
              Most Liked
            </DropdownMenuRadioItem>
            {/* <DropdownMenuRadioItem value="most-viewed" className="dark:text-gray-300 focus:bg-gray-800 focus:text-white">
              Most Viewed
            </DropdownMenuRadioItem> */}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
