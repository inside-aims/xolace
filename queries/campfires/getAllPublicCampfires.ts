import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { CampfirePurpose } from '@/components/campfires/campfires.types';

export interface Campfire {
  campfireId: string;
  name: string;
  description: string;
  members: number;
  purpose: CampfirePurpose;
  iconURL?: string;
  isMember: boolean;
}

const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const QUERY_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

export function useAllPublicCampfires(userId?: string) {
  const supabase = getSupabaseBrowserClient();

  return useQuery<Campfire[], Error>({
    queryKey: ['campfires', 'public'],
    queryFn: async () => {
      // @ts-ignore
      const { data, error } = await supabase
        .from('campfires')
        .select(
          `
          id,
          name,
          description,
          member_count,
          purpose,
          icon_url,
          campfire_members!left(user_id)
        `,
        )
        .eq('visibility', 'public')
        .order('member_count', { ascending: false });

      if (error) {
        console.error('Error fetching public campfires:', error);
        throw new Error(error.message);
      }

      if (!data) {
        return [];
      }

      console.log(data);

      // The type assertion is needed here because the dynamic select with join
      // isn't fully typed by Supabase's generator. We are confident in the shape
      // of the data we are receiving from our query.
      const typedData = data as unknown as Array<{
        id: string;
        name: string;
        description: string | null;
        member_count: number;
        purpose: CampfirePurpose;
        icon_url: string | null;
        campfire_members: Array<{ user_id: string }>;
      }>;

      return typedData.map(campfire => ({
        campfireId: campfire.id,
        name: campfire.name,
        description: campfire.description || '',
        members: campfire.member_count,
        purpose: campfire.purpose,
        iconURL: campfire.icon_url || undefined,
        isMember: userId
          ? campfire.campfire_members.some(m => m.user_id === userId)
          : false,
      }));
    },
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_CACHE_TIME,
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
}
