import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

const supabase = getSupabaseBrowserClient();

export function useFeedHealthTips() {
    // fetch only 3 health tips from supabase
  return useQuery({
    queryKey: ['feedHealthTips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_tips')
        .select(
          `
         *
      `,
        )
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
    staleTime: 60 * 60 * 24, // 24 hours
    refetchOnMount: false,
  });
}

export function useHealthTips() {
  return useQuery({
    queryKey: ['healthTips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_tips')
        .select(
          `
         *
      `,
        )
        .order('created_at', { ascending: false })

      if (error) throw error;
      return data;
    },
    staleTime: 60 * 60 * 24, // 24 hours    
    refetchOnMount: false,
  });
}