// hooks/campfires/moderations/useAddApprovedUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { useUserState } from '@/lib/store/user';

interface AddApprovedUserParams {
  campfireId: string;
  userId: string;
}

export const useAddApprovedUser = (campfireId: string) => {
  const user = useUserState(state => state.user)
  const queryClient = useQueryClient();
  const supabase = getSupabaseBrowserClient();

  return useMutation({
    mutationFn: async ({ userId }: Omit<AddApprovedUserParams, 'campfireId'>) => {

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // First check if the current user has permission
      const { data: hasPermission, error: permissionError } = await supabase.rpc(
        'has_campfire_permission',
        {
          p_campfire_id: campfireId,
          p_user_id: user.id,
          p_permission_key: 'can_manage_roles' // Assuming this is the required permission
        }
      );

      if (permissionError) {
        throw new Error(`Permission check failed: ${permissionError.message}`);
      }

      if (!hasPermission) {
        throw new Error('You do not have permission to manage members');
      }

      // Check if user is already a member of the campfire
      const { data: existingMember, error: memberCheckError } = await supabase
        .from('campfire_members')
        .select('id, is_approved')
        .eq('campfire_id', campfireId)
        .eq('user_id', userId)
        .single();

      if (memberCheckError && memberCheckError.code !== 'PGRST116') {
        throw new Error(`Failed to check membership: ${memberCheckError.message}`);
      }

      if (!existingMember) {
        throw new Error('User must be a member of the campfire first');
      }

      if (existingMember.is_approved) {
        throw new Error('User is already approved');
      }

      // Update the member to approved status
      const { error: updateError } = await supabase
        .from('campfire_members')
        .update({ is_approved: true })
        .eq('campfire_id', campfireId)
        .eq('user_id', userId);

      if (updateError) {
        throw new Error(`Failed to approve user: ${updateError.message}`);
      }

      return { success: true };
    },
    onSuccess: () => {
      // Invalidate and refetch approved users list
      queryClient.invalidateQueries({
        queryKey: ['campfire-approved-users', campfireId]
      });
      toast.success('User has been approved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve user');
    },
  });
};