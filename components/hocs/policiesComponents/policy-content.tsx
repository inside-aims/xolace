"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, PrinterIcon as Print, Share2, BookOpen } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { TableOfContents } from "./table-of-content"

interface PolicyContentProps {
  policy: any
  activeSection: string
  onSectionChange: (sectionId: string) => void
}

export function PolicyContent({ policy, activeSection, onSectionChange }: PolicyContentProps) {
  const [readingTime, setReadingTime] = useState(0)

  useEffect(() => {
    // Calculate reading time (average 200 words per minute)
    const wordCount = policy.content.split(/\s+/).length
    setReadingTime(Math.ceil(wordCount / 200))
  }, [policy.content])

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: policy.title,
          text: policy.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <article className="max-w-none">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
            {policy.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Version {policy.version}
          </Badge>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
          {policy.title}
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{policy.description}</p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400 mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Updated {policy.lastUpdated}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>{policy.sections?.length || 0} sections</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Print className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </header>

      {/* Table of Contents - Mobile */}
      <div className="xl:hidden mb-12">
        <TableOfContents
          sections={policy.sections || []}
          activeSection={activeSection}
          onSectionClick={onSectionChange}
        />
      </div>

      {/* Content */}
      <div className="prose prose-slate dark:prose-invert prose-sm max-w-none">
        <ReactMarkdown>{policy.content}</ReactMarkdown>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Questions about this policy?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            We're here to help. If you have any questions about our policies or need clarification on any point, don't
            hesitate to reach out.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Contact Support</Button>
            <Button variant="outline">View All Policies</Button>
          </div>
        </div>
      </footer>
    </article>
  )
}
