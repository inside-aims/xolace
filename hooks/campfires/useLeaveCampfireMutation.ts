// hooks/campfires/useLeaveCampfireMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveCampfire } from '@/lib/actions/campfireCreation.action';
import { useUserState } from '@/lib/store/user';
import { Campfire } from '@/queries/campfires/getAllPublicCampfires';
import { CampfireDetails } from '@/queries/campfires/getCampfireWithSlug';
import { toast } from 'sonner';
import { invalidateFeaturedCampfireCache } from '@/queries/posts/useGetFeaturedCampfire';

interface LeaveCampfireContext {
  previousCampfires: Campfire[] | undefined;
  previousCampfireDetails: CampfireDetails | undefined;
}

export function useLeaveCampfireMutation() {
  const queryClient = useQueryClient();
  const user = useUserState(state => state.user);

  return useMutation<void, Error, string, LeaveCampfireContext>({
    mutationFn: async campfireId => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      await leaveCampfire(campfireId, user.id);
    },
    onMutate: async campfireId => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['campfires'] });

      // Snapshot the previous values
      const previousCampfires = queryClient.getQueryData<Campfire[]>([
        'campfires',
        'public',
      ]);

      const previousCampfireDetails = queryClient.getQueryData<CampfireDetails>(
        ['campfires', 'public', campfireId],
      );

      // Optimistically update public campfires list
      queryClient.setQueryData<Campfire[]>(['campfires', 'public'], old => {
        if (!old) return [];
        return old.map(campfire =>
          campfire.campfireId === campfireId
            ? {
                ...campfire,
                isMember: false,
                members: Math.max(0, campfire.members - 1),
              }
            : campfire,
        );
      });

      // Optimistically update campfire details
      if (previousCampfireDetails) {
        queryClient.setQueryData<CampfireDetails>(
          ['campfires', 'public', campfireId],
          {
            ...previousCampfireDetails,
            isMember: false,
            members: Math.max(0, previousCampfireDetails.members - 1),
          },
        );
      }

      return { previousCampfires, previousCampfireDetails };
    },
    onError: (err, campfireId, context) => {
      // Rollback optimistic updates
      if (context?.previousCampfires) {
        queryClient.setQueryData(
          ['campfires', 'public'],
          context.previousCampfires,
        );
      }

      if (context?.previousCampfireDetails) {
        queryClient.setQueryData(
          ['campfires', 'public', campfireId],
          context.previousCampfireDetails,
        );
      }

      // Show err.message when it is Firestarters cannot leave their campfire. Transfer ownership first. or general message
      if (
        err.message ===
        'Firestarters cannot leave their campfire. Transfer ownership first.'
      ) {
        toast.error(err.message);
        return;
      }
      toast.error('Failed to leave campfire. Please try again.');
    },
    onSuccess: (_, campfireId) => {
      toast.success(
        'Successfully left campfire! We hope to see you again soon.',
      );

      // Invalidate related queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ['campfires', 'public', campfireId],
      });

      queryClient.invalidateQueries({
        queryKey: ['campfires', 'public', 'feed'],
      });

      queryClient.invalidateQueries({
        queryKey: ['campfire', 'members', campfireId],
      });

      queryClient.invalidateQueries({
        queryKey: ['campfires', 'user', 'joined', user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['campfires', 'user', 'favorites', user?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ['campfires', 'user', user?.id, 'count'],
      });

      queryClient.invalidateQueries({
        queryKey: ['campfire-membership', campfireId, user?.id],
      });
      invalidateFeaturedCampfireCache(queryClient);
    },
    onSettled: () => {
      // Always refetch the campfires list
      queryClient.invalidateQueries({ queryKey: ['campfires', 'public'] });
    },
  });
}
