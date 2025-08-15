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