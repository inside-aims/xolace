"use client"

import { useState, useMemo , useCallback } from "react"
import { EnhancedPostCard } from "@/components/cards/EnhancedPostCard"
import { PostsFilter } from "./post-filter"
import type { CollectionFilter } from "@/app/(protected)/collections/collections"
import { useInfiniteQuery, type SupabaseQueryHandler } from '@/hooks/use-infinite-query';
import { Post } from "@/types/global"
import { useRouter } from "next/navigation"
import FeedSkeletonLoader from "@/components/shared/loaders/FeedSkeletonLoader"
// import { useInfiniteQuery } from '@/hooks/use-infinite-query'

export type PostSortFilter = "recent" | "most-upvoted" | "most-commented"

interface PostsSectionProps {
  collectionFilter: CollectionFilter
  userId: string
}

// Dummy data structure based on the provided schemas
const dummyPosts = [
  {
    id: "1",
    created_at: "2024-01-15T10:30:00Z",
    author_name: "tester10",
    content:
      "Just had an amazing breakthrough in my meditation practice today. The feeling of inner peace is indescribable! 🧘‍♀️✨",
    mood: "happy" as const,
    author_avatar_url: "/placeholder.svg?height=40&width=40",
    upvotes: 12,
    downvotes: 1,
    collection_name: "favorites",
  },
  {
    id: "2",
    created_at: "2024-01-10T14:20:00Z",
    author_name: "Anonymous69",
    content:
      "Prompt: Describe a moment that changed how you see the world. Let's have a blast sharing our transformative experiences.",
    mood: "neutral" as const,
    author_avatar_url: "/placeholder.svg?height=40&width=40",
    upvotes: 8,
    downvotes: 0,
    collection_name: "save-for-later",
  },
  {
    id: "3",
    created_at: "2024-01-08T09:15:00Z",
    author_name: "tester1",
    content: "Prompt: This is the prompt for today - what small act of kindness made your day brighter?",
    mood: "hopeful" as const,
    author_avatar_url: "/placeholder.svg?height=40&width=40",
    upvotes: 15,
    downvotes: 0,
    collection_name: "inspiration",
  },
]

type collectionPost = {
  post_id: string;
  collection_name: string | null;
  posts: Post;
}

export function PostsSection({ collectionFilter, userId }: PostsSectionProps) {
  const [sortFilter, setSortFilter] = useState<PostSortFilter>("recent")
  const router = useRouter()

  const columns = `
      post_id,
      collection_name,
      posts (
        *,
        posttags (
          tags (
            name
          )
        ),
        votes (
          user_id,
          vote_type
        ),
        comments:comments (
          count
        ),
        views:views (
          count
        ),
        collections (
          user_id
        ),
        post_slides (
            slide_index,
            content
        )
      )
    `;

//WRAP IN USECALLBACK
const queryHandler: SupabaseQueryHandler<"collections"> = useCallback(
    (query) => {
      let filteredQuery = query.eq("user_id", userId)
      
      if (collectionFilter !== "all") {
        console.log("collectionFilter ",collectionFilter)
        filteredQuery = filteredQuery.eq("collection_name", collectionFilter)
      }
      return filteredQuery.order("created_at", { ascending: false })
    },
    [userId, collectionFilter]
  )


const {
    data: collectionsData,
    fetchNextPage,
    hasMore,
    isLoading,
    isFetching,
    error
  } = useInfiniteQuery({
    tableName: 'collections',
    columns,
    trailingQuery: queryHandler,
    pageSize: 10,
    idColumn: 'post_id'
  });

  console.log("collection posts ",collectionsData)
  

  // Commented out Supabase implementation
  /*
  const { data: posts, isLoading, error, fetchNextPage, hasMore } = useInfiniteQuery({
    tableName: 'collections',
    columns: `
      id,
      created_at,
      collection_name,
      posts (
        id,
        created_at,
        author_name,
        content,
        mood,
        author_avatar_url,
        upvotes,
        downvotes
      )
    `,
    trailingQuery: (query) => {
      let filteredQuery = query
      if (collectionFilter !== 'all') {
        filteredQuery = filteredQuery.eq('collection_name', collectionFilter)
      }
      return filteredQuery.order('created_at', { ascending: false })
    },
    pageSize: 10,
  })
  */

  

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = collectionsData.map((item) => item.posts)
    console.log("filtered ",filtered)

    return filtered.sort((a, b) => {
      switch (sortFilter) {
        case "most-upvoted":
          return b.upvotes - a.upvotes
        case "most-commented":
          return 0 // Would implement comment count comparison
        case "recent":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })
  }, [ sortFilter, collectionsData])

    const handlePostClick = useCallback((postId: string) => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      router.push(`/post/${postId}`);
    }, [router]);

    console.log("filteredAndSortedPosts ",filteredAndSortedPosts)
  return (
    <div className=" sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 ">
      <PostsFilter sortFilter={sortFilter} onSortFilterChange={setSortFilter} />

      <div className="space-y-3 sm:space-y-4">
        {filteredAndSortedPosts.map((post) => (
           <EnhancedPostCard
           key={post.id}
           post={post}
           onClick={() => handlePostClick(post.id)}
           className="bg-bg dark:bg-bg-dark mb-5 w-full rounded-none border-x-0 md:w-full dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#193a47]"
         />
        ))}

        {isLoading || isFetching && <FeedSkeletonLoader />}

        {!isLoading && !isFetching && filteredAndSortedPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No posts found in this collection.</p>
          </div>
        )}

{hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={fetchNextPage}
            disabled={isFetching}
            className="rounded-lg bg-lavender-500 px-6 py-2 font-semibold text-white hover:bg-lavender-600 disabled:opacity-50"
          >
            {isFetching ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
      </div>
    </div>
  )
}
