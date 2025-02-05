import React, { Suspense } from 'react'
import Collections from './collections'
import FeedSkeletonLoader from '@/components/shared/loaders/FeedSkeletonLoader'

const CollectionPage = () => {
  return (
    <div className="md:container md:mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Your Collections 📚 </h1>
      <div className="space-y-4">
        <Suspense fallback={<FeedSkeletonLoader />}>
          <Collections />
        </Suspense>
      </div>
    </div>
  )
}

export default CollectionPage