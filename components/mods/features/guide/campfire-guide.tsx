"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import SettingsItem, {SettingsItemProps} from "@/components/mods/features/settings/settings-items";
import GuidePreview from "@/components/mods/features/guide/guide-preview";

const CampfireGuide = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Fake preview state
  const [guideEnabled, setGuideEnabled] = useState(true);
  const [showOnJoin, setShowOnJoin] = useState(false);
  const [headerLayout, setHeaderLayout] = useState("Avatar and name");
  const [headerImage, setHeaderImage] = useState("Banner");
  const [welcomeMsg, setWelcomeMsg] = useState(`Welcome to our campfire, {username}!`);
  const [campfireName] = useState("x/moonWriters");
  const [resources, setResources] = useState([
    { label: "MoonWrite", value: "moonWrite" },
    { label: "Campfire Guide", value: "campfireGuide" }
  ]);

  const guideSettings: SettingsItemProps[] = [
    {
      label: "Enable campfire guide",
      description: "Appears in the sidebar and About section",
      toggle: true,
      toggleValue: guideEnabled,
      onClick: () => setGuideEnabled(!guideEnabled),
    },
    {
      label: "Show when someone joins this campfire",
      toggle: true,
      toggleValue: showOnJoin,
      onClick: () => setShowOnJoin(!showOnJoin),
    },
    {
      label: "Header layout",
      value: headerLayout,
      type: "select",
      options: ["Name and Image", "Avatar and Image", "Avatar and Name"]
    },
    {
      label: "Header image",
      value: headerImage,
      type: "select",
      options: ["Campfire banner", "Campfire icon"]
    },
    {
      label: "Welcome message",
      value: welcomeMsg,
      type: "input",
    },
    {
      label: "Resources",
      value: `${resources.length}/3`,
      type: "resources",
      resourcesList: resources,
      onResourcesChange: setResources,
    },
  ];

  const handleSave = (label: string, value: string | { label: string; value: string }[]) => {
    console.log("Saving:", { label, value });

    switch (label) {
      case "Welcome message":
        if (typeof value === "string") {
          setWelcomeMsg(value);
        }
        break;
      case "Header layout":
        if (typeof value === "string") {
          setHeaderLayout(value);
        }
        break;
      case "Header image":
        if (typeof value === "string") {
          setHeaderImage(value);
        }
        break;
      case "Resources":
        if (Array.isArray(value)) {
          setResources(value);
        }
        break;
      default:
        break;
    }

    setOpenIndex(null);
  };


  return (
    <div className="flex flex-col md:flex-row items-start w-full gap-8 max-w-6xl">
      <div className="flex flex-col w-full md:w-2/5 gap-6">
        <h3 className="font-semibold text-2xl">Campfire Guide</h3>
        <div className="flex flex-col w-full gap-4">
          {guideSettings.map((item, index) => (
            <SettingsItem
              key={index}
              {...item}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              onClose={() => setOpenIndex(null)}
              onSave={handleSave}
            />
          ))}
        </div>
      </div>

      <Card className="w-full md:w-2/5 items-start rounded-2xl shadow-md p-8">
        <GuidePreview
          welcomeMsg={welcomeMsg}
          campfireName={campfireName}
          resource={resources}
        />
      </Card>
    </div>
  );
};

export default CampfireGuide;