"use client"

import { Button } from "@/components/ui/button"
//import { ModeToggle } from "@/components/mode-toggle"
import { Search, Home, FileText, Shield, Users, Brain, AlertTriangle, Scale } from "lucide-react"
import { cn } from "@/lib/utils"
import { XolaceBadgeV1 } from "@/components/shared/xolace-name-badge"
import { Policy } from "@/types"
import { useRouter } from "next/navigation"

interface PolicyNavigationProps {
  policies: Policy[]
  activePolicy: string
  onPolicyChange: (policyId: string) => void
  onSearchOpen: () => void
  className?: string
}

const policyIcons = {
  "community-guidelines": Users,
  "privacy-policy": Shield,
  "terms-of-service": Scale,
  "ai-usage": Brain,
  "reporting-safety": AlertTriangle,
  "user-roles": FileText,
}

export function PolicyNavigation({
  policies,
  activePolicy,
  onPolicyChange,
  onSearchOpen,
  className,
}: PolicyNavigationProps) {
    const router = useRouter()
  return (
    <nav
      className={cn(
        "fixed left-0 top-0 h-full w-80 bg-white/80 dark:bg-bg-dark/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 z-40",
        className,
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <XolaceBadgeV1 className="bg-transparent border-0" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Policies & Guidelines</p>
              </div>
            </div>
            {/* <ModeToggle /> */}
          </div>

          {/* Search */}
          <Button
            variant="outline"
            className="w-full justify-start text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={onSearchOpen}
          >
            <Search className="w-4 h-4 mr-2" />
            Search policies...
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {policies.map((policy) => {
              const IconComponent = policyIcons[policy.id as keyof typeof policyIcons] || FileText
              const isActive = activePolicy === policy.id

              return (
                <button
                  key={policy.id}
                  onClick={() => onPolicyChange(policy.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-ocean-500/10 to-lavender-500/10 border border-ocean-200 dark:border-ocean-800 text-ocean-700 dark:text-ocean-300"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isActive
                        ? "bg-gradient-to-br from-ocean-500 to-lavender-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
                    )}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{policy.title}</h3>
                    <p className="text-xs opacity-70 mt-1">{policy.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <Button onClick={() => router.back()} variant="ghost" className="w-full justify-start">
            <Home className="w-4 h-4 mr-2" />
            Back to Xolace
          </Button>
        </div>
      </div>
    </nav>
  )
}
