import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

const supabase = getSupabaseBrowserClient();

export function getCampfirePosts(campfireId: string) {
  return useQuery({
    queryKey: ['campfire-posts', campfireId],
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
          ),
          campfires!posts_campfire_id_fkey (
            name,
            icon_url,
            slug
          )
        `
        )
        .eq('campfire_id', campfireId)
        .order('created_at', { ascending: false })
        .order('slide_index', {
          referencedTable: 'post_slides',
          ascending: true,
        });

      if (error) throw error;
      return data;
    },
    staleTime: 60 * 60, // 1 hour
    enabled: !!campfireId, // Only run query if campfireId exists
  });
}