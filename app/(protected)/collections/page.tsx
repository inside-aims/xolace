import React, { Suspense } from 'react'
import Collections from './collections'
import FeedSkeletonLoader from '@/components/shared/loaders/FeedSkeletonLoader'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collections',
}

const CollectionPage = () => {
  return (
    <div className="container-spacing w-full">
      <h1 className="text-4xl font-bold mb-6">Your Collections 📚 </h1>
      <div className="space-y-4">
        <Suspense fallback={<FeedSkeletonLoader />}>
          <Collections />
        </Suspense>
      </div>
    </div>
  )
}

export default CollectionPage