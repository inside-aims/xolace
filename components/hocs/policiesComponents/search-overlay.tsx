"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X, FileText } from "lucide-react"

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  policies: any[]
  onPolicySelect: (policyId: string, sectionId?: string) => void
}

export function SearchOverlay({ isOpen, onClose, policies, onPolicySelect }: SearchOverlayProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchResults: any[] = []
    const queryLower = query.toLowerCase()

    policies.forEach((policy) => {
      // Search in title and description
      if (policy.title.toLowerCase().includes(queryLower) || policy.description.toLowerCase().includes(queryLower)) {
        searchResults.push({
          type: "policy",
          policy,
          title: policy.title,
          description: policy.description,
          highlight: policy.title.toLowerCase().includes(queryLower) ? "title" : "description",
        })
      }

      // Search in content
      const contentMatches = policy.content.toLowerCase().includes(queryLower)
      if (contentMatches) {
        // Extract context around the match
        const contentLower = policy.content.toLowerCase()
        const matchIndex = contentLower.indexOf(queryLower)
        const start = Math.max(0, matchIndex - 50)
        const end = Math.min(policy.content.length, matchIndex + query.length + 50)
        const context = policy.content.slice(start, end)

        searchResults.push({
          type: "content",
          policy,
          title: policy.title,
          context,
          highlight: "content",
        })
      }
    })

    setResults(searchResults.slice(0, 10)) // Limit results
  }, [query, policies])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="w-full max-w-2xl mx-4">
        <div className="bg-white dark:bg-bg-dark rounded-2xl shadow-2xl border border-slate-200 dark:border-bg-dark/50 overflow-hidden">
          {/* Search Header */}
          <div className="flex items-center gap-4 p-6 border-b border-slate-200 dark:border-slate-700">
            <Search className="w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search policies and guidelines..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent text-lg focus-visible:ring-0"
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {query.trim() === "" ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start typing to search through our policies and guidelines</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-2">Try different keywords or browse our policies directly</p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {results.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => onPolicySelect(result.policy.id)}
                    className="w-full text-left p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{result.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {result.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {result.type === "content" ? result.context : result.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Press ESC to close</span>
              <span>{results.length} results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
