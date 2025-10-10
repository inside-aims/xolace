/**
 * Types for Highlighted Feed Content
 */

export interface HighlightedContent {
    id: string;
    title: string;
    description: string;
    image_url: string;
    badge_text: string | null;
    health_tip_link: string | null;
    glimpse_link: string | null;
    source_label: string;
    campaign_name: string | null;
    campaign_type: string | null;
    start_date: string;
    end_date: string;
    is_active: boolean;
    priority: number;
    health_tip_clicks: number;
    glimpse_clicks: number;
    theme_color: string;
    created_at: string;
    updated_at: string;
  }
  
  export type HighlightClickType = 'health_tip' | 'glimpse';
  
  export interface TrackHighlightClickParams {
    highlightId: string;
    clickType: HighlightClickType;
  }