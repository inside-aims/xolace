import {FullFormType} from "@/components/campfires/campfire-creation-modal";

//Campfire purpose options - type enum
export enum CampfirePurpose {
  Support = "Support",
  Growth = "Growth",
  Creative = "Creative",
}

//Campfire definition visibility options - type enum
export enum CampfireVisibility {
  Public = "Public",
 // Private = "Private",
}

// Campfire creation definition fields
export type CampfireFieldDefinition = {
  name: keyof FullFormType;
  label: string;
  type: "input" | "textarea" | "select" | "checkbox" | "file";
  placeholder?: string;
  options?: { value: string; label: string }[];
};

// Handle members count to human readable
export const formatMembers = (count: number): string => {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toString();
}

// Campfire creation stepper steps
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
    { name: "rules", label: "Rules", type: "checkbox"},
  ],

  // Step 3
  [
    { name: "icon_url", label: "Icon URL", type: "file", placeholder: "Optional icon image URL" },
    { name: "banner_url", label: "Banner URL", type: "file", placeholder: "Optional banner image URL" },
  ],
];

export interface CampfireAvatarInterface {
  avatarUrl: string | undefined | null;
  username: string;
  userRoute?: string;
  assignedRole?: string;
  title?: string;
}
