import { Database } from "./types_db";
// export interface Post extends Database['public']['Tables']['posts']['Row'] {
//   posttags: Array<{
//     tags: {
//       name: string;
//     };
//   }>;
//   likes: Array<{
//     user_id: string | null;
//     post_id: string | null;
//     created_at: string | null;
//   }>;
//   comments: Array<{
//     count: number;
//   }>;
// }

type Profile = Database['public']['Tables']['profiles']['Row'];
interface SearchParamsInterface{ SearchParams : Promise<{ [key: string]: string | string[] | undefined }>}

type Post = Database['public']['Tables']['posts']['Row'] & {
  posttags: {
    tags: {
      name: string;
    };
  }[];
  comments: {
    count: number;
  }[];
  views:{
    count:number
  }[];
  collections: {user_id: string}[];
  post_slides: {
    content: string;
    slide_index: number;
  }[];
  campfires: {
    name: string;
    icon_url: string | null;
    slug: string;
  } | null;
};

type DetailPost = Database['public']['Tables']['posts']['Row'] & {
  posttags: {
    tags: {
      name: string;
    };
  }[];
  votes: Database['public']['Tables']['votes']['Row'][];
  views:[{
    count:number
  }]
  comments: Database['public']['Tables']['comments']['Row'][];
  collections: Database['public']['Tables']['collections']['Row'][];
  post_slides: {
    content: string;
    slide_index: number;
  }[];
  campfires: {
    name: string;
    icon_url?: string;
    slug: string;
  };
};

// types/campfire.ts - New types for campfire functionality
export interface CampfirePost extends Post {
  campfire_id: string;
  campfires: {
    name: string;
    icon_url?: string;
    slug: string;
  };
}

type User = Database['public']['Tables']['profiles']['Row']

type Comment = Database['public']['Tables']['comments']['Row']

type NestedComment = Comment & { replies: NestedComment[] };

type UserPreferences = Database['public']['Tables']['user_preferences']['Row']

type Tag = Database['public']['Tables']['tags']['Row']

interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

declare interface DropdownListProps {
  options: string[];
  selectedOption: string;
  onOptionSelect: (option: string) => void;
  triggerElement: ReactNode;
}

type SupaVideoDetails = Database['public']['Tables']['videos']['Row'] & {
  video_collections: {user_id: string}[];
}

type Notification = Database['public']['Tables']['notifications']['Row']


export interface EnhancedPost {
  id: string;
  created_at: string;
  created_by: string | null;
  author_name: string;
  content: string;
  mood: string;
  author_avatar_url: string | null;
  expires_in_24hr: boolean;
  duration: string | null;
  expires_at: string | null;
  downvotes: number;
  upvotes: number;
  is_sensitive: boolean;
  is_prompt_response: boolean;
  type: string;
  author_roles: ("normal_user" | "verified" | "blue_team" | "help_professional" | "mentor")[];
  campfire_id: string | null;
  campfire_name: string | null;
  campfire_slug: string | null;
  campfire_icon_url: string | null;
  priority_score: number;
  is_new_post: boolean;
  is_campfire_post: boolean;
  posttags: Array<{ name: string }>;
  comments_count: number;
  views_count: number;
  collections: Array<{ user_id: string }>;
  post_slides: Array<{ slide_index: number; content: string }>;
}

export interface PostMetricData {
  id: string;
  comments: Array<{ count: number }>;
  created_by: string | null;
  upvotes: number;
  downvotes: number;
}

export type HighLightedFeedContent = Database['public']['Tables']['highlighted_feed_content']['Row']