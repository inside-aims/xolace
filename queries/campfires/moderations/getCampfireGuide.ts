import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { CampfireWithGuide } from '@/types/campfire';

// Fetch campfire guide data
export const getCampfireGuide = (campfireId: string) => {
    const supabase = getSupabaseBrowserClient();
  return useQuery({
    queryKey: ['campfire-guide', campfireId],
    queryFn: async (): Promise<CampfireWithGuide> => {
      // Get campfire data with guide fields
      const { data: campfireData, error: campfireError } = await supabase
        .from('campfires')
        .select(`
          id, name, slug, description, icon_url, banner_url,
          guide_enabled, guide_show_on_join, guide_header_layout, 
          guide_header_image, guide_welcome_message
        `)
        .eq('id', campfireId)
        .single();

      if (campfireError) {
        throw new Error(`Failed to fetch campfire guide: ${campfireError.message}`);
      }

      // Get guide resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('campfire_guide_resources')
        .select('id, label, url, sort_order')
        .eq('campfire_id', campfireId)
        .order('sort_order', { ascending: true });

      if (resourcesError) {
        throw new Error(`Failed to fetch guide resources: ${resourcesError.message}`);
      }

      return {
        ...campfireData,
        resources: resourcesData || []
      };
    },
    enabled: !!campfireId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};