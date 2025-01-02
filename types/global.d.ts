import { Database } from "./types_db"; 
interface Post extends Database["public"]["Tables"]["posts"]["Row"] {
    posttags: Array<{
      tags: {
        name: string;
      };
    }>;
    likes: Array<{
      user_id: string | null;
      post_id: string | null;
      created_at: string | null;
    }>;
    comments: Array<{
      count: number;
    }>;
  }
  
  type Profile =  Database["public"]["Tables"]["profiles"]["Row"]