import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCampfire } from '@/lib/actions/campfireCreation.action';
import { toast } from 'sonner';
import { Campfire } from '@/queries/campfires/getAllPublicCampfires';

interface CreateCampfireContext {
  previousCampfires: Campfire[] | undefined;
}

export function useCreateCampfireMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; data?: any; message?: string },
    Error,
    FormData,
    CreateCampfireContext
  >({
    mutationFn: async (formData: FormData) => {
      return await createCampfire(formData);
    },
    onMutate: async () => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['campfires', 'public'] });

      // Snapshot the previous value
      const previousCampfires = queryClient.getQueryData<Campfire[]>([
        'campfires',
        'public',
      ]);

      return { previousCampfires };
    },
    onError: (err, formData, context) => {
      // If we had cached data, restore it
      if (context?.previousCampfires) {
        queryClient.setQueryData(
          ['campfires', 'public'],
          context.previousCampfires,
        );
      }
      toast.error('Failed to create campfire. Please try again.');
      console.error('Failed to create campfire:', err);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Your campfire has been ignited! 🔥');
        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries({ queryKey: ['campfires'] });
        queryClient.invalidateQueries({ queryKey: ['user', 'campfires'] }); // if you have user's campfires query
      } else {
        toast.error(result.message || 'Failed to create campfire');
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['campfires', 'public'] });
    },
  });
}