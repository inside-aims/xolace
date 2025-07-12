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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trailingQuery: useCallback((query: any) => {
      return query.order('created_at', { ascending: false })
    }, []),
    pageSize: 20,
  })

  console.log("videos ",videos)
  

  const filteredAndSortedVideos = useMemo(() => {
    const filtered = videos.map((item) => item.videos)

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
      error={error}
    />
 </Suspense>
    </div>
  )
}
