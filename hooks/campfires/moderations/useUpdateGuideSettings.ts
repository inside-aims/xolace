import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { CampfireWithGuide } from '@/types/campfire';
import { useUserState } from '@/lib/store/user';


export const useUpdateGuideSettings = (campfireId: string) => {
    const queryClient = useQueryClient();
    const supabase = getSupabaseBrowserClient();
    const user = useUserState(state => state.user)
  
    return useMutation({
      mutationFn: async (updates: Partial<Omit<CampfireWithGuide, 'resources' | 'id' | 'name' | 'slug' | 'description' | 'icon_url' | 'banner_url'>>) => {
        // Check permission first
        if (!user?.id) {
            throw new Error('User not authenticated');
          }
  
        const { data: hasPermission, error: permissionError } = await supabase.rpc(
          'has_campfire_permission',
          {
            p_campfire_id: campfireId,
            p_user_id: user.id,
            p_permission_key: 'can_edit_settings'
          }
        );
  
        if (permissionError) {
          throw new Error(`Permission check failed: ${permissionError.message}`);
        }
  
        if (!hasPermission) {
          throw new Error('You do not have permission to edit campfire settings');
        }
  
        // Update campfire guide settings
        const { error: updateError } = await supabase
          .from('campfires')
          .update(updates)
          .eq('id', campfireId);
  
        if (updateError) {
          throw new Error(`Failed to update guide settings: ${updateError.message}`);
        }
  
        return updates;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['campfire-guide', campfireId] });
        toast.success('Guide settings updated successfully');
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to update guide settings');
      },
    });
  };
  
  // Update guide resources
  export const useUpdateGuideResources = (campfireId: string) => {
    const queryClient = useQueryClient();
    const supabase = getSupabaseBrowserClient();
    const user = useUserState(state => state.user)
  
    return useMutation({
      mutationFn: async (resources: { label: string; url?: string }[]) => {
        // Check permission first
        if (!user?.id) {
            throw new Error('User not authenticated');
          }
  
        const { data: hasPermission, error: permissionError } = await supabase.rpc(
          'has_campfire_permission',
          {
            p_campfire_id: campfireId,
            p_user_id: user.id,
            p_permission_key: 'can_edit_settings'
          }
        );
  
        if (permissionError) {
          throw new Error(`Permission check failed: ${permissionError.message}`);
        }
  
        if (!hasPermission) {
          throw new Error('You do not have permission to edit campfire settings');
        }
  
        if (resources.length > 3) {
          throw new Error('Maximum 3 resources allowed');
        }
  
        // Delete existing resources
        const { error: deleteError } = await supabase
          .from('campfire_guide_resources')
          .delete()
          .eq('campfire_id', campfireId);
  
        if (deleteError) {
          throw new Error(`Failed to delete existing resources: ${deleteError.message}`);
        }
  
        // Insert new resources if any
        if (resources.length > 0) {
          const resourcesToInsert = resources.map((resource, index) => ({
            campfire_id: campfireId,
            label: resource.label,
            url: resource.url || null,
            sort_order: index
          }));
  
          const { error: insertError } = await supabase
            .from('campfire_guide_resources')
            .insert(resourcesToInsert);
  
          if (insertError) {
            throw new Error(`Failed to create resources: ${insertError.message}`);
          }
        }
  
        return resources;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['campfire-guide', campfireId] });
        toast.success('Guide resources updated successfully');
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to update guide resources');
      },
    });
  };