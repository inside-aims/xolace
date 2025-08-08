import {FullFormType} from "@/components/campfires/campfire-creation-modal";

export enum CampfirePurpose {
  Support = "Support",
  Growth = "Growth",
  Creative = "Creative",
}

export interface CampfireRule {
  id: number
  title: string
  description: string | null
  display_order: number
}

export enum CampfireVisibility {
  Public = "Public",
 // Private = "Private",
}

export type CampfireFieldDefinition = {
  name: keyof FullFormType;
  label: string;
  type: "input" | "textarea" | "select" | "checkbox" | "file";
  placeholder?: string;
  options?: { value: string; label: string }[];
};

export const campfireFieldsByStep: CampfireFieldDefinition[][] = [
  // Step 1
  [
    { name: "name", label: "Campfire Name", type: "input", placeholder: "e.g., Mindful Mornings" },
    { name: "description", label: "Description", type: "textarea", placeholder: "What's this Campfire about?" },
  ],

  // Step 2
  [
    { name: "purpose", label: "Purpose", type: "select", placeholder: "Select purpose",
      options: Object.values(CampfirePurpose).map((val) => ({ value: val, label: val })),
    },
    { name: "visibility", label: "Visibility", type: "select", placeholder: "Select visibility",
      options: Object.values(CampfireVisibility).map((val) => ({ value: val, label: val })),
    },
  ],

  // Step 3
  [
    { name: "icon_url", label: "Icon URL", type: "file", placeholder: "Optional icon image URL" },
    { name: "banner_url", label: "Banner URL", type: "file", placeholder: "Optional banner image URL" },
  ],
];
