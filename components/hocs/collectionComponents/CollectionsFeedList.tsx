"use client"

import React from 'react'
import { PostCard } from '@/components/cards/PostCard'
import { Post } from '@/types/global'

interface CollectionsFeedListProps {
  postsData: Post[];
}

const CollectionsFeedList = ({ postsData }: CollectionsFeedListProps) => {

//   const loadPosts = async (currentPage: number) => {
//     const data = await fetchCollectionPostsAction(userId, collectionName, currentPage, pageSize);
//     if (currentPage === 1) {
//       setPosts(data);
//     } else {
//       setPosts(prevPosts => [...prevPosts, ...data]);
//     }
//     setHasMore(data.length === pageSize);
//   };

//   useEffect(() => {
//     loadPosts(1);
//   }, [userId, collectionName]);

//   const handleLoadMore = () => {
//     const nextPage = page + 1;
//     setPage(nextPage);
//     loadPosts(nextPage);
//   };

  return (
    
      <div className="grid gap-4">
        {postsData.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
  )
}

export default CollectionsFeedList