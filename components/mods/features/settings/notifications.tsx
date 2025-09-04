"use client";

import React, { useState } from "react";
import SettingsItem, { SettingsItemProps } from "@/components/mods/features/settings/settings-items";

const SettingsNotification = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const settingsItems: SettingsItemProps[] = [
    {
      label: "Allow Notifications",
      description: "Turn off to stop any mod notifications from this community",
      toggle: true,
      toggleValue: true,
    },
    {
      label: "Activity",
      value: "All activity",
      description: "Choose what kind of activity you get notified about",
      type: "select",
      options: ["All activity", "Only mentions", "None"],
    },
    {
      label: "Mod Mail",
      value: "Enabled",
      description: "Receive mod mail notifications from this community",
      type: "select",
      options: ["Enabled", "Disabled"],
    },
    {
      label: "Reports",
      value: "Immediate",
      description: "When to get notified about reports",
      type: "select",
      options: ["Immediate", "Hourly", "Daily", "Never"],
    },
    {
      label: "Milestones",
      description: "Cake days and membership milestones",
      toggle: true,
      toggleValue: true,
    },
    {
      label: "Tips & Tricks",
      description: "Get tips and reminders to help you grow",
      toggle: true,
      toggleValue: true,
    },
  ];


  const handleSave = (label: string, val: string | { label: string; value: string }[]) => {
    console.log(`Saving ${label}:`, val);

    switch (label) {
      case "Activity":
        if (typeof val === "string") {
          // update activity
        }
        break;

      case "Mod Mail":
        if (typeof val === "string") {
          // update mod mail
        }
        break;

      case "Reports":
        if (typeof val === "string") {
          // update reports
        }
        break;
      default:
        console.warn(`No update handler for setting: ${label}`);
        break;
    }
  };

  return (
    <div className="w-full flex items-start flex-col gap-6">
      {settingsItems.map((item, index) => (
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
  );
};
export default SettingsNotification;
