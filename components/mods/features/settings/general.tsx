"use client";

import React, { useState } from "react";
import SettingsItem, { SettingsItemProps } from "./settings-items";

const GeneralSettings = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const generalSettingsOptions: SettingsItemProps[] = [
    {
      label: "Display name",
      description: "Campfire display name",
      type: "input",
      value: "x/Xolace",
    },
    {
      label: "Description",
      description: "Campfire description content goes here",
      type: "textarea",
    },
    {
      label: "Welcome message",
      type: "input",
    },
  ];

  const handleSave = (label: string, value: string) => {
    console.log(`Saving ${label}:`, value);

    if (label === "Display name") {
      // update display name
    } else if (label === "Description") {
      // update description
    } else if (label === "Welcome message") {
      // update welcome message
    }
  };


  return (
    <div className="w-full flex items-start flex-col gap-6">
      {generalSettingsOptions.map((option, index) => (
        <SettingsItem
          key={index}
          {...option}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
          onClose={() => setOpenIndex(null)}
          onSave={handleSave}
        />
      ))}
    </div>
  );
};

export default GeneralSettings;
