"use client"

import { Button } from "@/components/ui/button"
//import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, Search, Home, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavigationProps {
  policies: any[]
  activePolicy: string
  onPolicyChange: (policyId: string) => void
  onSearchOpen: () => void
  isOpen: boolean
  onToggle: (open: boolean) => void
  className?: string
}

export function MobileNavigation({
  policies,
  activePolicy,
  onPolicyChange,
  onSearchOpen,
  isOpen,
  onToggle,
  className,
}: MobileNavigationProps) {
  const currentPolicy = policies.find((p) => p.id === activePolicy)

  return (
    <>
      {/* Mobile Header */}
      <header
        className={cn(
          "sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700",
          className,
        )}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => onToggle(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-slate-100">Xolace Policies</h1>
              {currentPolicy && (
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{currentPolicy.title}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onSearchOpen}>
              <Search className="w-4 h-4" />
            </Button>
            {/* <ModeToggle /> */}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={() => onToggle(false)}>
          <div
            className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Xolace</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Policies & Guidelines</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-2">
                  {policies.map((policy) => (
                    <button
                      key={policy.id}
                      onClick={() => {
                        onPolicyChange(policy.id)
                        onToggle(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200",
                        activePolicy === policy.id
                          ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
                      )}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{policy.title}</h3>
                        <p className="text-xs opacity-70 mt-1 line-clamp-2">{policy.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Xolace
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
