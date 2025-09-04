"use client";

import React, { useState } from "react";
import SettingsItem, { SettingsItemProps } from "./settings-items";
import { CampfireDetails } from "@/queries/campfires/getCampfireWithSlug";
import { useUpdateCampfireMutation } from "@/hooks/campfires/useUpdateCampfireMutation";
import { toast } from "sonner";
import { generateCampfireSlug } from "@/lib/utils";

interface GeneralSettingsProps {
  campfire: CampfireDetails | undefined;
}

const GeneralSettings = ({campfire}: GeneralSettingsProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // 1. Call the mutation hook
  const { mutate: updateCampfire, isPending } = useUpdateCampfireMutation();

  const generalSettingsOptions: SettingsItemProps[] = [
    {
      label: "Display name",
      description: "Campfire display name",
      type: "input",
      value: campfire?.name.replace(/^x\//, ''),
    },
    {
      label: "Description",
      description: "Campfire description content goes here",
      type: "textarea",
      value: campfire?.description,
    },
    // {
    //   label: "Welcome message",
    //   type: "input",
    // },
  ];

  const handleSave = (label: string, value: string | { label: string; value: string }[]) => {
    if (!campfire) return;

    let updates = {};

    switch (label) {
      case "Display name":
        if (typeof value === "string") {
          const newSlug = generateCampfireSlug(value);
          updates = { name: value, slug: newSlug };
        } else {
          console.warn("Display name value should be a string");
          return;
        }
        break;
      case "Description":
        if (typeof value === "string") {
          updates = { description: value };
        } else {
          console.warn("Description value should be a string");
          return;
        }
        break;
      case "Welcome message":
        if (typeof value === "string") {
          updates = { welcomeMessage: value };
        } else {
          console.warn("Welcome message value should be a string");
          return;
        }
        break;
      default:
        console.warn(`No update handler for setting: ${label}`);
        return;
    }

    updateCampfire({
      campfireId: campfire.campfireId,
      slug: campfire.slug,
      updates,
    }, {
      onSuccess: () => {
        toast.success(`${label} updated successfully!`);
        setOpenIndex(null);
      },
      onError: (error) => {
        toast.error(`Failed to update ${label}: ${error.message}`);
      }
    });
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
          isSaving={isPending}
        />
      ))}
    </div>
  );
};

export default GeneralSettings;
