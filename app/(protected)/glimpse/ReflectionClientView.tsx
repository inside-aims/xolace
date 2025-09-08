'use client'
import React, { useState, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import SharedHeaderWrapper from '@/components/health-space/reflection/SharedHeaderWrapper'
import VideoListWrapper from '@/components/health-space/reflection/VideoListWrapper'
import { Suspense } from 'react'
import { VideoSkeleton } from '@/components/health-space/reflection/video-skeleton'
import { getFeatureModalConfig } from '@/utils/featureModals'
import { useFeatureModal } from '@/hooks/useFeatureModal'
import { FeatureOverviewModal } from '@/components/modals/FeatureOverViewModal'

export default function ReflectionsClientView() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '')
  const [filter, setFilter] = useState(searchParams.get('filter') || 'mostRecent')

  const updateURL = useCallback((newValues: { query?: string; filter?: string }) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newValues.query !== undefined) {
      if (newValues.query) {
        params.set('query', newValues.query)
      } else {
        params.delete('query')
      }
    }
    if (newValues.filter) {
      params.set('filter', newValues.filter)
    }
    // Use replace instead of push to avoid polluting browser history
    router.replace(`${pathname}?${params.toString()}`)
  }, [pathname, router, searchParams]);


  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q)
    updateURL({ query: q, filter })
  }, [updateURL, filter]);

  const handleFilterChange = useCallback((f: string) => {
    setFilter(f)
    updateURL({ query: searchQuery, filter: f })
  }, [updateURL, searchQuery]);


  // Add feature modal
  const modalConfig = getFeatureModalConfig('/glimpse');
  const {
    isOpen: isFeatureModalOpen,
    hideModal: hideFeatureModal,
    dismissModal: dismissFeatureModal,
  } = useFeatureModal({
    config: modalConfig!,
    delay: 1500,
    autoShow: true
  });

  return (
    <main className='px-4'>
      <SharedHeaderWrapper
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedFilter={filter}
        onFilterChange={handleFilterChange}
      />
      <Suspense fallback={<VideoSkeleton/>}>
        <VideoListWrapper
          searchQuery={searchQuery}
          filter={filter}
        />
      </Suspense>

      {modalConfig && (
        <FeatureOverviewModal
          isOpen={isFeatureModalOpen}
          onClose={hideFeatureModal}
          config={modalConfig}
          onDismissForever={dismissFeatureModal}
        />
      )}
    </main>
  )
}