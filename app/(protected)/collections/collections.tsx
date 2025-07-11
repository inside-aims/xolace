"use client"

import { useState } from "react"
import { CollectionsHeader } from "@/components/hocs/collectionComponents/collections-header"
import { CollectionsTabs } from "@/components/hocs/collectionComponents/collections-tab"
import { PostsSection } from "@/components/hocs/collectionComponents/post-section"
import { VideosSection } from "@/components/hocs/collectionComponents/videos-section"
import { useUserState } from "@/lib/store/user"
import SearchLoader from "@/components/shared/loaders/SearchLoader"

export type TabType = "posts" | "videos"
export type CollectionFilter = "all" | "favorites" | "save-for-later" | "inspiration"

export default function CollectionsPage() {
  const user = useUserState(state => state.user);
  const [activeTab, setActiveTab] = useState<TabType>("posts")
  //const [collectionFilter, setCollectionFilter] = useState<CollectionFilter>("all")
  const collectionFilter = "all"

  return (
    <div className="min-h-[calc(100vh-var(--header-height))] w-full">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        <CollectionsHeader />

        <div className="space-y-0">
          <CollectionsTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="relative ">
            {user ? (
              activeTab === "posts" ? (
                <PostsSection userId={user.id} collectionFilter={collectionFilter} />
              ) : (
                <VideosSection collectionFilter={collectionFilter} />
              )
            ) : (
                <div className="w-full">
                  <SearchLoader />  
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
