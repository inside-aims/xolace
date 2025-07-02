import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

const supabase = getSupabaseBrowserClient();

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
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
      return data;
    },
    staleTime: 60 * 60, // 1 hour
  });
}
