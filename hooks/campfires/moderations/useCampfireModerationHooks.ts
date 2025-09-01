import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/utils/supabase/client'
import { toast } from 'sonner'


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