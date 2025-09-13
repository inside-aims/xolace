import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voteAction } from '@/app/actions';
import { toast } from 'sonner';

export function useVoteMutations() {
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async ({
      postId,
      voteType,
      currentVote,
      user_id,
      relatedUserId,
    }: {
      postId: string;
      voteType: 'upvote' | 'downvote';
      currentVote: "upvote" | "downvote" | null | undefined;
      user_id: string;
      relatedUserId: string;
    }) => voteAction(postId, voteType, currentVote, user_id, relatedUserId),
    onMutate: async ({ postId }) => {
      // Cancel any outgoing refetches for the posts query
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      // Optionally cancel refetch for the specific user vote query
      await queryClient.cancelQueries({ queryKey: ['userVote', postId] });
    },
    onSuccess: (data, variables) => {
      // Invalidate the posts query to refetch updated vote counts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-feed', variables.user_id] });
      // Invalidate the user vote query for the specific post to refetch the user's current vote
      queryClient.invalidateQueries({
        queryKey: ['userVote', variables.postId, variables.user_id],
      });
    },
    onError: (error, variables, context) => {
      console.error('Vote mutation failed:', error);
      toast.error('Failed to register your vote. Please try again.');
    },
  });

  return {
    mutateVote: voteMutation.mutateAsync,
    isLoading: voteMutation.isPending,
    isError: voteMutation.isError,
  };
}
