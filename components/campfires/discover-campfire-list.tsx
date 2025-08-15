'use client';

import { AlertCircle, RefreshCw, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import React, { useCallback, useState } from 'react';
import { CampfirePurpose } from '@/components/campfires/campfires.types';
import {
  DiscoverMobileCard,
  DiscoverDesktopCard
} from '@/components/campfires/discover-cards';
import { FilterByPurpose } from '@/components/campfires/filtered-purpose';
import CampfireWrapper from '@/components/shared/layoutUIs/CampfireWrapper';
import { useAllPublicCampfires } from '@/queries/campfires/getAllPublicCampfires';
import { useJoinCampfireMutation } from '@/hooks/campfires/useJoinCampfireMutation';
import { useUserState } from '@/lib/store/user';
import CampfiresListSkeleton from '@/components/campfires/campfires-list-skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {Separator} from "@/components/ui/separator";

const DiscoverCampfireList = () => {
  const user = useUserState(state => state.user);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPurposes, setSelectedPurposes] = useState<CampfirePurpose[]>(
    [],
  );

  const {
    data: campfires,
    isPending,
    isError,
    refetch,
  } = useAllPublicCampfires(user?.id);
  const joinCampfireMutation = useJoinCampfireMutation();

  // Helper function for join campfire
  const handleJoinClick = (campfireId: string) => {
    joinCampfireMutation.mutate(campfireId);
  };

  // Clear filters
  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedPurposes([]);
  }, []);

  // Helper for campfires search and filtering
  const filteredCampfires = campfires?.filter(option => {
    const matchesSearch =
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.campfireId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPurpose =
      selectedPurposes.length === 0 ||
      selectedPurposes.includes(option.purpose);

    return matchesSearch && matchesPurpose;
  });

  return (
    <CampfireWrapper>
      <div className="flex w-full flex-col items-center gap-4 px-4">
        {/* Page Heading */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">
            Discover Campfire
          </h1>
          <p className="text-muted-foreground">
            Find your circle. Join discussions that matter to you.
          </p>
        </div>

        {/* Search & Filter */}
        <div
          className="sticky -top-8 z-20 flex w-full max-w-xl items-center justify-between gap-4 py-2 md:justify-center">
          <div className="flex w-full items-center rounded-s-2xl border px-2 sm:w-2/3">
            <Search className="text-muted-foreground mr-2 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by name or keyword"
              className="border-0 shadow-none focus-visible:ring-0"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <FilterByPurpose
            selected={selectedPurposes}
            onChange={setSelectedPurposes}
          />
        </div>

        {/* Campfire list */}
        <div className="w-full">
          {isPending ? (
            <div className="w-full" key="skeleton">
              <CampfiresListSkeleton />
            </div>
          ) : isError ? (
            <div className="flex w-full flex-col items-center gap-4 px-4" key="error">
              <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load campfires. Please check your connection and try
                  again.
                </AlertDescription>
              </Alert>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : filteredCampfires && filteredCampfires.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center w-full">
                <div className="text-6xl mb-4">🔥</div>
                <h3 className="text-lg font-medium mb-2">No campfires found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedPurposes.length > 0
                    ? "Try adjusting your search or filters"
                    : "Be the first to create a campfire!"
                  }
                </p>
                {(searchTerm || selectedPurposes.length > 0) && (
                  <Button onClick={handleClearFilters} variant="outline">
                    Clear Filters
                  </Button>
                )}
              </div>
          ) : (
            <>
              <div
                className="grid md:hidden w-full grid-cols-1 items-stretch gap-1 pt-2 pb-5">
                {filteredCampfires?.map(campfire => (
                 <div key={campfire.campfireId}>
                 {/* only show seperator above for the first in the list, use css */}
                 <Separator className=' first:block hidden' />
                   <DiscoverMobileCard
                     campfireId={campfire.campfireId}
                     name={campfire.name}
                     description={campfire.description}
                     members={campfire.members}
                     purpose={campfire.purpose}
                     iconURL={campfire.iconURL}
                     slug={campfire.slug}
                     onJoin={() => handleJoinClick(campfire.campfireId)}
                     isMember={campfire.isMember}
                   />
                   <Separator />
                 </div>
                ))}
              </div>
              <div
                className="hidden md:grid w-full grid-cols-1 items-stretch gap-6 pt-4 pb-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredCampfires?.map(campfire => (
                  <DiscoverDesktopCard
                    key={campfire.campfireId}
                    campfireId={campfire.campfireId}
                    name={campfire.name}
                    description={campfire.description}
                    members={campfire.members}
                    purpose={campfire.purpose}
                    iconURL={campfire.iconURL}
                    slug={campfire.slug}
                    onJoin={() => handleJoinClick(campfire.campfireId)}
                    isMember={campfire.isMember}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </CampfireWrapper>
  );
};
export default DiscoverCampfireList;
