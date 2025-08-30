"use client";

import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SettingsItem, { SettingsItemProps } from "@/components/mods/features/settings/settings-items";
import { Info } from "lucide-react";
import { CampfireDetails } from "@/queries/campfires/getCampfireWithSlug";
import { toTitleCase } from "@/utils";

interface PrivacyAndDiscoveryProps {
  campfire: CampfireDetails | undefined;
}

const PrivacyAndDiscovery = ({campfire}: PrivacyAndDiscoveryProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const privacyAndDiscoveryOptions: SettingsItemProps[] = [
    {
      label: "Campfire Type",
      value: campfire?.visibility,
      description: "Who can view and contribute to your community",
      type: "select",
      options: ["public"],
      disabled: true,
    },
    {
      label: "Anonymous users",
      value: "On",
      description: "Restrict your campfire to those whose account is anonymous",
      type: "select",
      options: ["On", "Off"],
      disabled: true,
    },
    // {
    //   label: "Appear in feeds",
    //   description:
    //     "Allow your campfire to appear in x/all, x/popular, and trending lists",
    //   toggle: true,
    //   toggleValue: false,
    // },
    // {
    //   label: "Appear in recommendations",
    //   description:
    //     "Let Xolace recommend your campfire to people with similar interests",
    //   toggle: true,
    //   toggleValue: true,
    // },
  ];

  const handleSave = (label: string, val: string) => {
    console.log(`Saving ${label}:`, val);

    if (label === "Campfire Type") {
      // update campfire type
    } else if (label === "Anonymous users") {
      // update ano users
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      <Alert className="rounded-xl bg-neutral-50 dark:bg-neutral-900">
        <Info className="h-4 w-4" />
        <AlertDescription className="flex flex-wrap items-center gap-1 text-sm">
          Making a temporary change because of increased activity?{" "}
          <a
            href="#"
            className="underline underline-offset-2 font-medium hover:text-primary"
          >
            Set up a temporary event!
          </a>
        </AlertDescription>
      </Alert>

      <div className="rounded-2xl mt-4 flex flex-col gap-6">
        {privacyAndDiscoveryOptions.map((option, index) => (
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
    </div>
  );
};

export default PrivacyAndDiscovery;
