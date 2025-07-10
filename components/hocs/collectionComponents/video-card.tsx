import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Heart, Eye, Clock, Bookmark } from "lucide-react"
import Image from "next/image"

interface Video {
  id: string
  created_at: string
  title: string
  description: string
  thumbnail_url: string
  author_name: string
  author_avatar_url: string
  views: number
  likes_count: number
  duration: number
  collection_name: string
}

interface VideoCardProps {
  video: Video
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

function formatViews(views: number): string {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k`
  }
  return views.toString()
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg hover:shadow-[#0536ff]/10 transition-all duration-300 group border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="relative">
        <Image
          src={video.thumbnail_url || "/placeholder.svg"}
          alt={video.title}
          width={300}
          height={200}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-12 h-12 p-0 bg-white/90 hover:bg-white group-hover:scale-110 transition-all duration-300"
        >
          <Play className="w-5 h-5 text-[#0536ff] ml-0.5" />
        </Button>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDuration(video.duration)}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-[#0536ff] backdrop-blur-sm"
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </Button>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-gray-200 line-clamp-2 group-hover:text-[#0536ff] transition-colors text-sm sm:text-base">
          {video.title}
        </h3>

        <p className="text-sm text-gray-400 line-clamp-2">{video.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="w-6 h-6 flex-shrink-0">
              <AvatarImage src={video.author_avatar_url || "/placeholder.svg"} alt={video.author_name} />
              <AvatarFallback className="bg-gradient-to-br from-[#0536ff] to-[#6a71ea] text-white text-xs">
                {video.author_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-400 truncate">{video.author_name}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-500 flex-shrink-0">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{formatViews(video.views)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{video.likes_count}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
