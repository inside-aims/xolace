"use client";

import React, { useState } from "react";

import Moderators from "@/components/mods/features/moderators/moderators";
import ApprovedCampers from "@/components/mods/features/moderators/approved-campers";
import InvitesMod from "@/components/mods/features/moderators/invites-mod";
import ModeratorRecruiting from "@/components/mods/features/moderators/recruiting";

const ModsAndMemberTab = () => {
  const tabOptions: { key: string; label: string; children: React.ReactNode }[] = [
    {
      key: "moderators",
      label: "Moderators",
      children: <Moderators />,
    },
    {
      key: "approvedCampers",
      label: "Approved Campers",
      children: <ApprovedCampers />,
    },
    {
      key: "invites",
      label: "Invites",
      children: <InvitesMod />,
    },
    {
      key: "recruiting",
      label: "Recruiting",
      children: <ModeratorRecruiting/>,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabOptions[0].key);

  return (
    <div className="flex flex-col items-start w-full justify-start gap-4">
      <h3 className="font-semibold text-2xl">Mods & Members</h3>

      <div className="flex flex-col w-full gap-4">
        <div className="flex gap-4">
          {tabOptions.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-1 text-sm md:text-base font-medium border-b-3 transition-colors ${
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
          {tabOptions.find((tab) => tab.key === activeTab)?.children}
        </div>
      </div>
    </div>
  );
};

export default ModsAndMemberTab;
