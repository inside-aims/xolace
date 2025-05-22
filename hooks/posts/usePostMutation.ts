import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { logActivity } from '@/lib/activity-logger';

const supabase = getSupabaseBrowserClient();

// New hook for post and comment mutations
export function usePostMutations() {
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: async ({
      postId,
      postCreatedBy,
      content,
    }: {
      postId: string;
      postCreatedBy: string | undefined;
      content: string | undefined;
    }) => {
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (deleteError) {
        throw new Error('Failed to delete post');
      }

      // log post activity
      await logActivity({
        userId: postCreatedBy || '',
        entityType: 'post',
        action: 'deleted',
        postId: postId,
        metadata: { content: content },
      });
    },
    onSuccess: (data, variables) => {
      toast.success('Post deleted successfully!');
      // Invalidate posts query to reflect the deletion
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      // Navigate to feed page if it was the details page (handled in component)
    },
    onError: error => {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post. Please try again.');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      postId,
      postCreatedBy,
      content,
      userId,
    }: {
      commentId: number;
      postId: string | undefined;
      postCreatedBy: string | undefined;
      content: string | undefined;
      userId: string | undefined;
    }) => {
      await supabase.from('comments').delete().eq('id', commentId);

      // log comment activity
      await logActivity({
        userId: userId || '',
        relatedUserId: postCreatedBy,
        entityType: 'comment',
        action: 'deleted',
        postId: postId,
        metadata: { content: content, link: `post/${postId}` },
      });
    },
    onSuccess: (_, variables) => {
      toast.success('Comment deleted successfully!');
      // Invalidate queries that might show comments, e.g., post details
      //queryClient.invalidateQueries({ queryKey: ['comments'] }); // Assuming a 'comments' query key exists
      //queryClient.invalidateQueries({ queryKey: ['post', variables.postId] }); // Invalidate specific post details
    },
    onError: error => {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment. Please try again.');
    },
  });

  return {
    deletePost: deletePostMutation.mutate,
    isDeletingPost: deletePostMutation.isPending,
    deleteComment: deleteCommentMutation.mutate,
    isDeletingComment: deleteCommentMutation.isPending,
  };
}
