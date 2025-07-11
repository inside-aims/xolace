"use client"

import { useState, useMemo, useCallback, Suspense } from "react"
import { VideosFilter } from "./videos-filter"
import type { CollectionFilter } from "@/app/(protected)/collections/collections"
import { useInfiniteQuery } from "@/hooks/use-infinite-query"
// import { useInfiniteQuery } from '@/hooks/use-infinite-query'
import VideoList from "@/components/health-space/reflection/video-list"
import { VideoSkeleton } from "@/components/health-space/reflection/video-skeleton"

export type VideoSortFilter = "recent" | "most-liked" | "most-viewed"

interface VideosSectionProps {
  collectionFilter: CollectionFilter
}

// Dummy data structure based on the provided schemas
// const dummyVideos = [
//   {
//     id: "1",
//     created_at: "2024-01-15T10:30:00Z",
//     title: "5-Minute Morning Meditation",
//     description:
//       "Start your day with this calming meditation practice designed to center your mind and boost your energy.",
//     thumbnail_url: "/placeholder.svg?height=200&width=300",
//     author_name: "MindfulMoments",
//     author_avatar_url: "/placeholder.svg?height=40&width=40",
//     views: 1250,
//     likes_count: 89,
//     duration: 300,
//     collection_name: "favorites",
//   },
//   {
//     id: "2",
//     created_at: "2024-01-12T16:45:00Z",
//     title: "Breathing Techniques for Anxiety",
//     description: "Learn powerful breathing exercises that can help manage anxiety and stress in just a few minutes.",
//     thumbnail_url: "/placeholder.svg?height=200&width=300",
//     author_name: "WellnessGuru",
//     author_avatar_url: "/placeholder.svg?height=40&width=40",
//     views: 2100,
//     likes_count: 156,
//     duration: 480,
//     collection_name: "save-for-later",
//   },
//   {
//     id: "3",
//     created_at: "2024-01-08T12:20:00Z",
//     title: "Gratitude Practice for Better Sleep",
//     description: "End your day with this gentle gratitude meditation to promote restful sleep and positive thoughts.",
//     thumbnail_url: "/placeholder.svg?height=200&width=300",
//     author_name: "SleepWell",
//     author_avatar_url: "/placeholder.svg?height=40&width=40",
//     views: 890,
//     likes_count: 67,
//     duration: 420,
//     collection_name: "inspiration",
//   },
// ]

// useCallback((query: any) => {
//     let filteredQuery = query
//     if (collectionFilter !== 'all') {
//       filteredQuery = filteredQuery.eq('collection_name', collectionFilter)
//     }
//     return filteredQuery.order('created_at', { ascending: false })
//   }, [collectionFilter])

export function VideosSection({ collectionFilter }: VideosSectionProps) {
  const [sortFilter, setSortFilter] = useState<VideoSortFilter>("recent")

  // Commented out Supabase implementation
  
  const { data: videos, isLoading, error, fetchNextPage, hasMore , count , isFetching} = useInfiniteQuery({
    tableName: 'video_collections',
    columns: `
      id,
      created_at,
      collection_name,
      videos (
        id,
        created_at,
        title,
        description,
        thumbnail_url,
        author_name,
        author_avatar_url,
        views,
        likes_count,
        duration,
        visibility,
        video_id
      )
    `,
    trailingQuery: useCallback((query: any) => {
      return query.order('created_at', { ascending: false })
    }, [collectionFilter]),
    pageSize: 20,
  })

  console.log("videos ",videos)
  

  const filteredAndSortedVideos = useMemo(() => {
    let filtered = videos.map((item) => item.videos)

    return filtered.sort((a, b) => {
      switch (sortFilter) {
        case "most-liked":
          return b.likes_count - a.likes_count
        case "most-viewed":
          return b.views - a.views
        case "recent":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })
  }, [sortFilter, videos])

  return (
    <div className="px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <VideosFilter sortFilter={sortFilter} onSortFilterChange={setSortFilter} />

 <Suspense fallback={<VideoSkeleton/>}>
      <VideoList
      videos={filteredAndSortedVideos}
      isLoading={isLoading}
      isFetching={isFetching}
      hasMore={hasMore}
      fetchNextPage={fetchNextPage}
      count={count}
    />
 </Suspense>
    </div>
  )
}
