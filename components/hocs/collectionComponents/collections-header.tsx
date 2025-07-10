import { BookOpen, Sparkles, Star, Zap } from "lucide-react"

export function CollectionsHeader() {
  return (
    <div className="relative text-center space-y-4 sm:space-y-6 py-4 sm:py-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-1/4 w-2 h-2 bg-[#6a71ea] rounded-full animate-pulse opacity-60" />
        <div className="absolute top-8 right-1/3 w-1 h-1 bg-[#0536ff] rounded-full animate-ping opacity-40" />
        <div className="absolute bottom-4 left-1/3 w-1.5 h-1.5 bg-[#6a71ea] rounded-full animate-pulse opacity-50" />
        <div className="absolute bottom-8 right-1/4 w-1 h-1 bg-[#0536ff] rounded-full animate-ping opacity-30" />
      </div>

      <div className="relative">
        {/* Main icon cluster */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0536ff] to-[#6a71ea] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
            <div className="relative bg-gradient-to-br from-[#0536ff] to-[#6a71ea] p-3 sm:p-4 rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#6a71ea] absolute -top-1 -right-1 animate-pulse" />
          </div>

          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#6a71ea] animate-pulse" />
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-[#0536ff] animate-bounce" />
          </div>
        </div>

        {/* Title with enhanced styling */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#0536ff] via-[#6a71ea] to-[#0536ff] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Your Collections
          </h1>

          {/* Subtitle with better mobile spacing */}
          <div className="space-y-1 sm:space-y-2">
            <p className="text-gray-400 text-sm sm:text-base max-w-sm sm:max-w-md mx-auto leading-relaxed px-4 sm:px-0">
              Curate your journey of growth and inspiration
            </p>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
              <div className="w-1 h-1 bg-[#6a71ea] rounded-full animate-pulse" />
              <span>Organize • Discover • Reflect</span>
              <div className="w-1 h-1 bg-[#0536ff] rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Decorative line */}
        <div className="mt-4 sm:mt-6 flex items-center justify-center">
          <div className="h-px bg-gradient-to-r from-transparent via-[#6a71ea] to-transparent w-24 sm:w-32 opacity-50" />
        </div>
      </div>
    </div>
  )
}
