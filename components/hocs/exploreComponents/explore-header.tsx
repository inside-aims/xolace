import { Compass, Sparkles, TrendingUp, Zap } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"

export function ExploreHeader() {
  const decorativeElements = (
    <>
      <div className="absolute top-6 left-1/5 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce opacity-40" />

    </>
  )

  const customContent = (
    <div className="mt-4 sm:mt-6">
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        <div className="flex flex-col items-center gap-1 sm:gap-2">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#6a71ea] animate-pulse" />
          <span className="text-xs text-gray-500">Trending</span>
        </div>

        <div className="flex flex-col items-center gap-1 sm:gap-2">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#0536ff] animate-bounce" />
          <span className="text-xs text-gray-500">Discover</span>
        </div>

        <div className="flex flex-col items-center gap-1 sm:gap-2">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#6a71ea] animate-pulse" />
          <span className="text-xs text-gray-500">Connect</span>
        </div>
      </div>
    </div>
  )

  return (
    <PageHeader
      title="Explore the Shadows"
      description="Discover authentic stories and experiences from our vibrant community"
      icon={Compass}
      decorativeElements={decorativeElements}
      customContent={customContent}
      gradient={{ from: "#0536ff", via: "#6a71ea", to: "#8b5cf6" }}
    />
  )
}
