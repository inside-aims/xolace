import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { CampfireGuideResource } from '@/types/campfire';

// Fetch campfire guide data
export const getCampfireResources = (campfireId: string) => {
    const supabase = getSupabaseBrowserClient();
  return useQuery({
    queryKey: ['campfire-resources', campfireId],
    queryFn: async (): Promise<CampfireGuideResource[]> => {
     

      // Get guide resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('campfire_guide_resources')
        .select('id, label, url, sort_order')
        .eq('campfire_id', campfireId)
        .order('sort_order', { ascending: true });

      if (resourcesError) {
        throw new Error(`Failed to fetch guide resources: ${resourcesError.message}`);
      }

      return resourcesData || [];
    },
    enabled: !!campfireId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};