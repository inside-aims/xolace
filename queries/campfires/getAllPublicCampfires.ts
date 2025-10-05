import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { CampfirePurpose } from '@/components/campfires/campfires.types';
import { useBatchCampfireMembership } from '@/hooks/campfires/useCampfireMembership';

export interface CampfireBase {
  campfireId: string;
  name: string;
  slug: string;
  description: string;
  members: number;
  purpose: CampfirePurpose;
  iconURL?: string;
}

export interface Campfire extends CampfireBase {
  isMember: boolean;
}

const CAMPFIRES_STALE_TIME = 10 * 60 * 1000; // 10 minutes
const CAMPFIRES_CACHE_TIME = 15 * 60 * 1000; // 15 minutes

/**
 * Base hook to fetch all public campfires WITHOUT membership status
 * This query is cached for 10-15 minutes since campfire data rarely changes
 * 
 * IMPORTANT: This uses NO JOIN - much faster and scalable!
 */
export function useAllPublicCampfiresBase() {
  const supabase = getSupabaseBrowserClient();

  return useQuery<CampfireBase[], Error>({
    queryKey: ['campfires', 'public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campfires')
        .select('id, name, slug, description, member_count, purpose, icon_url')
        .eq('visibility', 'public')
        .order('member_count', { ascending: false });

      if (error) {
        console.error('Error fetching public campfires:', error);
        throw new Error(error.message);
      }

      if (!data) {
        return [];
      }

      return data.map(campfire => ({
        campfireId: campfire.id,
        name: campfire.name,
        slug: campfire.slug,
        description: campfire.description || '',
        members: campfire.member_count,
        purpose: campfire.purpose as CampfirePurpose,
        iconURL: campfire.icon_url || undefined,
      }));
    },
    staleTime: CAMPFIRES_STALE_TIME,
    gcTime: CAMPFIRES_CACHE_TIME,
    refetchOnWindowFocus: false,
  });
}


export function useAllPublicCampfires(userId?: string) {
  // Fetch campfire data (long cache)
  const { 
    data: campfires, 
    isLoading: isCampfiresLoading,
    isError,
    error,
    refetch 
  } = useAllPublicCampfiresBase();

  // Get all campfire IDs
  const campfireIds = campfires?.map(c => c.campfireId) || [];

  // Fetch membership status for all campfires in ONE query (short cache)
  const { 
    data: membershipMap = {},
    isLoading: isMembershipLoading 
  } = useBatchCampfireMembership(campfireIds, userId || '');

  // Combine the results
  const campfiresWithMembership = campfires?.map(campfire => ({
    ...campfire,
    isMember: membershipMap[campfire.campfireId] || false,
  }));

  return {
    data: campfiresWithMembership,
    isPending: isCampfiresLoading || (!!userId && isMembershipLoading),
    isLoading: isCampfiresLoading || (!!userId && isMembershipLoading),
    isError,
    error,
    refetch,
  };
}





// import { useQuery } from '@tanstack/react-query';
// import { getSupabaseBrowserClient } from '@/utils/supabase/client';
// import { CampfirePurpose } from '@/components/campfires/campfires.types';

// export interface Campfire {
//   campfireId: string;
//   name: string;
//   slug: string;
//   description: string;
//   members: number;
//   purpose: CampfirePurpose;
//   iconURL?: string;
//   isMember: boolean;
// }

// const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes
// const QUERY_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

// export function useAllPublicCampfires(userId?: string) {
//   const supabase = getSupabaseBrowserClient();

//   return useQuery<Campfire[], Error>({
//     queryKey: ['campfires', 'public'],
//     queryFn: async () => {
//       // @ts-ignore
//       const { data, error } = await supabase
//         .from('campfires')
//         .select(
//           `
//           id,
//           name,
//           slug,
//           description,
//           member_count,
//           purpose,
//           icon_url,
//           campfire_members!left(user_id)
//         `,
//         )
//         .eq('visibility', 'public')
//         .order('member_count', { ascending: false });

//       if (error) {
//         console.error('Error fetching public campfires:', error);
//         throw new Error(error.message);
//       }

//       if (!data) {
//         return [];
//       }


//       // The type assertion is needed here because the dynamic select with join
//       // isn't fully typed by Supabase's generator. We are confident in the shape
//       // of the data we are receiving from our query.
//       const typedData = data as unknown as Array<{
//         id: string;
//         name: string;
//         slug: string;
//         description: string | null;
//         member_count: number;
//         purpose: CampfirePurpose;
//         icon_url: string | null;
//         campfire_members: Array<{ user_id: string }>;
//       }>;

//       return typedData.map(campfire => ({
//         campfireId: campfire.id,
//         name: campfire.name,
//         slug: campfire.slug,
//         description: campfire.description || '',
//         members: campfire.member_count,
//         purpose: campfire.purpose,
//         iconURL: campfire.icon_url || undefined,
//         isMember: userId
//           ? campfire.campfire_members.some(m => m.user_id === userId)
//           : false,
//       }));
//     },
//     staleTime: QUERY_STALE_TIME,
//     gcTime: QUERY_CACHE_TIME,
//     enabled: !!userId,
//     refetchOnWindowFocus: false,
//   });
// }
