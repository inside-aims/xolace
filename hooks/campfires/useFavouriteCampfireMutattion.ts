// hooks/campfires/useFavoriteCampfireMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCampfireToFavorites, removeCampfireFromFavorites } from '@/lib/actions/campfireCreation.action';
import { useUserState } from '@/lib/store/user';
import { toast } from 'sonner';

export function useAddFavoriteCampfireMutation() {
  const queryClient = useQueryClient();
  const user = useUserState(state => state.user);

  return useMutation<void, Error, string>({
    mutationFn: async (campfireId: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      await addCampfireToFavorites(campfireId, user.id);
    },
    onMutate: async (campfireId) => {
      if (!user?.id) return;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: ['campfires', 'user'] 
      });

      // Optimistically update all related queries
      const updateQueries = [
        ['campfires', 'user', 'joined', user.id],
        ['campfires', 'user', 'favorites', user.id],
        ['campfires', 'public'],
      ];

      updateQueries.forEach(queryKey => {
        queryClient.setQueryData(queryKey, (oldData: any) => {
          if (!oldData?.pages) return oldData;
          
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              campfires: page.campfires.map((campfire: any) => {
                if (campfire.campfireId === campfireId) {
                  return {
                    ...campfire,
                    isFavorite: true,
                    isJoined: true, // Auto-join if not already joined
                    members: campfire.isJoined ? campfire.members : campfire.members + 1,
                  };
                }
                return campfire;
              }),
            })),
          };
        });
      });
    },
    onError: (error) => {
      toast.error('Failed to add to favorites. Please try again.');
      console.error('Failed to add to favorites:', error);
    },
    onSuccess: () => {
      toast.success('Added to favorites!');
    },
    onSettled: () => {
      // Invalidate all user campfire queries to ensure fresh data
      queryClient.invalidateQueries({ 
        queryKey: ['campfires', 'user'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['campfires', 'public'] 
      });
    },
  });
}

export function useRemoveFavoriteCampfireMutation() {
  const queryClient = useQueryClient();
  const user = useUserState(state => state.user);

  return useMutation<void, Error, string>({
    mutationFn: async (campfireId: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      await removeCampfireFromFavorites(campfireId, user.id);
    },
    onMutate: async (campfireId) => {
      if (!user?.id) return;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: ['campfires', 'user'] 
      });

      // Optimistically update all related queries
      const updateQueries = [
        ['campfires', 'user', 'joined', user.id],
        ['campfires', 'user', 'favorites', user.id],
        ['campfires', 'public'],
      ];

      updateQueries.forEach(queryKey => {
        queryClient.setQueryData(queryKey, (oldData: any) => {
          if (!oldData?.pages) return oldData;
          
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              campfires: page.campfires.map((campfire: any) => {
                if (campfire.campfireId === campfireId) {
                  return {
                    ...campfire,
                    isFavorite: false,
                    // Keep isJoined: true - user remains joined
                  };
                }
                return campfire;
              }),
            })),
          };
        });
      });
    },
    onError: (error) => {
      toast.error('Failed to remove from favorites. Please try again.');
      console.error('Failed to remove from favorites:', error);
    },
    onSuccess: () => {
      toast.success('Removed from favorites');
    },
    onSettled: () => {
      // Invalidate all user campfire queries to ensure fresh data
      queryClient.invalidateQueries({ 
        queryKey: ['campfires', 'user'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['campfires', 'public'] 
      });
    },
  });
}




// // hooks/campfires/useFavoriteCampfireMutation.ts
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { getSupabaseBrowserClient } from '@/utils/supabase/client';
// import { useUserState } from '@/lib/store/user';
// import { toast } from 'sonner';
// import { CampfirePurpose } from '@/components/campfires/campfires.types';

// export interface UserCampfire {
//   campfireId: string;
//   name: string;
//   slug: string;
//   description: string;
//   members: number;
//   purpose: CampfirePurpose;
//   iconURL?: string;
//   isFavorite: boolean;
//   isJoined: boolean;
//   joinedAt?: string;
//   role?: 'creator' | 'moderator' | 'camper';
//   favoritedAt?: string;
// }

// interface FavoriteCampfireContext {
//   previousJoinedPages: any;
//   previousFavoritePages: any;
// }

// export function useAddFavoriteCampfireMutation() {
//   const queryClient = useQueryClient();
//   const user = useUserState(state => state.user);
//   const supabase = getSupabaseBrowserClient();

//   return useMutation<void, Error, string, FavoriteCampfireContext>({
//     mutationFn: async (campfireId: string) => {
//       if (!user?.id) {
//         throw new Error('User not authenticated');
//       }

//       const { error } = await supabase
//         .from('favorite_campfires')
//         .insert({
//           user_id: user.id,
//           campfire_id: campfireId,
//         });

//       if (error) {
//         throw new Error(error.message);
//       }
//     },
//     onMutate: async (campfireId) => {
//       // Cancel any outgoing refetches
//       await queryClient.cancelQueries({ 
//         queryKey: ['campfires', 'user', user?.id] 
//       });

//       // Snapshot the previous value for both joined and favorite queries
//       const previousJoinedPages = queryClient.getQueryData([
//         'campfires', 
//         'user', 
//         'joined',
//         user?.id, 
//         ''
//       ]);

//       const previousFavoritePages = queryClient.getQueryData([
//         'campfires', 
//         'user', 
//         'favorites',
//         user?.id, 
//         ''
//       ]);

//       // Optimistically update joined campfires cache
//       queryClient.setQueryData(
//         ['campfires', 'user', 'joined', user?.id, ''],
//         (old: any) => {
//           if (!old?.pages) return old;

