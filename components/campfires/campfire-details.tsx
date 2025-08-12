'use client';

import React, { useState } from "react";
import Image from 'next/image';
import {Button} from "@/components/ui/button";
import {Plus, Bell, Ellipsis} from "lucide-react";
import CampfireAbout from "@/components/campfires/campfire-about";
import CampfireHighlight from "@/components/campfires/campfire-highlight";

const CampfireDetails = () => {
  const [selectedTab, setSelectedTab] = useState("feed");

  const handleCreatePost = () => {
    return () => '';
  }

  //Helper for join action
  const handleJoin = () => {
    return () => '';
  }

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

  return (
    <div className="flex w-full flex-col items-center justify-center max-w-5xl mt-1">
      <div className="flex w-full h-[128px] bg-cover bg-center relative border rounded-none md:rounded-lg"
        style={{backgroundImage: "url('/assets/images/auth/sign-in.png')"}}>
        {/* Profile logo overlap */}
        <div
          className="absolute bottom-[-40px] left-4 md:left-8 w-20 h-20 z-20">
          <Image
            src="/assets/images/mas.webp"
            alt="mas"
            height={60}
            width={60}
            className={"hidden md:flex w-full h-full rounded-full border border-neutral-400"}
          />
        </div>
      </div>

      {/* Name and CTA buttons */}
      <div className="w-full flex flex-col gap-4 md:gap-0 md:flex-row items-start md:items-center justify-between ml-0 md:pl-12 px-4 mt-4 md:mt-0">
        {/* Name and logo */}
        <div className="flex flex-row gap-4 md:gap-0 items-center justify-center md:text-left">
          <div
            className="w-16 h-16">
            <Image
              src="/assets/images/mas.webp"
              alt="mas"
              height={60}
              width={60}
              className={"flex md:hidden w-full h-full rounded-full border border-neutral-400"}
            />
          </div>
          <div className={"flex flex-col items-start md:items-center gap-2"}>
            <h1 className="text-xl font-semibold">x/ghana</h1>
            <p className={"flex md:hidden"}>
              <span className="text-gray-500">98k Members • 42 Online</span>
            </p>
          </div>
        </div>

        {/* Right CTA buttons */}
        <div
          className="w-full max-w-full flex items-start md:items-end justify-start md:justify-end space-x-4 mt-2 md:mt-0">
          <Button
            className={"flex flex-row gap-1 items-center rounded-full"}
            size="sm"
            variant="outline"
            onClick={handleCreatePost}
          >
            <Plus size={16}/> <span> Create Post</span>
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className={"items-center rounded-full border border-neutral-400"}
          >
            <Bell size={14}/>
          </Button>
          <Button
            size={'sm'}
            variant={"outline"}
            onClick={handleJoin}
            className={"rounded-full border border-neutral-400"}
          >
            Joined
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className={"rounded-full border border-neutral-400"}
            onClick={() => ""}
          >
            <Ellipsis size={14}/>
          </Button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden w-full md:grid grid-cols-12 gap-4 p-4 mt-4">
        <div className="col-span-8">
          <CampfireHighlight />
        </div>
        <div className="col-span-4 sm:sticky sm:top-[calc(var(--header-height) + 1rem)] sm:max-h-[calc(100vh-var(--header-height)-2rem)] sm:overflow-y-auto sm:overflow-x-hidden scroll-smooth">
          <CampfireAbout />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden flex-col w-full mt-4 gap-4 px-4">
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


