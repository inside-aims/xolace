"use client"

import { motion } from "motion/react"
import { Clock, Tag, User, ExternalLink, MoveLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { useNotificationDetails } from "@/hooks/notifications/useNotifications"
import { NotificationMetadataWithLink } from "@/hooks/notifications/useNotificationCardLogic"
import SearchLoader from "../shared/loaders/SearchLoader"


const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-400 bg-red-900/20 border-red-800/50"
    case "medium":
      return "text-yellow-400 bg-yellow-900/20 border-yellow-800/50"
    case "low":
      return "text-green-400 bg-green-900/20 border-green-800/50"
    default:
      return "text-gray-400 bg-gray-800/20 border-gray-700/50"
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "feature_update":
      return "text-blue-400 bg-blue-900/20 border-blue-800/50"
    case "policy_update":
      return "text-purple-400 bg-purple-900/20 border-purple-800/50"
    case "maintenance":
      return "text-orange-400 bg-orange-900/20 border-orange-800/50"
    default:
      return "text-gray-400 bg-gray-800/20 border-gray-700/50"
  }
}

export default function NotificationDetails({ notificationId }: { notificationId: string }) {

  const router = useRouter()
  const { data: notification , isPending, error } = useNotificationDetails({notificationId})

  const handleBack = () => {
    router.back()
  }

  // const handleShare = () => {
  //   if (navigator.share) {
  //     navigator.share({
  //       title: metadata?.title,
  //       text: metadata?.description,
  //       url: window.location.href,
  //     })
  //   } else {
  //     navigator.clipboard.writeText(window.location.href)
  //   }
  // }

  if (isPending) return <SearchLoader/>

  if (error) return <div>Error: {error.message}</div>

  const metadata = notification.metadata as NotificationMetadataWithLink | null;

  return (
    <div className="main-container">
      {/* Header */}
      <header className="w-full px-4 sm:px-6">
          <Button variant="outline" size="sm" className="rounded-full" onClick={handleBack}>
            <MoveLeft className="mr-2 h-4 w-4" />
            Back to Notifications
          </Button>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.article
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-6xl mb-4"
            >
              {metadata?.icon || ""}
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
            >
              {metadata?.title || ""}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              {metadata?.description || ""}
            </motion.p>
          </div>

          {/* Metadata */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm"
          >
            <div className="flex items-center gap-2 text-gray-400">
              <User className="w-4 h-4" />
              <span>{metadata?.author || ""}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <span>📖</span>
              <span>{metadata?.estimated_read_time || ""}</span>
            </div>
          </motion.div>

          {/* Tags and Priority */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                metadata?.priority || "",
              )}`}
            >
              {metadata?.priority.toUpperCase()} PRIORITY
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                metadata?.category || "",
              )}`}
            >
              {metadata?.category.replace("_", " ").toUpperCase()}
            </span>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-400/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-100 dark:bg-gray-900/50 dark:border-gray-700"
          >
            <div
              className="prose prose-invert prose-gray max-w-none text-black/70 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: metadata?.content || "" }}
            />
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 text-gray-400">
              <Tag className="w-4 h-4" />
              <span className="text-sm font-medium">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {metadata?.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 dark:bg-gray-800/50 bg-gray-300/50 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Action Button */}
          {metadata?.action_url && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center pt-4"
            >
              <Button
                className="bg-gradient-to-r from-[#0536ff] to-[#6a71ea] hover:from-[#0536ff]/90 hover:to-[#6a71ea]/90 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg shadow-[#0536ff]/25"
                onClick={() => router.push(metadata.action_url!)}
              >
                <span>Learn More</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </motion.article>
      </main>
    </div>
  )
}
