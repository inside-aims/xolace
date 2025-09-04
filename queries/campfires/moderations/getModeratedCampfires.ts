import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useUserState } from '@/lib/store/user';

// Define a type for the returned data for better TypeScript support
export interface ModeratedCampfire {
  id: string;
  name: string;
  icon_url: string | null;
  slug: string;
  member_count: number;
  user_role_in_campfire: 'firestarter' | 'firekeeper';
}

const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const QUERY_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

/**
 * Fetches all campfires where the current user is a firestarter or firekeeper.
 */
export function getModeratedCampfires() {
  const user = useUserState(state => state.user);
  const userId = user?.id;

  const supabase = getSupabaseBrowserClient();

  return useQuery<ModeratedCampfire[]>({
    // The query key includes the userId to ensure data is refetched
    // if the user changes.
    queryKey: ['moderated-campfires', userId],

    queryFn: async () => {
      // Ensure we have a user before querying
      if (!userId) {
        return [];
      }

      // Query the 'campfire_members' table to find memberships where the user
      // has a moderator role. Then, use a join to pull in the details from the
      // 'campfires' table.
      const { data, error } = await supabase
        .from('campfire_members')
        .select(`
          role,
          campfires (
            id,
            name,
            icon_url,
            slug,
            member_count
          )
        `)
        .eq('user_id', userId)
        .in('role', ['firestarter', 'firekeeper']);

      if (error) {
        console.error('Error fetching moderated campfires:', error);
        throw new Error(error.message);
      }
      
      // The data from Supabase is slightly nested. We map over it to create
      // a clean, flat array of objects that is easier to work with in the UI.
      const formattedData = data?.map(item => ({
        // @ts-ignore - Supabase type inference can be tricky with joins
        id: item.campfires.id,
        // @ts-ignore
        name: item.campfires.name,
        // @ts-ignore
        icon_url: item.campfires.icon_url,
        // @ts-ignore
        slug: item.campfires.slug,
        // @ts-ignore
        member_count: item.campfires.member_count,
        user_role_in_campfire: item.role,
      })) || [];

      return formattedData as ModeratedCampfire[];
    },

    // The query will only run if a userId is available. This prevents
    // unnecessary requests for logged-out users.
    enabled: !!userId,

    // Set the stale time and cache time for the query.
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}