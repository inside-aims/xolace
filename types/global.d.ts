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
  votes: Database['public']['Tables']['votes']['Row'][];
  comments: [{
    count: number;
  }];
  views:[{
    count:number
  }];
  collections: Database['public']['Tables']['collections']['Row'][]
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
  slides: {
    content: string;
    slide_index: number;
  }[];
};

type User = Database['public']['Tables']['profiles']['Row']

type Comment = Database['public']['Tables']['comments']['Row']

type UserPreferences = Database['public']['Tables']['user_preferences']['Row']

type Tag = Database['public']['Tables']['tags']['Row']

interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}