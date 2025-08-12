'use client';

import React, { useState } from "react";
import Image from 'next/image';
import {Button} from "@/components/ui/button";
import {Plus, Bell, Ellipsis, Globe, Users} from "lucide-react";
import CampfireAbout from "@/components/campfires/campfire-about";
import CampfireHighlight from "@/components/campfires/campfire-highlight";
import { useRouter } from "next/navigation";
import { getCampfireWithSlug } from "@/queries/campfires/getCampfireWithSlug";
import { useUserState } from "@/lib/store/user";
import CampfireDetailsSkeleton from "./campfire-details-skeleton";
import {toast} from 'sonner'
import { Badge } from "../ui/badge";
import { useJoinCampfireMutation } from "@/hooks/campfires/useJoinCampfireMutation";
import { useLeaveCampfireMutation } from "@/hooks/campfires/useLeaveCampfireMutation";
import { formatMembers } from "./campfires.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const CampfireDetails = ({slug}: {slug : string}) => {
  const user = useUserState(state => state.user);
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("feed");

  // fetch campfire details
  const {
    data: campfire,
    isPending,
    isError,
    refetch,
  } = getCampfireWithSlug(slug,user?.id);

  // Mutations for joining/leaving campfire
  const joinMutation = useJoinCampfireMutation();
  const leaveMutation = useLeaveCampfireMutation();

  const handleCreatePost = () => {
    if (!user) {
      toast.error("Please sign in to create a post");
      router.push("/sign-in");
      return;
    }
    router.push(`/create-post?submit=${slug}`);
  };

  //Helper for join action
  const handleJoinToggle = async () => {
    if (!user) {
      toast.error("Please sign in to join this campfire");
      router.push("/sign-in");
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
      console.error("Error toggling membership:", error);
    }
  };

  const handleNotificationToggle = () => {
    if (!campfire?.isMember) {
      toast.info("Join this campfire to receive notifications");
      return;
    }
    toast.info("Notification preferences updated");
  };

  const handleShareCampfire = async () => {
    try {
      await navigator.share({
        title: campfire?.name || "Check out this campfire!",
        text: campfire?.description || "Join this amazing community",
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success("Campfire link copied to clipboard!");
    }
  };

  const tabOptions: {key: string, label: string, children: React.ReactNode}[] = [
    {
      key: "feed",
      label: "Feed",
      children: <CampfireHighlight/>
    },
    {
      key: "about",
      label: "About",
      children: <CampfireAbout/>
    }
  ];

   // Loading state
   if (isPending) {
    return <CampfireDetailsSkeleton />;
  }

  // Error state
  if (isError || !campfire) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Campfire not found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            The campfire you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => router.push("/campfires/discover")} variant="outline">
          Browse all campfires
        </Button>
      </div>
    );
  }

  // loading for mutations
  const isProcessingMembership = joinMutation.isPending || leaveMutation.isPending;

  return (
    <div className="flex w-full flex-col items-center justify-center max-w-5xl mt-1">
      <div className="flex w-full h-[128px] bg-cover bg-center relative border rounded-none lg:rounded-lg"
        style={{backgroundImage: `url('${campfire.bannerUrl}')`}}>

          {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 rounded-none lg:rounded-lg" />

        {/* Profile logo overlap */}
        <div
          className="absolute bottom-[-40px] left-4 lg:left-8 w-20 h-20 z-20">
          <div className="relative w-full h-full">
          <Avatar className="hidden lg:flex rounded-full border-4 border-white dark:border-gray-800 h-20 w-20">
              <AvatarImage className="rounded-full border border-neutral-400 object-contain" src={campfire.iconURL || undefined} alt={campfire.name} />
              <AvatarFallback className="border-lavender-500 flex h-8 w-8 items-center justify-center rounded-full border font-semibold text-white"><span
                  className={`bg-lavender-500 flex h-7 w-7 items-center justify-center rounded-full font-semibold text-white`}
                >
                  x/
                </span></AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Purpose badge */}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90 text-black">
            {campfire.purpose.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Name and CTA buttons */}
      <div className="w-full flex flex-col gap-4 lg:gap-0 lg:flex-row items-start lg:items-center justify-between ml-0 lg:pl-15 px-4 mt-4 lg:mt-0 bg-red-500">
        {/* Name and logo */}
        <div className="flex flex-row gap-4 lg:gap-0 items-center justify-start lg:justify-start lg:pl-15 lg:text-left bg-blue-500 w-[70%]">
          <div className=" lg:hidden bg-pink-500">
          <Avatar>
              <AvatarImage className=" rounded-full border border-neutral-400 object-contain" src={campfire.iconURL || undefined} alt={campfire.name} />
              <AvatarFallback className="border-lavender-500 flex h-8 w-8 items-center justify-center rounded-full border font-semibold text-white"><span
                  className={`bg-lavender-500 flex h-7 w-7 items-center justify-center rounded-full font-semibold text-white`}
                >
                  x/
                </span></AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col items-start lg:items-center gap-1">
            <div className="flex items-center gap-2 lg:gap-0">
              <h1 className="text-xl lg:text-2xl font-semibold">{campfire.name}</h1>
              <Globe size={16} className="text-green-500" />
            </div>
            
            <div className="flex lg:hidden items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users size={14} />
                {formatMembers(campfire.members)} Members
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Right CTA buttons */}
        <div
          className="w-full max-w-full flex items-start lg:items-end justify-start lg:justify-end space-x-4 lg:mt-0 bg-amber-500">
          <Button
            className={"flex flex-row gap-1 items-center rounded-full"}
            size="sm"
            variant="outline"
            onClick={handleCreatePost}
          >
            <Plus size={16}/> <span> Create Post</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="items-center rounded-full border border-neutral-400"
            onClick={handleNotificationToggle}
            disabled={!campfire.isMember}
          >
            <Bell size={14} />
          </Button>

          <Button
            size="sm"
            variant={campfire.isMember ? "default" : "outline"}
            onClick={handleJoinToggle}
            disabled={isProcessingMembership}
            className="rounded-full border border-neutral-400 min-w-[70px]"
          >
            {isProcessingMembership ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
            ) : campfire.isMember ? (
              "Joined"
            ) : (
              "Join"
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="rounded-full border border-neutral-400"
            onClick={handleShareCampfire}
          >
            <Ellipsis size={14} />
          </Button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden w-full lg:grid grid-cols-12 gap-4 p-4 mt-4">
        <div className="col-span-8">
          <CampfireHighlight />
        </div>
        <div className="col-span-4 sm:sticky sm:top-[calc(var(--header-height) + 1rem)] sm:max-h-[calc(100vh-var(--header-height)-2rem)] sm:overflow-y-auto sm:overflow-x-hidden scroll-smooth">
          <CampfireAbout />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex lg:hidden flex-col w-full mt-4 gap-4 px-4">
        <div className="flex flex-row gap-4 items-start">
          {tabOptions.map((campfire) => {
            const activeTab = selectedTab === campfire.key;
            return(
              <Button
                key={campfire.key}
                onClick={() => setSelectedTab(campfire.key)}
                size={"sm"}
                variant="ghost"
                className={`rounded-full  ${activeTab ? "bg-neutral-200 dark:bg-neutral-800 border border-neutral-400" : ""}`}
              > {campfire.label}
              </Button>
            )}
          )}
        </div>
        {/* Content based on selection */}
        <div className="">
          {tabOptions.map((campfire) =>
            campfire.key === selectedTab && (
            <div key={campfire.key}>{campfire.children}</div>
          ) )}
        </div>
      </div>
    </div>
  );
};
export default CampfireDetails;


