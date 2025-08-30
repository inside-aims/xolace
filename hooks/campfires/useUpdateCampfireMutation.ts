// hooks/campfires/useUpdateCampfireMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

// Define the shape of the variables the mutation will accept
export interface UpdateCampfireVariables {
  campfireId: string;
  slug: string; // We need the slug to invalidate the specific campfire query
  updates: {
    name?: string;
    description?: string;
    slug?: string;
    // Add any other updatable fields here
  };
}

export const useUpdateCampfireMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const supabase = getSupabaseBrowserClient();

  return useMutation<void, Error, UpdateCampfireVariables>({
    // The mutation function itself: performs the async update
    mutationFn: async ({ campfireId, updates }) => {
      const { error } = await supabase
        .from('campfires')
        .update(updates)
        .eq('id', campfireId);

      if (error) {
        // If the database update fails, throw an error
        throw new Error(error.message);
      }
    },
    // After the mutation succeeds, invalidate relevant queries to refetch fresh data
    onSuccess: (data, variables) => {
      if (variables.updates.slug) {
        const newPath = `/mod/${variables.updates.slug}/settings`;
        router.replace(newPath);
      }else{
        // Invalidate the query for the specific campfire that was just updated
        queryClient.invalidateQueries({ queryKey: ['campfire', variables.slug] });
        
        // Optionally, invalidate any general list of campfires
        queryClient.invalidateQueries({ queryKey: ['campfires', 'public'] });
      }
      
    },
    // You can also add onError for global error handling, e.g., logging
    onError: (error) => {
        console.error("Campfire update failed:", error);
    }
  });
};