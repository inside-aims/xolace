// hooks/campfires/useCampfireRules.ts
import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

export interface CampfireRule {
  id: number;
  campfire_id: string;
  title: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

const QUERY_STALE_TIME = 10 * 60 * 1000; // 10 minutes
const QUERY_CACHE_TIME = 30 * 60 * 1000; // 30 minutes

export function useCampfireRules(campfireId?: string) {
  const supabase = getSupabaseBrowserClient();

  return useQuery<CampfireRule[], Error>({
    queryKey: ['campfire', 'rules', campfireId],
    queryFn: async () => {
      if (!campfireId) throw new Error('Campfire ID is required');

      const { data, error } = await supabase
        .from('campfire_rules')
        .select('*')
        .eq('campfire_id', campfireId)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching campfire rules:', error);
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!campfireId,
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_CACHE_TIME,
    refetchOnWindowFocus: false,
  });
}