import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveCampfire } from '@/lib/actions/campfireCreation.action';
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
      await leaveCampfire(campfireId, user.id);
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
            ? { ...campfire, isMember: false, members: campfire.members - 1 }
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
      toast.error('Failed to leave campfire. Please try again.');
      console.error('Failed to leave campfire:', err);
    },
    onSuccess: () => {
      toast.success('Successfully left campfire! Kindly send us your feedback.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['campfires', 'public'] });
    },
  });
}
