"use client"
import { FileText, Video } from "lucide-react"
import type { TabType, CollectionFilter } from "@/app/(protected)/collections/collections"

interface CollectionsTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  collectionFilter?: CollectionFilter
  onCollectionFilterChange?: (filter: CollectionFilter) => void
}

export function CollectionsTabs({
  activeTab,
  onTabChange,
}: CollectionsTabsProps) {
  return (
    <div className="sticky top-0 z-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-6 py-4 gap-4 sm:gap-0">
        {/* Tab switcher - centered on mobile */}
        <div className="flex items-center justify-center sm:justify-start">
          <div className="relative flex dark: rounded-full p-1 backdrop-blur-sm border dark:bg-gray-900/50 dark:border-gray-800">
            <button
              onClick={() => onTabChange("posts")}
              className={`relative flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-medium transition-all duration-300 min-w-[100px] sm:min-w-[120px] justify-center ${
                activeTab === "posts"
                  ? "bg-gradient-to-r from-[#0536ff] to-[#6a71ea] text-white shadow-lg shadow-[#0536ff]/25"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden xs:inline">Posts</span>
              {activeTab === "posts" && (
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-[#0536ff] to-[#6a71ea] rounded-full" />
              )}
            </button>
            <button
              onClick={() => onTabChange("videos")}
              className={`relative flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-medium transition-all duration-300 min-w-[100px] sm:min-w-[120px] justify-center ${
                activeTab === "videos"
                  ? "bg-gradient-to-r from-[#0536ff] to-[#6a71ea] text-white shadow-lg shadow-[#0536ff]/25"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Video className="w-4 h-4" />
              <span className="hidden xs:inline">Videos</span>
              {activeTab === "videos" && (
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-[#0536ff] to-[#6a71ea] rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Filter dropdown - full width on mobile */}
        {/* <div className="flex justify-center sm:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white backdrop-blur-sm w-full sm:w-auto justify-center sm:justify-start"
              >
                <Filter className="w-4 h-4" />
                <span className="truncate">
                  {collectionFilter === "all"
                    ? "All Collections"
                    : collectionFilter === "favorites"
                      ? "Favorites"
                      : collectionFilter === "save-for-later"
                        ? "Save for Later"
                        : "Inspiration"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-700">
              <DropdownMenuRadioGroup
                value={collectionFilter}
                onValueChange={(value) => onCollectionFilterChange(value as CollectionFilter)}
              >
                <DropdownMenuRadioItem value="all" className="text-gray-300 focus:bg-gray-800 focus:text-white">
                  All Collections
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="favorites" className="text-gray-300 focus:bg-gray-800 focus:text-white">
                  Favorites
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="save-for-later"
                  className="text-gray-300 focus:bg-gray-800 focus:text-white"
                >
                  Save for Later
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="inspiration" className="text-gray-300 focus:bg-gray-800 focus:text-white">
                  Inspiration
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
      </div>
    </div>
  )
}
