import React, { Suspense } from 'react'
import Collections from './collections'
import FeedSkeletonLoader from '@/components/shared/loaders/FeedSkeletonLoader'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collections',
  description: "Access your saved stories and curated collections from the community to revisit meaningful experiences and mental health insights anytime."
}

const CollectionPage = () => {
  return (
    <div className="container-spacing w-full px-0!">
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