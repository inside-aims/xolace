"use client"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TableOfContentsProps {
  sections: Array<{ id: string; title: string; level: number }>
  activeSection: string
  onSectionClick: (sectionId: string) => void
  className?: string
}

export function TableOfContents({ sections, activeSection, onSectionClick, className }: TableOfContentsProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      onSectionClick(sectionId)
    }
  }

  return (
    <div className={cn("bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6", className)}>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Table of Contents</h3>
      <nav className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all duration-200 text-sm",
              section.level === 2 && "pl-2",
              section.level === 3 && "pl-6",
              activeSection === section.id
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300",
            )}
          >
            <ChevronRight
              className={cn("w-3 h-3 transition-transform", activeSection === section.id ? "rotate-90" : "")}
            />
            <span className="flex-1">{section.title}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
