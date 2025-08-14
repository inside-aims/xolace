import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { CampfirePurpose } from '@/components/campfires/campfires.types';

export interface UserCampfire {
  campfireId: string;
  name: string;
  slug: string;
  description: string;
  iconURL?: string;
  purpose: CampfirePurpose;
  role: 'firestarter' | 'firekeeper' | 'camper';
  memberCount: number;
}

const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const QUERY_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

export function getUserCampfires(userId?: string) {
  const supabase = getSupabaseBrowserClient();

  return useQuery<UserCampfire[], Error>({
    queryKey: ['campfires', 'user', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('campfire_members')
        .select(`
          role,
          campfire_id,
          campfires!inner(
            id,
            name,
            slug,
            description,
            icon_url,
            purpose,
            member_count
          )
        `)
        .eq('user_id', userId)
        .order('joined_at', { ascending: false });

      if (error) {
        console.error('Error fetching user campfires:', error);
        throw new Error(error.message);
      }

      if (!data) return [];

      // Type assertion for the joined data structure
      const typedData = data as unknown as Array<{
        role: 'firestarter' | 'firekeeper' | 'camper';
        campfire_id: string;
        campfires: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon_url: string | null;
          purpose: CampfirePurpose;
          member_count: number;
        };
      }>;

      return typedData.map(item => ({
        campfireId: item.campfires.id,
        name: item.campfires.name,
        slug: item.campfires.slug,
        description: item.campfires.description || '',
        iconURL: item.campfires.icon_url || undefined,
        purpose: item.campfires.purpose,
        role: item.role,
        memberCount: item.campfires.member_count,
      }));
    },
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_CACHE_TIME,
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
}