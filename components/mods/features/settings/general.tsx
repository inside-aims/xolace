'use client';

import React, { useState } from 'react';
import SettingsItem, { SettingsItemProps } from './settings-items';
import { CampfireDetails } from '@/queries/campfires/getCampfireWithSlug';
import { useUpdateCampfireMutation } from '@/hooks/campfires/useUpdateCampfireMutation';
import { toast } from 'sonner';
import { generateCampfireSlug } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface GeneralSettingsProps {
  campfire: CampfireDetails | undefined;
}

const GeneralSettings = ({ campfire }: GeneralSettingsProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // 1. Call the mutation hook
  const { mutate: updateCampfire, isPending } = useUpdateCampfireMutation();

  const generalSettingsOptions: SettingsItemProps[] = [
    {
      label: 'Display name',
      description: 'Campfire display name',
      type: 'input',
      value: campfire?.name.replace(/^x\//, ''),
    },
    {
      label: 'Description',
      description: 'Campfire description',
      type: 'textarea',
      value: campfire?.description,
    },
    // {
    //   label: "Welcome message",
    //   type: "input",
    // },
  ];

  const handleSave = (
    label: string,
    value: string | { label: string; value: string }[],
  ) => {
    if (!campfire) return;

    let updates = {};

    switch (label) {
      case 'Display name':
        if (typeof value === 'string') {
          const newSlug = generateCampfireSlug(value);
          updates = { name: value, slug: newSlug };
        } else {
          console.warn('Display name value should be a string');
          return;
        }
        break;
      case 'Description':
        if (typeof value === 'string') {
          updates = { description: value };
        } else {
          console.warn('Description value should be a string');
          return;
        }
        break;
      case 'Welcome message':
        if (typeof value === 'string') {
          updates = { welcomeMessage: value };
        } else {
          console.warn('Welcome message value should be a string');
          return;
        }
        break;
      default:
        console.warn(`No update handler for setting: ${label}`);
        return;
    }

    updateCampfire(
      {
        campfireId: campfire.campfireId,
        slug: campfire.slug,
        updates,
      },
      {
        onSuccess: () => {
          toast.success(`${label} updated successfully!`);
          setOpenIndex(null);
        },
        onError: error => {
          toast.error(`Failed to update ${label}: ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="flex w-full flex-col items-start gap-6">
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

      {isPending && openIndex !== null && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm dark:bg-black/40">
          <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <Loader2 className="text-lavender-500 h-6 w-6 animate-spin" />
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                Saving Changes
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Updating your campfire settings...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralSettings;
