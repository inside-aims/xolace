import { Database } from './types_db';
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
  likes: Database['public']['Tables']['likes']['Row'][];
  comments: {
    count: number;
  };
};

type DetailPost = Database['public']['Tables']['posts']['Row'] & {
  posttags: {
    tags: {
      name: string;
    };
  }[];
  likes: Database['public']['Tables']['likes']['Row'][];
  comments: Database['public']['Tables']['comments']['Row'];
};

type User = Database['public']['Tables']['profiles']['Row']

type Comment = Database['public']['Tables']['comments']['Row']

type tag = Database['public']['Tables']['']['Row']