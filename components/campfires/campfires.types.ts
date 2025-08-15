import {FullFormType} from "@/components/campfires/campfire-creation-modal";

//Campfire purpose options - type enum
export enum CampfirePurpose {
  Support = "support_circle",
  Growth = "growth_group",
  Creative = "creative_outlet",
  General = "general_discussion"
}
//support_circle, growth_group, creative_outlet, general_discussion

export interface CampfireRule {
  id: number
  title: string
  description: string | null
  display_order: number
}

//Campfire definition visibility options - type enum
export enum CampfireVisibility {
  Public = "public",
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
      options: Object.values(CampfirePurpose).map((val) => ({ value: val, label: val.replace('_', ' ').toUpperCase() })),
    },
    { name: "visibility", label: "Visibility", type: "select", placeholder: "Select visibility",
      options: Object.values(CampfireVisibility).map((val) => ({ value: val, label: val.replace('_', ' ').toUpperCase() })),
    },
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
  signedUrls?: Record<string, string>;
}

export const getBgSeverity = (purpose: string) => {
  switch (purpose) {
    case CampfirePurpose.Creative:
      return 'bg-green-200 text-green-800';
    case CampfirePurpose.Growth:
      return 'bg-orange-200 text-orange-800';
    case CampfirePurpose.Support:
      return 'bg-yellow-200 text-yellow-800';
    default:
      return 'bg-neutral-200 text-neutral-800';
  }
};


export interface UserCampfireFavoriteJoin {
  campfireId: string;
  name: string;
  slug: string;
  description: string;
  members: number;
  purpose: CampfirePurpose;
  iconURL?: string;
  isFavorite: boolean;
  isJoined: boolean;
  joinedAt?: string;
  role?: 'firestarter' | 'firekeeper' | 'camper';
  favoritedAt?: string;
}