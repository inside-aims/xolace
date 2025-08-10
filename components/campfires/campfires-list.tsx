'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { CampfirePurpose } from '@/components/campfires/campfires.types';
import CampfireCard from '@/components/campfires/campfire-card';
import { FilterByPurpose } from '@/components/campfires/filtered-purpose';
import CampfireWrapper from '@/components/shared/layoutUIs/CampfireWrapper';
import { useAllPublicCampfires } from '@/queries/campfires/getAllPublicCampfires';
import { useJoinCampfireMutation } from '@/hooks/campfires/useJoinCampfireMutation';
import { useUserState } from '@/lib/store/user';
import CampfiresListSkeleton from "@/components/campfires/campfires-list-skeleton";

const CampfiresList = () => {
  const user = useUserState(state => state.user);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPurposes, setSelectedPurposes] = useState<CampfirePurpose[]>(
    [],
  );
  const { data: campfires, isPending, isError } = useAllPublicCampfires(user?.id);
  const joinCampfireMutation = useJoinCampfireMutation();

  // Helper function for join campfire
  const handleJoinClick = (campfireId: string) => {
    joinCampfireMutation.mutate(campfireId);
  };

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
          <h1 className="text-2xl font-bold">Discover Campfires</h1>
          <p className="text-muted-foreground">
            Find your circle. Join discussions that matter to you.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="sticky -top-8 z-50 flex w-full max-w-xl items-center justify-between gap-4 py-2 md:justify-center">
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
        <div className="grid grid-cols-1 items-stretch gap-6 pt-4 pb-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 w-full">
          {isPending ? (
            <CampfiresListSkeleton/>
          ) : isError ? (
            <div className={'flex w-full text-center text-red-500'}>
              Error fetching campfires. Please try again later.
            </div>
          ) : filteredCampfires && filteredCampfires.length === 0 ? (
            <div className={'flex w-full text-center text-neutral-400'}>
              No result match your search
            </div>
          ) : (
            filteredCampfires?.map(campfire => (
              <CampfireCard
                key={campfire.campfireId}
                campfireId={campfire.campfireId}
                name={campfire.name}
                description={campfire.description}
                members={campfire.members}
                purpose={campfire.purpose}
                iconURL={campfire.iconURL}
                onJoin={() => handleJoinClick(campfire.campfireId)}
                isMember={campfire.isMember}
              />
            ))
          )}
        </div>
      </div>
    </CampfireWrapper>
  );
};
export default CampfiresList;
