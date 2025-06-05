import { createClient } from '@/utils/supabase/server';

// get all post
export const getAllPosts = async () => {
  const supabase = await createClient();

  const { data: postsData, error } = await supabase
    .from('posts')
    .select(
      `
       *,
       posttags (
          tags (
            name
          )
        ),
          votes(
          user_id,
          vote_type
          ),
          comments:comments(count),
          views:views(count),
        collections(
          user_id
        )  
    `,
    )
    .order('created_at', { ascending: false });

  if (error) throw error;

  return postsData;
};
