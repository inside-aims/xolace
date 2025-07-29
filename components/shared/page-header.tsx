import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  icon?: LucideIcon
  decorativeElements?: ReactNode
  gradient?: {
    from: string
    via?: string
    to: string
  }
  darkGradient?: {
    from: string
    via?: string
    to: string
  }
  customContent?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  description,
  icon: Icon,
  decorativeElements,
  gradient = { from: "#0536ff", via: "#6a71ea", to: "#0536ff" },
  darkGradient = { from: "#fffffa", via: "#C0C0C0", to: "#fffffa" },
  customContent,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`relative text-center space-y-4 sm:space-y-6 py-1 sm:py-3 ${className}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-4 left-1/3 w-1.5 h-1.5 bg-[#6a71ea] rounded-full animate-pulse opacity-50" />
        <div className="absolute bottom-8 right-1/4 w-1 h-1 bg-[#0536ff] rounded-full animate-ping opacity-30" />
        {decorativeElements}
      </div>

      <div className="relative">
        {/* Icon section */}
        {Icon && (
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="relative group">
              <div
                className="absolute inset-0 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.via || gradient.to}, ${gradient.to})`,
                }}
              />
              <div
                className="relative p-3 sm:p-4 rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                style={{
                  background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.via || gradient.to}, ${gradient.to})`,
                }}
              >
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Title section */}
        <div className="space-y-2 sm:space-y-3">
          <h1
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] bg-gradient-to-r from-[${gradient.from}] via-[${gradient.via || gradient.to}] to-[${gradient.to}] dark:bg-gradient-to-r dark:from-[${darkGradient.from}] dark:via-[${darkGradient.via || darkGradient.to}] dark:to-[${darkGradient.to}]`}
          >
            {title}
          </h1>

          {subtitle && <h2 className="text-lg sm:text-xl text-gray-300 font-medium">{subtitle}</h2>}

          {/* Description */}
          {description && (
            <div className="space-y-1 sm:space-y-2">
              <p className="text-gray-400 text-sm sm:text-base max-w-sm sm:max-w-md mx-auto leading-relaxed px-4 sm:px-0">
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Custom content */}
        {customContent}

        {/* Decorative line */}
        <div className="mt-4 sm:mt-6 flex items-center justify-center">
          <div
            className="h-px w-24 sm:w-32 opacity-50"
            style={{
              background: `linear-gradient(to right, transparent, ${gradient.via || gradient.to}, transparent)`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
