import { useInfiniteQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { CampfirePurpose } from '@/components/campfires/campfires.types';
import { UserCampfireFavoriteJoin } from '@/components/campfires/campfires.types';

interface UserCampfiresPage {
  campfires: UserCampfireFavoriteJoin[];
  nextCursor: number | null;
  hasMore: boolean;
}

const PAGE_SIZE = 20;
const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const QUERY_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

// Get all joined campfires (including favorites)
export function getUserJoinedCampfires(userId?: string, searchTerm: string = '') {
  const supabase = getSupabaseBrowserClient();

  return useInfiniteQuery<UserCampfiresPage, Error>({
    queryKey: ['campfires', 'user', 'joined', userId, searchTerm],
    queryFn: async ({ pageParam = 0 }) => {
      if (!userId) {
        return { campfires: [], nextCursor: null, hasMore: false };
      }

      const offset = (pageParam as number) * PAGE_SIZE;

      let query = supabase
        .from('campfire_members')
        .select(`
          campfire_id,
          role,
          joined_at,
          is_favorite,
          campfires!inner(
            id,
            name,
            slug,
            description,
            member_count,
            purpose,
            icon_url,
            visibility
          )
        `)
        .eq('user_id', userId)
        .eq('campfires.visibility', 'public') // Only show public campfires
        .order('joined_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      console.log("searchTerm ", searchTerm)
      // Apply search filter if provided
      if (searchTerm.trim()) {
        query = query.or(
            `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`,
            { foreignTable: 'campfires' }
          );
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching joined campfires:', error);
        throw new Error(error.message);
      }

      if (!data) {
        return { campfires: [], nextCursor: null, hasMore: false };
      }

      const typedData = data as unknown as Array<{
        campfire_id: string;
        role: 'firestarter' | 'firekeeper' | 'camper';
        joined_at: string;
        is_favorite: boolean;
        campfires: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          member_count: number;
          purpose: CampfirePurpose;
          icon_url: string | null;
          visibility: 'public' | 'private';
        };
      }>;

      const campfires: UserCampfireFavoriteJoin[] = typedData.map(item => ({
        campfireId: item.campfires.id,
        name: item.campfires.name,
        slug: item.campfires.slug,
        description: item.campfires.description || '',
        members: item.campfires.member_count,
        purpose: item.campfires.purpose,
        iconURL: item.campfires.icon_url || undefined,
        isFavorite: item.is_favorite,
        isJoined: true, // Always true since we're querying from campfire_members
        joinedAt: item.joined_at,
        role: item.role,
        favoritedAt: item.is_favorite ? item.joined_at : undefined, // Use joined_at as favorite date for simplicity
      }));

      const hasMore = data.length === PAGE_SIZE;
      const nextCursor = hasMore ? (pageParam as number) + 1 : null;

      return {
        campfires,
        nextCursor,
        hasMore,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_CACHE_TIME,
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
}





// // hooks/campfires/useUserCampfires.ts
// import { useInfiniteQuery } from '@tanstack/react-query';
// import { getSupabaseBrowserClient } from '@/utils/supabase/client';
// import { CampfirePurpose } from '@/components/campfires/campfires.types';
// import { UserCampfireFavoriteJoin } from '@/components/campfires/campfires.types';

// interface UserCampfiresPage {
//   campfires: UserCampfireFavoriteJoin[];
//   nextCursor: number | null;
//   hasMore: boolean;
// }

// const PAGE_SIZE = 20;
// const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes
// const QUERY_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

// export function getUserJoinedCampfires(
//   userId?: string,
//   searchTerm: string = '',
// ) {
//   const supabase = getSupabaseBrowserClient();

//   return useInfiniteQuery<UserCampfiresPage, Error>({
//     queryKey: ['campfires', 'user', 'joined', userId, searchTerm],
//     queryFn: async ({ pageParam = 0 }) => {
//       if (!userId) {
//         return { campfires: [], nextCursor: null, hasMore: false };
//       }

//       const offset = (pageParam as number) * PAGE_SIZE;

//       let query = supabase
//         .from('campfire_members')
//         .select(
//           `
//             campfire_id,
//             role,
//             joined_at,
//             campfires!inner(
//               id,
//               name,
//               slug,
//               description,
//               member_count,
//               purpose,
//               icon_url
//             )
//           `,
//         )
//         .eq('user_id', userId)
//         .order('joined_at', { ascending: false })
//         .range(offset, offset + PAGE_SIZE - 1);

//       // Apply search filter if provided
//       if (searchTerm.trim()) {
//         query = query.or(
//           `campfires.name.ilike.%${searchTerm}%,campfires.description.ilike.%${searchTerm}%`,
//         );
//       }

//       const { data, error } = await query;

//       if (error) {
//         console.error('Error fetching joined campfires:', error);
//         throw new Error(error.message);
//       }

//       if (!data) {
//         return { campfires: [], nextCursor: null, hasMore: false };
//       }

//       // Now get favorite data for these campfires in a separate query
//       const campfireIds = data.map(item => item.campfire_id);
//       const { data: favoriteData } = await supabase
//         .from('favorite_campfires')
//         .select('campfire_id, created_at')
//         .eq('user_id', userId)
//         .in('campfire_id', campfireIds);

//       // Create a map for quick lookup
//       const favoritesMap = new Map(
//         favoriteData?.map(fav => [fav.campfire_id, fav]) || [],
//       );

//       const typedData = data as unknown as Array<{
//         campfire_id: string;
//         role: 'firestarter' | 'firekeeper' | 'camper';
//         joined_at: string;
//         campfires: {
//           id: string;
//           name: string;
//           slug: string;
//           description: string | null;
//           member_count: number;
//           purpose: CampfirePurpose;
//           icon_url: string | null;
//         };
//       }>;

//       const campfires: UserCampfireFavoriteJoin[] = typedData.map(item => {
//         const favorite = favoritesMap.get(item.campfire_id);

//         return {
//           campfireId: item.campfires.id,
//           name: item.campfires.name,
//           slug: item.campfires.slug,
//           description: item.campfires.description || '',
//           members: item.campfires.member_count,
//           purpose: item.campfires.purpose,
//           iconURL: item.campfires.icon_url || undefined,
//           isFavorite: !!favorite,
//           isJoined: true, // Always true since we're querying from campfire_members
//           joinedAt: item.joined_at,
//           role: item.role,
//           favoritedAt: favorite?.created_at,
//         };
//       });

//       const hasMore = data.length === PAGE_SIZE;
//       const nextCursor = hasMore ? (pageParam as number) + 1 : null;

//       return {
//         campfires,
//         nextCursor,
//         hasMore,
//       };
//     },
//     getNextPageParam: lastPage => lastPage.nextCursor,
//     initialPageParam: 0,
//     staleTime: QUERY_STALE_TIME,
//     gcTime: QUERY_CACHE_TIME,
//     enabled: !!userId,
//     refetchOnWindowFocus: false,
//   });
// }
