"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import SettingsItem, {SettingsItemProps} from "@/components/mods/features/settings/settings-items";
import GuidePreview from "@/components/mods/features/guide/guide-preview";
import { getCampfireIdWithSlug } from "@/queries/campfires/getCampfireIdWithSlug";
import { getCampfireGuide } from "@/queries/campfires/moderations/getCampfireGuide";
import { useUpdateGuideSettings } from "@/hooks/campfires/moderations/useUpdateGuideSettings";
import { useUpdateGuideResources } from "@/hooks/campfires/moderations/useUpdateGuideSettings";
import Loader2Component from "@/components/shared/loaders/Loader2";
import { Button } from "@/components/ui/button";
import GuidePreviewDrawer from "@/components/mods/features/guide/guide-preview-drawer";
import { toast } from "sonner";

const CampfireGuide = ({slug}: {slug: string}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Get campfire ID from slug
  const { data: campfireData, isPending: isLoadingSlug, isError: isSlugError } = getCampfireIdWithSlug(slug);

   // Fetch guide data
   const { 
    data: guideData, 
    isLoading: isLoadingGuide, 
    isError: isGuideError,
    error: guideError 
  } = getCampfireGuide(campfireData?.campfireId || '');

  // Fake preview state
  // const [guideEnabled, setGuideEnabled] = useState(true);
  // const [showOnJoin, setShowOnJoin] = useState(false);
  // const [headerLayout, setHeaderLayout] = useState("Avatar and name");
  // const [headerImage, setHeaderImage] = useState("Banner");
  // const [welcomeMsg, setWelcomeMsg] = useState(`Welcome to our campfire, {username}!`);
  // const [campfireName] = useState("x/moonWriters");
  // const [resources, setResources] = useState([
  //   { label: "MoonWrite", value: "moonWrite" },
  //   { label: "Campfire Guide", value: "campfireGuide" }
  // ]);

    // Mutations
    const updateSettingsMutation = useUpdateGuideSettings(campfireData?.campfireId || '');
    const updateResourcesMutation = useUpdateGuideResources(campfireData?.campfireId || '');
  
    const isLoading = isLoadingSlug || isLoadingGuide;
    const isError = isSlugError || isGuideError;

    // Transform resources for UI compatibility
  const uiResources = guideData?.resources.map(r => ({ 
    label: r.label, 
    value: r.url || r.label 
  })) || [];

  const guideSettings: SettingsItemProps[] = guideData ? [
    {
      label: "Enable campfire guide",
      description: "Appears in the sidebar and About section",
      toggle: true,
      toggleValue: guideData.guide_enabled,
      onToggle: (val) => updateSettingsMutation.mutate({ 
        guide_enabled: val 
      }),
    },
    {
      label: "Show when someone joins this campfire",
      toggle: true,
      toggleValue: guideData.guide_show_on_join,
      onToggle: (val) => updateSettingsMutation.mutate({ 
        guide_show_on_join: val 
      }),
    },
    {
      label: "Header layout",
      value: guideData.guide_header_layout,
      type: "select",
      options: ["Name and Banner", "Avatar and Banner", "Avatar and Name"],
      disabled: true
    },
    {
      label: "Header image",
      value: guideData.guide_header_image,
      type: "select",
      options: ["Campfire banner", "Campfire icon"],
      disabled: true
    },
    {
      label: "Welcome message",
      value: guideData.guide_welcome_message,
      type: "input",
    },
    {
      label: "Resources",
      value: `3`,
      type: "resources",
      resourcesList: uiResources,
    },
  ] : [];


  const handleSave = (label: string, value: string | { label: string; value: string }[]) => {
    if (!guideData) return;

    switch (label) {
      case "Welcome message":
        if (typeof value === "string") {
          updateSettingsMutation.mutate({ guide_welcome_message: value });
        }
        break;
      case "Header layout":
        if (typeof value === "string") {
          updateSettingsMutation.mutate({ guide_header_layout: value });
        }
        break;
      case "Header image":
        if (typeof value === "string") {
          updateSettingsMutation.mutate({ guide_header_image: value });
        }
        break;
      case "Resources":
        if (Array.isArray(value)) {
          // First, perform validation
          const hasInvalidLink = value.some(r => r.value && !r.value.startsWith('https'));
          const hasEmptyField = value.some(r => !r.value);
        
          if (hasInvalidLink) {
            toast.error("Invalid link format. Please include https://");
            return;
          }
        
          if (hasEmptyField) {
            toast.error("Please fill in both fields in");
            return;
          }
        
          // If validation passes, map the data
          const apiResources = value.map(r => ({
            label: r.label,
            url: r.value !== r.label ? r.value : undefined
          }));
        
          updateResourcesMutation.mutate(apiResources);
        }
        
        break;
      default:
        break;
    }

    setOpenIndex(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2Component/>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          Loading campfire guide...
        </p>
      </div>
    );
  }


  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-sm text-red-500 mb-4">
          Failed to load campfire guide: {guideError?.message || 'Unknown error'}
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="rounded-lg"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!guideData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-sm text-neutral-500">No guide data found</p>
      </div>
    );
  }


  return (
    <div className="flex flex-col lg:flex-row items-start w-full gap-8 max-w-6xl">
      <div className="flex flex-col w-full lg:w-3/5 gap-6">
        <h3 className="font-semibold text-2xl">Campfire Guide</h3>
        
        {/* Mobile Preview Button */}
        <div className="block lg:hidden">
          <GuidePreviewDrawer
            welcomeMsg={guideData.guide_welcome_message}
            campfireName={guideData.name}
            resources={uiResources}
          />
        </div>

        <div className="flex flex-col w-full gap-4">
          {guideSettings.map((item, index) => (
            <SettingsItem
              key={index}
              {...item}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              onClose={() => setOpenIndex(null)}
              onSave={handleSave}
              isLoading={updateSettingsMutation.isPending || updateResourcesMutation.isPending}
            />
          ))}
        </div>
      </div>

      {/* Desktop Preview Card */}
      <Card className="hidden lg:block w-full lg:w-2/5 items-start rounded-2xl shadow-md p-8 lg:sticky lg:top-6">
        <GuidePreview
          welcomeMsg={guideData.guide_welcome_message}
          campfireName={guideData.name}
          resource={uiResources}
          icon={guideData.icon_url}
        />
      </Card>
    </div>
  );
};

export default CampfireGuide;