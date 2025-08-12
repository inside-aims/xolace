import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { CampfirePurpose } from '@/components/campfires/campfires.types';

export interface CampfireDetails {
  campfireId: string;
  name: string;
  slug: string;
  description: string;
  members: number;
  purpose: CampfirePurpose;
  iconURL?: string;
  bannerUrl?: string;
  isMember: boolean;
}

const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const QUERY_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

export function getCampfireWithSlug(slug : string, userId?: string ) {
  const supabase = getSupabaseBrowserClient();

  return useQuery<CampfireDetails, Error>({
    queryKey: ['campfires', 'public', slug],
    queryFn: async () => {
      // @ts-ignore
      const { data, error } = await supabase
        .from('campfires')
        .select(
          `
          id,
          name,
          slug,
          description,
          member_count,
          purpose,
          icon_url,
          banner_url,
          campfire_members!left(user_id)
        `,
        )
        .eq('visibility', 'public')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching campfire details:', error);
        throw new Error(error.message);
      }

    //   if (!data) {
    //     return {};
    //   }

      console.log(data);

      // The type assertion is needed here because the dynamic select with join
      // isn't fully typed by Supabase's generator. We are confident in the shape
      // of the data we are receiving from our query.
      const typedData = data as unknown as {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        member_count: number;
        purpose: CampfirePurpose;
        icon_url: string | null;
        banner_url: string| null;
        campfire_members: Array<{ user_id: string }>;
      };

      return {
        campfireId: typedData.id,
        name: typedData.name,
        slug: typedData.slug,
        description: typedData.description || '',
        members: typedData.member_count,
        purpose: typedData.purpose,
        iconURL: typedData.icon_url || undefined,
        bannerUrl: typedData.banner_url || undefined,
        isMember: userId
          ? typedData.campfire_members.some(m => m.user_id === userId)
          : false,
      };
    },
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_CACHE_TIME,
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
}
