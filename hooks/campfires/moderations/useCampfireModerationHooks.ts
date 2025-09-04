import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/utils/supabase/client'
import { toast } from 'sonner'


interface CreateInviteParams {
  inviteeId: string;
  permissionIds: number[];
  invitationMessage?: string;
}

interface CreateInviteResponse {
  invitationId: string;
}

export const useCreateFirekeeperInvite = (campfireId: string) => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: async (params: {
        inviteeId: string
        permissionIds: number[]
        invitationMessage?: string
      }) => {
        const response = await fetch(`/api/v1/campfires/${campfireId}/firekeepers/invite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        })
  
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create invitation')
        }
  
        return response.json()
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['moderator-invites', campfireId] })
        toast.success('Moderator invitation sent successfully')
      },
      onError: (error: Error) => {
        toast.error(error.message)
      }
    })
  }


export const useCreateFirekeeperInviteV2 = (campfireId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateInviteParams): Promise<CreateInviteResponse> => {
      const response = await fetch(`/api/v1/campfires/${campfireId}/firekeepers/invite`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to create invitation`);
      }

      return response.json();
    },
    onMutate: async (variables) => {
      // Optimistic update could be implemented here if needed
      // For now, we'll just show a loading state
      toast.loading('Sending invitation...', { id: 'invite-loading' });
    },
    onSuccess: (data, variables) => {
      // Dismiss loading toast
      toast.dismiss('invite-loading');
      
      // Show success message
      toast.success('Firekeeper invitation sent successfully!', {
        description: 'They will receive a notification about the invitation.',
        duration: 4000,
      });

      // Invalidate and refetch related queries if any
    },
    onError: (error: Error, variables) => {
      // Dismiss loading toast
      toast.dismiss('invite-loading');
      
      // Show error message
      toast.error('Failed to send invitation', {
        description: error.message || 'Please try again later.',
        duration: 5000,
      });
      
      console.error('Firekeeper invite error:', {
        error: error.message,
        campfireId,
        variables,
      });
    },
    onSettled: () => {
      // Ensure loading toast is dismissed
      toast.dismiss('invite-loading');
    },
    // Retry configuration for network errors
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx), only on server errors (5xx) or network errors
      const isClientError = error.message.includes('HTTP 4');
      return !isClientError && failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};


export const useAcceptModeratorInvite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await fetch(`/api/v1/firekeeper-invites/${invitationId}/accept`, {
        method: 'POST'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to accept invitation')
      }

      return response.json()
    },
    onMutate: async (variables) => {
      toast.loading('Accepting invitation...', { id: 'accept-loading' });
    },
    onSuccess: () => {
      // Dismiss loading toast
      toast.dismiss('accept-loading');
      
      // Show success message
      toast.success('You are now a firekeeper🔥!')
      queryClient.invalidateQueries({ queryKey: ['campfires'] })
      queryClient.invalidateQueries({queryKey: ['campfire-moderators']})
    },
    onError: (error: Error, variables) => {
      // Dismiss loading toast
      toast.dismiss('accept-loading');
      
      // Show error message
      toast.error('Failed to accept invitation', {
        description: error.message || 'Please try again later.',
        duration: 5000,
      });
      
      console.error('Accept moderator invite error:', {
        error: error.message,
        variables,
      });
      toast.error(error.message)
    }
  })
}

export const useDeclineModeratorInvite = () => {
  const queryClient = useQueryClient()
  const supabase = getSupabaseBrowserClient()

  return useMutation({
    mutationFn: async (invitationId: string) => {

      // first check if the invitation has not expired or been accepted
      const { data: invite, error: inviteError } = await supabase
        .from('campfire_moderator_invites')
        .select('accepted_at, declined_at, expires_at')
        .eq('id', invitationId)
        .single()

      if (inviteError || !invite) {
        throw new Error('Invitation not found')
      }

      if( invite.expires_at < new Date().toISOString() ) {
        throw new Error('Invitation has expired')
      }

      if (invite.accepted_at || invite.declined_at) {
        throw new Error('Invitation has already been accepted or declined')
      }

      const { error } = await supabase
        .from('campfire_moderator_invites')
        .update({ declined_at: new Date().toISOString() })
        .eq('id', invitationId)

      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Invitation declined')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}