"use client";

import React, { useState } from "react";
import GeneralSettings from "@/components/mods/features/settings/general";
import PrivacyAndDiscovery from "@/components/mods/features/settings/privacy-and-discovery";
import SettingsNotification from "@/components/mods/features/settings/notifications";
import { getCampfireWithSlug } from "@/queries/campfires/getCampfireWithSlug";
import { useUserState } from "@/lib/store/user";

const SettingsTab = ({slug}: {slug: string}) => {
  const user = useUserState(state => state.user);

  const [activeTab, setActiveTab] = useState("general");

   // fetch campfire details
    const {
      data: campfire,
      isPending,
      isError,
      refetch,
    } = getCampfireWithSlug(slug,user?.id);

      
  const tabOptions: { key: string; label: string; children: React.ReactNode }[] = [
    {
      key: "general",
      label: "General",
      children: <GeneralSettings campfire={campfire} />,
    },
    {
      key: "privacyAndDiscovery",
      label: "Privacy & Discovery",
      children: <PrivacyAndDiscovery campfire={campfire} />,
    },
    {
      key: "notifications",
      label: "Notifications",
      children: <SettingsNotification/>
    }
  ];


  if (isPending) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error loading campfire</div>
  }

  return (
    <div className="flex flex-col items-start w-full justify-start gap-4 max-w-3xl">
      <h3 className="font-semibold text-2xl">General Settings</h3>

      <div className="flex flex-col w-full gap-4">
        <div className="flex gap-4">
          {tabOptions.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-1 text-sm md:text-base font-medium border-b-3 px-2 transition-colors ${
                activeTab === tab.key
                  ? "border-ocean-500 text-ocean-500 dark:text-ocean-300 dark:border-ocean-300"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full mt-4">
          {tabOptions.find((tab) =>
            tab.key === activeTab)?.children
          }
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
