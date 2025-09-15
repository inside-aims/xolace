import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voteAction } from '@/app/actions';
import { toast } from 'sonner';
import { EnhancedPost } from '@/queries/posts/getEnhancedFeed';

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
    
    onMutate: async ({ postId, voteType, currentVote, user_id }) => {
      // Cancel any outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['enhanced-feed'] });
      await queryClient.cancelQueries({ queryKey: ['userVote', postId] });

      // Calculate what the new vote should be
      const newVote = currentVote === voteType ? null : voteType;


      // Optimistically update the user vote
      queryClient.setQueryData(['userVote', postId, user_id], newVote);

      // Optimistically update the enhanced feed
      queryClient.setQueryData(['enhanced-feed', user_id], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: EnhancedPost) => {
              if (post.id === postId) {
                let newUpvotes = post.upvotes;
                let newDownvotes = post.downvotes;

                // Remove current vote if exists
                if (currentVote === 'upvote') newUpvotes = Math.max(0, newUpvotes - 1);
                if (currentVote === 'downvote') newDownvotes = Math.max(0, newDownvotes - 1);

                // Add new vote if different from current
                if (newVote === 'upvote') newUpvotes++;
                if (newVote === 'downvote') newDownvotes++;

                return {
                  ...post,
                  upvotes: newUpvotes,
                  downvotes: newDownvotes,
                };
              }
              return post;
            }),
          })),
        };
      });

      // Store previous data for potential rollback
      const previousFeedData = queryClient.getQueryData(['enhanced-feed', user_id]);
      const previousVoteData = queryClient.getQueryData(['userVote', postId, user_id]);

      return { previousFeedData, previousVoteData };
    },

    onSuccess: (result, variables) => {
      if (!result.success) {
        throw new Error(result.error || 'Vote failed');
      }

      const { data } = result;
      const { post, vote, action } = data;

      // Update user vote with server response
      const serverVote = vote?.vote_type || null;
      queryClient.setQueryData(['userVote', variables.postId, variables.user_id], serverVote);
      
      // Update enhanced feed with server data
      queryClient.setQueryData(['enhanced-feed', variables.user_id], (oldData: any) => {
        if (!oldData || !post) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((enhancedPost: EnhancedPost) => {
              if (enhancedPost.id === variables.postId) {
                return {
                  ...enhancedPost,
                  upvotes: post.upvotes || 0,
                  downvotes: post.downvotes || 0,
                };
              }
              return enhancedPost;
            }),
          })),
        };
      });

      // Invalidate other related queries for consistency
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
      
      // Optional: Show success feedback
      if (action === 'added') {
        // Optionally show success toast for new votes
        // toast.success(`Post ${variables.voteType}d!`);
      }
    },

    onError: (error, variables, context) => {
      console.error('Vote mutation failed:', error);
      toast.error('Failed to register your vote. Please try again.');
      
      // Rollback optimistic updates
      if (context?.previousFeedData) {
        queryClient.setQueryData(['enhanced-feed', variables.user_id], context.previousFeedData);
      }
      if (context?.previousVoteData !== undefined) {
        queryClient.setQueryData(['userVote', variables.postId, variables.user_id], context.previousVoteData);
      }
    },
  });

  return {
    mutateVote: voteMutation.mutateAsync,
    isLoading: voteMutation.isPending,
    isError: voteMutation.isError,
  };
}