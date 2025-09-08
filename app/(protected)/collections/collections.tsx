'use client';

import { useState } from 'react';
import { CollectionsHeader } from '@/components/hocs/collectionComponents/collections-header';
import { CollectionsTabs } from '@/components/hocs/collectionComponents/collections-tab';
import { PostsSection } from '@/components/hocs/collectionComponents/post-section';
import { VideosSection } from '@/components/hocs/collectionComponents/videos-section';
import { useUserState } from '@/lib/store/user';
import SearchLoader from '@/components/shared/loaders/SearchLoader';
import { getFeatureModalConfig } from '@/utils/featureModals';
import { useFeatureModal } from '@/hooks/useFeatureModal';
import { FeatureOverviewModal } from '@/components/modals/FeatureOverViewModal';

export type TabType = 'posts' | 'videos';
export type CollectionFilter =
  | 'all'
  | 'favorites'
  | 'save-for-later'
  | 'inspiration';

export default function CollectionsPage() {
  const user = useUserState(state => state.user);
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  //const [collectionFilter, setCollectionFilter] = useState<CollectionFilter>("all")
  const collectionFilter = 'all';

  // feature modal
  const modalConfig = getFeatureModalConfig('/collections');
  const {
    isOpen: isFeatureModalOpen,
    hideModal: hideFeatureModal,
    dismissModal: dismissFeatureModal,
  } = useFeatureModal({
    config: modalConfig!,
    delay: 1500,
    autoShow: true,
  });

  return (
    <div className="min-h-[calc(100vh-var(--header-height))] w-full">
      <div className="mx-auto max-w-6xl space-y-4 pt-4 pb-12 sm:space-y-6 sm:px-4 sm:py-6 lg:px-6">
        <CollectionsHeader />

        <div className="space-y-0">
          <CollectionsTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="relative">
            {user ? (
              activeTab === 'posts' ? (
                <PostsSection
                  userId={user.id}
                  collectionFilter={collectionFilter}
                />
              ) : (
                <VideosSection />
              )
            ) : (
              <div className="w-full">
                <SearchLoader />
              </div>
            )}
          </div>
        </div>
      </div>

      {modalConfig && (
        <FeatureOverviewModal
          isOpen={isFeatureModalOpen}
          onClose={hideFeatureModal}
          config={modalConfig}
          onDismissForever={dismissFeatureModal}
        />
      )}
    </div>
  );
}
