import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowUp, ArrowDown, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from "@/lib/date-fns"

interface Post {
  id: string
  created_at: string
  author_name: string
  content: string
  mood: "happy" | "sad" | "neutral" | "hopeful" | "anxious"
  author_avatar_url: string
  upvotes: number
  downvotes: number
  collection_name: string
}

interface PostCardProps {
  post: Post
}

const moodColors = {
  happy: "bg-yellow-900/30 text-yellow-400 border-yellow-800/50",
  sad: "bg-blue-900/30 text-blue-400 border-blue-800/50",
  neutral: "bg-gray-800/30 text-gray-400 border-gray-700/50",
  hopeful: "bg-green-900/30 text-green-400 border-green-800/50",
  anxious: "bg-red-900/30 text-red-400 border-red-800/50",
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg hover:shadow-[#0536ff]/5 transition-all duration-300 border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-start gap-3 sm:gap-4">
        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-700 shadow-sm">
          <AvatarImage src={post.author_avatar_url || "/placeholder.svg"} alt={post.author_name} />
          <AvatarFallback className="bg-gradient-to-br from-[#0536ff] to-[#6a71ea] text-white text-sm">
            {post.author_name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium text-gray-200 truncate">{post.author_name}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${moodColors[post.mood]} whitespace-nowrap`}
              >
                {post.mood}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 flex-shrink-0">
              <span className="text-sm hidden sm:inline">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
              <span className="text-xs sm:hidden">{formatDistanceToNow(new Date(post.created_at))}</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-300">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{post.content}</p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-gray-500 hover:text-[#0536ff] hover:bg-[#0536ff]/10"
                >
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm">{post.upvotes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <ArrowDown className="w-4 h-4" />
                  <span className="text-sm">{post.downvotes}</span>
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-gray-500 hover:text-[#0536ff] hover:bg-[#0536ff]/10"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Reply</span>
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#0536ff] hover:bg-[#0536ff]/10">
              <Bookmark className="w-4 h-4 fill-current" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
