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
import type { PostSortFilter } from "./post-section"

interface PostsFilterProps {
  sortFilter: PostSortFilter
  onSortFilterChange: (filter: PostSortFilter) => void
}

export function PostsFilter({ sortFilter, onSortFilterChange }: PostsFilterProps) {
  const filterLabels = {
    recent: "Most Recent",
    "most-upvoted": "Most Upvoted",
    "most-commented": "Most Commented",
  }

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-gray-300">Posts</h2>

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
        <DropdownMenuContent align="end" className="w-40 dark:bg-gray-900 dark:border-gray-700">
          <DropdownMenuRadioGroup
            value={sortFilter}
            onValueChange={(value) => onSortFilterChange(value as PostSortFilter)}
          >
            <DropdownMenuRadioItem value="recent" className="dark:text-gray-300 focus:bg-gray-800 focus:text-white">
              Most Recent
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="most-upvoted" className="dark:text-gray-300 focus:bg-gray-800 focus:text-white">
              Most Upvoted
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="most-commented" className="dark:text-gray-300 focus:bg-gray-800 focus:text-white">
              Most Commented
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
