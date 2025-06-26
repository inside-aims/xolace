"use client"

import { useState } from "react"
import { updates } from "@/constants/changeLogs";
import { MobileHeader } from "@/components/hocs/updatesComponents/mobile-header";
import { FloatingTabs } from "@/components/hocs/updatesComponents/floating-tabs"
import { TimelineView } from "@/components/hocs/updatesComponents/timeline-view"


export default function UpdatesPage() {
  const [selectedTab, setSelectedTab] = useState("all")

  const releasedUpdates = updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).filter((update) => update.status === "released")
  const upcomingUpdates = updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).filter((update) => update.status === "upcoming")

  const getUpdatesForTab = () => {
    switch (selectedTab) {
      case "released":
        return releasedUpdates
      case "upcoming":
        return upcomingUpdates
      default:
        return updates
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-bg-dark dark:via-bg-dark/90 dark:to-bg-dark/90">
      {/* Header */}
      <MobileHeader />

      <div className="container mx-auto px-4 py-12">
        <FloatingTabs activeTab={selectedTab} onTabChange={setSelectedTab} releasedCount={releasedUpdates.length} upcomingCount={upcomingUpdates.length} />
        <TimelineView updates={getUpdatesForTab()} showUpcomingFeatures={selectedTab === "upcoming"} />
      </div>
    </div>
  )
}