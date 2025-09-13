'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Globe, Users, Info } from 'lucide-react';
import CampfireAbout from '@/components/campfires/campfire-about';
import CampfireHighlight from '@/components/campfires/campfire-highlight';
import { useRouter } from 'next/navigation';
import { getCampfireWithSlug } from '@/queries/campfires/getCampfireWithSlug';
import { useUserState } from '@/lib/store/user';
import CampfireDetailsSkeleton from './campfire-details-skeleton';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { useJoinCampfireMutation } from '@/hooks/campfires/useJoinCampfireMutation';
import { useLeaveCampfireMutation } from '@/hooks/campfires/useLeaveCampfireMutation';
import { formatMembers, getBgSeverity } from './campfires.types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import CampfireActionsPopover from './campfire-actions-popover';
import {
  useAddFavoriteCampfireMutation,
  useRemoveFavoriteCampfireMutation,
} from '@/hooks/campfires/useFavoriteCampfireMutation';
import CampfireGuideModal from "@/components/campfires/campfire-guide-modal";
import {getCampfireResources} from "@/queries/campfires/moderations/getCampfireResources";

const CampfireDetails = ({ slug }: { slug: string }) => {
  const user = useUserState(state => state.user);
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('feed');
  const [openGuideModal, setOpenGuideModal] = useState(false);

  // fetch campfire details
  const {
    data: campfire,
    isPending,
    isError,
    refetch,
  } = getCampfireWithSlug(slug, user?.id);

  // Fetch resources data
  const {
    data: resourcesData,
  } = getCampfireResources(campfire?.campfireId || '');

  // Transform resources for UI compatibility
  const uiResources = resourcesData?.map(r => ({
    label: r.label,
    value: r.url || r.label
  })) || [];

  // Mutations for joining/leaving campfire
  const joinMutation = useJoinCampfireMutation();
  const leaveMutation = useLeaveCampfireMutation();

  // Mutations for favorite campfire
  const addFavoriteMutation = useAddFavoriteCampfireMutation();
  const removeFavoriteMutation = useRemoveFavoriteCampfireMutation();

  const handleCreatePost = () => {
    if (!user) {
      toast.error('Please sign in to create a post');
      router.push('/sign-in');
      return;
    }

    if (user.is_anonymous) {
      toast.error(
        'Anonymous users cannot create posts for this campfire. Please use a real account.',
        {
          duration: 3000,
        },
      );
      return;
    }

    if (!campfire?.isMember) {
      toast.error(
        'Sorry non-members cannot post here. Please join campfire to be able to share✨',
        {
          duration: 4000,
        },
      );
      return;
    }
    router.push(`/create-post?submit=${slug}`);
  };

  //Helper for join action
  const handleJoinToggle = async () => {
    if (!user) {
      toast.error('Please sign in to join this campfire');
      router.push('/sign-in');
      return;
    }

    if (user.is_anonymous) {
      toast.error(
        'Anonymous users cannot join campfires. Please use a real account.',
        {
          duration: 3000,
        },
      );
      return;
    }

    if (!campfire) return;

    try {
      if (campfire.isMember) {
        await leaveMutation.mutateAsync(campfire.campfireId);
      } else {
        await joinMutation.mutateAsync(campfire.campfireId);
      }
      // Refetch to get updated data
      refetch();
    } catch (error) {
      throw error;
    }
  };

  //Helper for favorite action
  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Please sign in to favorite this campfire');
      router.push('/sign-in');
      return;
    }

    if (user.is_anonymous) {
      toast.error(
        'Anonymous users cannot add campfires to favorites. Please use a real account.',
        {
          duration: 3000,
        },
      );
      return;
    }

    if (!campfire) return;

    try {
      if (campfire.isFavorite) {
        await removeFavoriteMutation.mutateAsync(campfire.campfireId);
      } else {
        await addFavoriteMutation.mutateAsync(campfire.campfireId);
      }
      // Refetch to get updated data
      refetch();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // const handleNotificationToggle = () => {
  //   if (!campfire?.isMember) {
  //     toast.info("Join this campfire to receive notifications");
  //     return;
  //   }
  //   toast.info("Notification preferences updated");
  // };

  const tabOptions: {
    key: string;
    label: string;
    children: React.ReactNode;
  }[] = [
    {
      key: 'feed',
      label: 'Feed',
      children: (
        <CampfireHighlight
          campfireId={campfire?.campfireId || ''}
          campfireName={campfire?.name}
          campfireIconUrl={campfire?.iconURL}
        />
      ),
    },
    {
      key: 'about',
      label: 'About',
      children: <CampfireAbout campfire={campfire} setDrawerOpen={setOpenGuideModal} />,
    },
  ];

  // Loading state
  if (isPending) {
    return <CampfireDetailsSkeleton />;
  }

  // Error state
  if (isError || !campfire) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Campfire not found
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            The campfire you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
        <Button
          onClick={() => router.push('/campfires/discover')}
          variant="outline"
        >
          Browse all campfires
        </Button>
      </div>
    );
  }

  // loading for mutations
  const isProcessingMembership =
    joinMutation.isPending || leaveMutation.isPending;

  return (
    <>
      <div className="mt-1 flex w-full max-w-5xl flex-col items-center justify-center">
        <div
          className="relative flex h-[128px] w-full rounded-none border bg-cover bg-center lg:rounded-lg"
          style={{backgroundImage: `url('${campfire.bannerUrl}')`}}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 rounded-none bg-black/20 lg:rounded-lg"/>

          {/* Profile logo overlap */}
          <div className="absolute bottom-[-40px] left-4 z-20 h-20 w-20 lg:left-8">
            <div className="relative h-full w-full">
              <Avatar className="hidden h-20 w-20 rounded-full border-3 border-white lg:flex dark:border-black/80">
                <AvatarImage
                  className="rounded-full object-contain"
                  src={campfire.iconURL || undefined}
                  alt={campfire.name}
                />
                <AvatarFallback
                  className="border-lavender-500 flex items-center justify-center rounded-full border font-semibold text-white">
                <span
                  className={`bg-lavender-500 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-semibold text-white`}
                >
                  x/
                </span>
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Purpose badge */}
          <div className="absolute top-2 right-2 md:top-4 md:right-4">
            <Badge
              className={`${getBgSeverity(campfire.purpose)} flex gap-1 rounded-full capitalize`}
            >
            <span>
              <Info size={14}/>
            </span>
              {campfire.purpose.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        {/* Name and CTA buttons */}
        <div
          className="mt-4 ml-0 flex w-full flex-col items-start justify-between gap-4 px-4 lg:mt-2 lg:flex-row lg:items-center lg:gap-0 lg:pl-15">
          {/* Name and logo */}
          <div
            className="flex w-[70%] flex-row items-center justify-start gap-4 lg:justify-start lg:gap-0 lg:pl-15 lg:text-left">
            <div className="lg:hidden">
              <Avatar>
                <AvatarImage
                  className="rounded-full border border-neutral-400 object-contain"
                  src={campfire.iconURL || undefined}
                  alt={campfire.name}
                />
                <AvatarFallback
                  className="border-lavender-500 flex h-8 w-8 items-center justify-center rounded-full border font-semibold text-white">
                <span
                  className={`bg-lavender-500 flex h-7 w-7 items-center justify-center rounded-full font-semibold text-white`}
                >
                  x/
                </span>
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-start gap-1 lg:items-center">
              <div className="flex items-center gap-2 lg:gap-2">
                <h1 className="text-xl font-semibold lg:text-2xl">
                  {campfire.name}
                </h1>
                <Globe size={16} className="text-green-500"/>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 lg:hidden">
              <span className="flex items-center gap-1">
                <Users size={14}/>
                {formatMembers(campfire.members)} Members
              </span>
                <span className="flex items-center gap-1">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"/>
                Online
              </span>
              </div>
            </div>
          </div>

          {/* Right CTA buttons */}
          <div
            className="flex w-full max-w-full items-start justify-start space-x-4 lg:mt-0 lg:items-end lg:justify-end">
            <Button
              className={'flex flex-row items-center gap-1 rounded-full'}
              size="sm"
              variant="outline"
              onClick={handleCreatePost}
            >
              <Plus size={16}/> <span> Create Post</span>
            </Button>

            <Button
              size="sm"
              variant={campfire.isMember ? 'default' : 'outline'}
              onClick={handleJoinToggle}
              disabled={isProcessingMembership}
              className="min-w-[70px] rounded-full border border-neutral-400"
            >
              {isProcessingMembership ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"/>
              ) : campfire.isMember ? (
                'Joined'
              ) : (
                'Join'
              )}
            </Button>

            {(campfire.memberRole === 'firekeeper' ||
              campfire.memberRole === 'firestarter') && (
              <Button
                className={
                  'bg-lavender-500 dark:bg-lavender-500 hover:bg-lavender-600 flex items-center gap-1 rounded-full text-white hover:text-white'
                }
                size="sm"
                variant="outline"
                onClick={() => router.replace(`/c/${campfire.slug}/mod/moderators`)}
              >
                Mod Tools
              </Button>
            )}

            <CampfireActionsPopover
              campfire={{
                name: campfire.name,
                description: campfire.description,
                slug: campfire.slug,
                isMember: campfire.isMember,
                isFavorite: campfire.isFavorite,
              }}
              onAddToFavorites={handleFavoriteToggle}
              isProcessingFavorite={
                addFavoriteMutation.isPending || removeFavoriteMutation.isPending
              }
            />
          </div>
        </div>

        {/* Desktop layout */}
        <div className="mt-4 hidden w-full grid-cols-12 gap-4 p-4 lg:grid">
          <div className="col-span-8">
            <CampfireHighlight
              campfireId={campfire.campfireId}
              campfireName={campfire.name}
              campfireIconUrl={campfire.iconURL}
            />
          </div>
          <div
            className="sm:top-[calc(var(--header-height) + 1rem)] col-span-4 scroll-smooth sm:sticky sm:max-h-[calc(100vh-var(--header-height)-2rem)] sm:overflow-x-hidden sm:overflow-y-auto">
            <CampfireAbout campfire={campfire} setDrawerOpen={setOpenGuideModal}/>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="mt-4 flex w-full flex-col gap-4 lg:hidden">
          <div className="flex flex-row items-start gap-4 px-4">
            {tabOptions.map(campfire => {
              const activeTab = selectedTab === campfire.key;
              return (
                <Button
                  key={campfire.key}
                  onClick={() => setSelectedTab(campfire.key)}
                  size={'sm'}
                  variant="ghost"
                  className={`rounded-full ${activeTab ? 'border border-neutral-400 bg-neutral-200 dark:bg-neutral-800' : ''}`}
                >
                  {' '}
                  {campfire.label}
                </Button>
              );
            })}
          </div>
          {/* Content based on selection */}
          <div className="">
            {tabOptions.map(
              campfire =>
                campfire.key === selectedTab && (
                  <div key={campfire.key}>{campfire.children}</div>
                ),
            )}
          </div>
        </div>
      </div>

      { openGuideModal && (
        <CampfireGuideModal
          welcomeMsg={campfire.guideWelcomeMessage || 'You are welcome !'}
          campfireName={campfire.name}
          resource={uiResources}
          icon={campfire.iconURL || null}
          drawerOpen={openGuideModal}
          setDrawerOpen={setOpenGuideModal}
        />
      )}
    </>

  );
};
export default CampfireDetails;
