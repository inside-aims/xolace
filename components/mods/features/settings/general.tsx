"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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
    {
      label: "Welcome message",
      type: "input",
    },
  ];

  const handleSave = (label: string, value: string) => {
    if (!campfire) return;

    let updates = {};
    let newSlug = generateCampfireSlug(value);

    // 2. Determine which field to update based on the label
    switch (label) {
      case "Display name":
        updates = { name: value,  slug: newSlug };
        break;
      case "Description":
        updates = { description: value };
        break;
      // Add other cases here for future settings
      default:
        console.warn(`No update handler for setting: ${label}`);
        return;
    }

    // 3. Call the mutate function with the required variables
    updateCampfire({
      campfireId: campfire.campfireId,
      slug: campfire.slug,
      updates,
    }, {
      onSuccess: () => {
        toast.success(`${label} updated successfully!`);
        setOpenIndex(null); // Close the form on success
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
