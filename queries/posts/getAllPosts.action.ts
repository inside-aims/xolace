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
          comments:comments(count),
          views:views(count),
        collections(
          user_id
        ),
        post_slides (
            slide_index,
            content
          )  
    `,
    )
    .order('created_at', { ascending: false })
    .order('slide_index', {
      referencedTable: 'post_slides',
      ascending: true,
    });

  if (error) throw error;

  return postsData;
};
