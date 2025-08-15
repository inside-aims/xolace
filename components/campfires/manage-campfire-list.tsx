'use client';

import { Input } from '@/components/ui/input';
import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { useUserState } from '@/lib/store/user';
import { Folders, SquareDashedMousePointer, Loader2 } from 'lucide-react';
import ManageCampfireCard from '@/components/campfires/manage-cards';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  useAddFavoriteCampfireMutation,
  useRemoveFavoriteCampfireMutation,
} from '@/hooks/campfires/useFavoriteCampfireMutation';
import { useJoinCampfireMutation } from '@/hooks/campfires/useJoinCampfireMutation';
import { useInView } from 'react-intersection-observer';
import { getUserJoinedCampfires } from '@/queries/campfires/getUserJoinedCampfires';
import { getUserFavoriteCampfires } from '@/queries/campfires/getUserFavouriteCampfires';

const tabOptions: { key: string; label: string }[] = [
  { key: 'allCampfires', label: 'All Campfires' },
  { key: 'favorites', label: 'Favorites' },
];

const ManageCampfireList = () => {
  const user = useUserState(state => state.user);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('allCampfires');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Infinite scroll hook
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // Fetch user joined campfires
  const joinedQuery = getUserJoinedCampfires(user?.id, debouncedSearchTerm);

  // Fetch user favorite campfires
  const favoritesQuery = getUserFavoriteCampfires(
    user?.id,
    debouncedSearchTerm,
  );

  // Current active query based on selected tab
  const activeQuery =
    selectedTab === 'favorites' ? favoritesQuery : joinedQuery;

  // Mutations
  const addFavoriteMutation = useAddFavoriteCampfireMutation();
  const removeFavoriteMutation = useRemoveFavoriteCampfireMutation();
  const joinCampfireMutation = useJoinCampfireMutation();

  // Load more when in view
  useEffect(() => {
    if (inView && activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
      activeQuery.fetchNextPage();
    }
  }, [inView, activeQuery]);

  // Flatten all pages into a single array for active tab
  const currentCampfires = useMemo(() => {
    if (!activeQuery.data?.pages) return [];
    return activeQuery.data.pages.flatMap(page => page.campfires);
  }, [activeQuery.data?.pages]);

  // Get all joined campfires for stats (regardless of current tab)
  const allJoinedCampfires = useMemo(() => {
    if (!joinedQuery.data?.pages) return [];
    return joinedQuery.data.pages.flatMap(page => page.campfires);
  }, [joinedQuery.data?.pages]);

  // Get all favorite campfires for stats (regardless of current tab)
  const allFavoriteCampfires = useMemo(() => {
    if (!favoritesQuery.data?.pages) return [];
    return favoritesQuery.data.pages.flatMap(page => page.campfires);
  }, [favoritesQuery.data?.pages]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleSelectedTab = useCallback((key: string) => {
    setSelectedTab(key);
  }, []);

  const handleToggleFavorite = useCallback(
    (campfireId: string, currentState: boolean) => {
      if (currentState) {
        removeFavoriteMutation.mutate(campfireId);
      } else {
        addFavoriteMutation.mutate(campfireId);
      }
    },
    [addFavoriteMutation, removeFavoriteMutation],
  );

  const handleJoinCampfire = useCallback(
    (campfireId: string) => {
      joinCampfireMutation.mutate(campfireId);
    },
    [joinCampfireMutation],
  );

  const isLoading = activeQuery.isPending;
  const isError = activeQuery.isError;
  const isEmpty = currentCampfires.length === 0 && !isLoading;
  const showLoadMore = activeQuery.hasNextPage && !isEmpty;

  if (isError) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height))] w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 text-6xl">😕</div>
          <h3 className="mb-2 text-lg font-medium">Something went wrong</h3>
          <p className="text-muted-foreground mb-4">
            We couldn&apos;t load your campfires. Please try again.
          </p>
          <Button onClick={() => activeQuery.refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-var(--header-height))] w-full items-start justify-center">
      <div className="flex w-full max-w-6xl flex-col items-start justify-start gap-4 px-4 pt-4 md:pt-8">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Manage Campfires</h1>
            <div className="text-muted-foreground text-sm">
              {selectedTab === 'favorites'
                ? `${allFavoriteCampfires.length} favorite${allFavoriteCampfires.length !== 1 ? 's' : ''}`
                : `${allJoinedCampfires.length} joined`}
            </div>
        </div>

        <div className="grid w-full grid-cols-12 gap-4 md:gap-8">
          <div className="col-span-12 flex w-full flex-col gap-4 md:col-span-8">
            <div className="flex w-full items-center justify-between gap-4">
                <div className="flex h-10 w-full items-center rounded-lg border px-2 dark:border-neutral-200">
                  <Folders className="text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder={`Search ${selectedTab === 'favorites' ? 'favorites' : 'joined campfires'}...`}
                    className="w-full border border-x-0 dark:border-neutral-200"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>

              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <button className="flex items-center rounded-full bg-slate-100 p-2 px-4 md:hidden dark:bg-slate-800">
                    <SquareDashedMousePointer />
                  </button>
                </DrawerTrigger>
                <DrawerContent className='dark:bg-bg-dark' aria-describedby={undefined}>
                  <DrawerHeader>
                    <DrawerTitle>Select Filter</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex flex-col gap-2 p-4">
                    {tabOptions.map(option => {
                      const active = option.key === selectedTab;
                      return (
                        <button
                          key={option.key}
                          className={`h-10 rounded-lg p-2 text-left text-sm text-neutral-600 dark:text-neutral-100 ${
                            active
                              ? 'bg-slate-100 font-semibold dark:bg-neutral-700'
                              : 'hover:bg-slate-50 dark:hover:bg-neutral-900'
                          }`}
                          onClick={() => {
                            handleSelectedTab(option.key);
                            setDrawerOpen(false);
                          }}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            <Separator className="flex md:hidden" />

            {/* Campfires List */}
            <div className="flex w-full flex-col gap-4">
              {isLoading ? (
                // Loading skeleton
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex w-full animate-pulse items-start justify-between gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <div className="flex flex-1 gap-3">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                          <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
                          <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isEmpty ? (
                <div className="flex w-full flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 text-6xl">🔥</div>
                  <h3 className="mb-2 text-lg font-medium">
                    {selectedTab === 'favorites'
                      ? 'No favorite campfires yet'
                      : 'No campfires found'}
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    {selectedTab === 'favorites'
                      ? 'Start adding campfires to your favorites by clicking the star icon!'
                      : searchTerm
                        ? 'Try adjusting your search terms or explore new campfires to join.'
                        : "You haven't joined any campfires yet. Discover and join campfires that match your interests!"}
                  </p>
                  {searchTerm && (
                    <Button onClick={handleClearFilters} variant="outline">
                      Clear Search
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {currentCampfires.map(campfire => (
                    <ManageCampfireCard
                      key={campfire.campfireId}
                      {...campfire}
                      onToggleFavorite={handleToggleFavorite}
                      onJoinCampfire={handleJoinCampfire}
                      isTogglingFavorite={
                        addFavoriteMutation.isPending ||
                        removeFavoriteMutation.isPending
                      }
                      isJoining={joinCampfireMutation.isPending}
                    />
                  ))}

                  {/* Load More Trigger */}
                  {showLoadMore && (
                    <div ref={loadMoreRef} className="flex justify-center py-8">
                      {activeQuery.isFetchingNextPage ? (
                        <div className="text-muted-foreground flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading more campfires...</span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => activeQuery.fetchNextPage()}
                          disabled={!activeQuery.hasNextPage}
                        >
                          Load More
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar Filters */}
          <div className="col-span-4 flex w-full items-start">
            <div className="sticky top-4 hidden w-full flex-col items-start md:flex">
              <div className="flex w-full flex-col">
                <h3 className="text-muted-foreground mb-3 text-sm font-semibold tracking-wider uppercase">
                  Filter Campfires
                </h3>
                {tabOptions.map(option => {
                  const active = option.key === selectedTab;
                  const count =
                    option.key === 'favorites'
                      ? allFavoriteCampfires.length
                      : allJoinedCampfires.length;

                  return (
                    <button
                      key={option.key}
                      className={`flex w-full items-center justify-between rounded-lg p-3 text-sm transition-colors ${
                        active
                          ? 'bg-slate-100 font-semibold text-slate-900 dark:bg-neutral-700 dark:text-neutral-100'
                          : 'text-neutral-600 hover:bg-slate-50 dark:text-neutral-300 dark:hover:bg-neutral-900'
                      }`}
                      onClick={() => handleSelectedTab(option.key)}
                    >
                      <span>{option.label}</span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          active
                            ? 'bg-slate-200 dark:bg-neutral-600'
                            : 'bg-slate-100 dark:bg-neutral-800'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 w-full rounded-lg bg-slate-50 p-4 dark:bg-neutral-900">
                <h4 className="mb-3 text-sm font-semibold">Quick Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Joined:</span>
                    <span className="font-medium">
                      {allJoinedCampfires.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Favorites:</span>
                    <span className="font-medium">
                      {allFavoriteCampfires.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Firestarter Role:</span>
                    <span className="font-medium">
                      {
                        allJoinedCampfires.filter(c => c.role === 'firestarter')
                          .length
                      }
                    </span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Not Joined Favs:
                    </span>
                    <span className="font-medium">
                      {allFavoriteCampfires.filter(c => !c.isJoined).length}
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCampfireList;