//           return {
//             ...old,
//             pages: old.pages.map((page: any) => ({
//               ...page,
//               campfires: page.campfires.map((campfire: UserCampfire) =>
//                 campfire.campfireId === campfireId
//                   ? { ...campfire, isFavorite: true }
//                   : campfire
//               ),
//             })),
//           };
//         }
//       );

//       // Invalidate favorite campfires to refetch (since it might add a new item)
//       queryClient.invalidateQueries({
//         queryKey: ['campfires', 'user', 'favorites', user?.id],
//         exact: false,
//       });

//       // Also update any search queries for joined campfires
//       queryClient.invalidateQueries({
//         queryKey: ['campfires', 'user', 'joined', user?.id],
//         exact: false,
//       });

//       return { previousJoinedPages, previousFavoritePages };
//     },
//     onError: (err, campfireId, context) => {
//       // Rollback optimistic updates
//       if (context?.previousJoinedPages) {
//         queryClient.setQueryData(
//           ['campfires', 'user', 'joined', user?.id, ''],
//           context.previousJoinedPages
//         );
//       }
      
//       if (context?.previousFavoritePages) {
//         queryClient.setQueryData(
//           ['campfires', 'user', 'favorites', user?.id, ''],
//           context.previousFavoritePages
//         );
//       }
      
//       toast.error('Failed to add to favorites. Please try again.');
//       console.error('Failed to add to favorites:', err);
//     },
//     onSuccess: () => {
//       toast.success('Added to favorites!', {
//         icon: '⭐',
//       });
//     },
//     onSettled: () => {
//       // Refetch both queries to ensure consistency
//       queryClient.invalidateQueries({
//         queryKey: ['campfires', 'user', 'joined', user?.id],
//       });
//       queryClient.invalidateQueries({
//         queryKey: ['campfires', 'user', 'favorites', user?.id],
//       });
//     },
//   });
// }

// export function useRemoveFavoriteCampfireMutation() {
//   const queryClient = useQueryClient();
//   const user = useUserState(state => state.user);
//   const supabase = getSupabaseBrowserClient();

//   return useMutation<void, Error, string, FavoriteCampfireContext>({
//     mutationFn: async (campfireId: string) => {
//       if (!user?.id) {
//         throw new Error('User not authenticated');
//       }

//       const { error } = await supabase
//         .from('favorite_campfires')
//         .delete()
//         .eq('user_id', user.id)
//         .eq('campfire_id', campfireId);

//       if (error) {
//         throw new Error(error.message);
//       }
//     },
//     onMutate: async (campfireId) => {
//       // Cancel any outgoing refetches
//       await queryClient.cancelQueries({ 
//         queryKey: ['campfires', 'user'] 
//       });

//       // Snapshot the previous values for both queries
//       const previousJoinedPages = queryClient.getQueryData([
//         'campfires', 
//         'user', 
//         'joined',
//         user?.id, 
//         ''
//       ]);

//       const previousFavoritePages = queryClient.getQueryData([
//         'campfires', 
//         'user', 
//         'favorites',
//         user?.id, 
//         ''
//       ]);

//       // Optimistically update joined campfires cache
//       queryClient.setQueryData(
//         ['campfires', 'user', 'joined', user?.id, ''],
//         (old: any) => {
//           if (!old?.pages) return old;

//           return {
//             ...old,
//             pages: old.pages.map((page: any) => ({
//               ...page,
//               campfires: page.campfires.map((campfire: UserCampfire) =>
//                 campfire.campfireId === campfireId
//                   ? { ...campfire, isFavorite: false }
//                   : campfire
//               ),
//             })),
//           };
//         }
//       );

//       // Optimistically update favorite campfires cache (remove the item)
//       queryClient.setQueryData(
//         ['campfires', 'user', 'favorites', user?.id, ''],
//         (old: any) => {
//           if (!old?.pages) return old;

//           return {
//             ...old,
//             pages: old.pages.map((page: any) => ({
//               ...page,
//               campfires: page.campfires.filter((campfire: UserCampfire) =>
//                 campfire.campfireId !== campfireId
//               ),
//             })),
//           };
//         }
//       );

//       // Update search queries
//       queryClient.invalidateQueries({
//         queryKey: ['campfires', 'user', 'joined', user?.id],
//         exact: false,
//       });
//       queryClient.invalidateQueries({
//         queryKey: ['campfires', 'user', 'favorites', user?.id],
//         exact: false,
//       });

//       return { previousJoinedPages, previousFavoritePages };
//     },
//     onError: (err, campfireId, context) => {
//       // Rollback optimistic updates
//       if (context?.previousJoinedPages) {
//         queryClient.setQueryData(
//           ['campfires', 'user', 'joined', user?.id, ''],
//           context.previousJoinedPages
//         );
//       }
      
//       if (context?.previousFavoritePages) {
//         queryClient.setQueryData(
//           ['campfires', 'user', 'favorites', user?.id, ''],
//           context.previousFavoritePages
//         );
//       }
      
//       toast.error('Failed to remove from favorites. Please try again.');
//       console.error('Failed to remove from favorites:', err);
//     },
//     onSuccess: () => {
//       toast.success('Removed from favorites');
//     },
//     onSettled: () => {
//       // Refetch both queries to ensure consistency
//       queryClient.invalidateQueries({
//         queryKey: ['campfires', 'user', 'joined', user?.id],
//       });
//       queryClient.invalidateQueries({
//         queryKey: ['campfires', 'user', 'favorites', user?.id],
//       });
//     },
//   });
// }