"use client"

import React, {useEffect, useState} from 'react'
import CollectionsFeedList from '@/components/hocs/collectionComponents/CollectionsFeedList'
import { useUserState } from '@/lib/store/user'
import { fetchCollectionPostsAction } from '@/app/actions'
import { Post } from '@/types/global'
import { notFound } from 'next/navigation'

const Collections = () => {
    const user = useUserState(state => state.user);
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore ] = useState(true)
    const pageSize = 10;

    if(!user){
        return notFound()
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const loadPosts = async () => {
          const data = await fetchCollectionPostsAction(user?.id, 'favorites', page, 10);
          const flatPosts = data.flat()
          if (page === 1) {
            setPosts(flatPosts);
          } else {
            setPosts(prevPosts => [...prevPosts, ...flatPosts]);
          }
          setHasMore(flatPosts.length === pageSize);
        };
        loadPosts();
      }, [page, user]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Your Collections</h1>
      <div className="space-y-4">
      <CollectionsFeedList postsData={posts}  />

      {hasMore && (
        <button
          onClick={() => setPage(page + 1)}
          className="w-full py-2 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
        >
          Load More
        </button>
      )}
      </div>
    </div>
  )
}

export default Collections