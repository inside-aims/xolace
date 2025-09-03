export interface CampfireGuideResource {
    id: number;
    label: string;
    url?: string;
    sort_order: number;
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
    description?: string;
    icon_url?: string;
    banner_url?: string;
    guide_enabled: boolean;
    guide_show_on_join: boolean;
    guide_header_layout: string;
    guide_header_image: string;
    guide_welcome_message: string;
    resources: CampfireGuideResource[];
  }