"use client"

import { Activity, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export function MobileHeader() {
  const router = useRouter()
  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 dark:bg-bg-dark/95 dark:border-gray-800/50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="dark:bg-muted-dark hover:bg-muted-dark-hover flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-700 no-underline"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Updates</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Digital Campfire</p>
          </div>
        </div>
        {/* <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div> */}
      </div>
    </div>
  )
}
