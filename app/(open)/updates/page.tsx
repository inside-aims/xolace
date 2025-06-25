"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Sparkles, Rocket, Activity, Zap, RefreshCw, Clock, MessageCircle } from "lucide-react"
import { useState } from "react"
import { getVersionColor } from "@/utils/helpers/updateHelpers";
import { updates } from "@/constants/changeLogs";
import { MobileHeader } from "@/components/hocs/updatesComponents/mobile-header";
import { FloatingTabs } from "@/components/hocs/updatesComponents/floating-tabs"
import { TimelineView } from "@/components/hocs/updatesComponents/timeline-view"

const upcomingFeatures = [
  {
    title: "AI Wellness Coach",
    description: "Personalized AI-powered wellness recommendations",
    eta: "Q2 2025",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Voice Journaling",
    description: "Record and transcribe your thoughts with voice notes",
    eta: "Q3 2025",
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    title: "Wellness Analytics",
    description: "Advanced insights into your wellness patterns",
    eta: "Q3 2025",
    icon: <Activity className="h-5 w-5" />,
  },
]

const getVersionIcon = (type: string) => {
  switch (type) {
    case "major":
      return <Rocket className="h-5 w-5" />
    case "minor":
      return <Sparkles className="h-5 w-5" />
    case "patch":
      return <Zap className="h-5 w-5" />
    default:
      return <RefreshCw className="h-5 w-5" />
  }
}



const parseChanges = (changes: string[]) => {
  return changes.map((change, index) => {
    if (change.startsWith("**") && change.endsWith("**")) {
      return (
        <h4 key={index} className="font-semibold text-lg mt-4 mb-2 text-foreground">
          {change.replace(/\*\*/g, "")}
        </h4>
      )
    }
    return (
      <p key={index} className="text-muted-foreground mb-1 leading-relaxed">
        {change}
      </p>
    )
  })
}

export default function UpdatesPage() {
  const [selectedTab, setSelectedTab] = useState("all")

  const releasedUpdates = updates.filter((update) => update.status === "released")
  const upcomingUpdates = updates.filter((update) => update.status === "upcoming")

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <MobileHeader />

      <div className="container mx-auto px-4 py-12">
        <FloatingTabs activeTab={selectedTab} onTabChange={setSelectedTab} releasedCount={releasedUpdates.length} upcomingCount={upcomingUpdates.length} />
        <TimelineView updates={getUpdatesForTab()} showUpcomingFeatures={selectedTab === "upcoming"} />
      </div>
    </div>
  )
}