import { useMutation, useQueryClient } from '@tanstack/react-query';
import { joinCampfire } from '@/lib/actions/campfireCreation.action';
import { useUserState } from '@/lib/store/user';
import { Campfire } from '@/queries/campfires/getAllPublicCampfires';
import { toast } from 'sonner';

interface JoinCampfireContext {
  previousCampfires: Campfire[] | undefined;
}

export function useJoinCampfireMutation() {
  const queryClient = useQueryClient();
  const user = useUserState(state => state.user);

  return useMutation<void, Error, string, JoinCampfireContext>({
    mutationFn: async campfireId => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      await joinCampfire(campfireId, user.id);
    },
    onMutate: async campfireId => {
      await queryClient.cancelQueries({ queryKey: ['campfires', 'public'] });

      const previousCampfires = queryClient.getQueryData<Campfire[]>([
        'campfires',
        'public',
      ]);

      queryClient.setQueryData<Campfire[]>(['campfires', 'public'], old => {
        if (!old) return [];
        return old.map(campfire =>
          campfire.campfireId === campfireId
            ? { ...campfire, isMember: true, members: campfire.members + 1 }
            : campfire,
        );
      });

      return { previousCampfires };
    },
    onError: (err, campfireId, context) => {
      if (context?.previousCampfires) {
        queryClient.setQueryData(
          ['campfires', 'public'],
          context.previousCampfires,
        );
      }
      toast.error('Failed to join campfire. Please try again.');
      console.error('Failed to join campfire:', err);
    },
    onSuccess: () => {
      toast.success('Successfully joined campfire!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['campfires', 'public'] });
    },
  });
}
