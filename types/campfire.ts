import { Database } from "./types_db";

export interface CampfireGuideResource {
    id: number;
    label: string;
    url: string | null;
    sort_order: number | null;
  }
  
  export interface CampfireGuideData {
    guide_enabled: boolean;
    guide_show_on_join: boolean;
    guide_header_layout: string;
    guide_header_image: string;
    guide_welcome_message: string;
    resources: CampfireGuideResource[];
  }
  
  export interface CampfireWithGuide {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon_url: string | null;
    banner_url: string | null;
    guide_enabled: boolean | null;
    guide_show_on_join: boolean | null;
    guide_header_layout: string | null;
    guide_header_image: string | null;
    guide_welcome_message: string | null;
    resources: CampfireGuideResource[];
  }