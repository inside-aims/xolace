import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { Comment, DetailPost } from '@/types/global';
import { logActivity } from '@/lib/activity-logger';
import { useUserState } from '@/lib/store/user';
import { createNotification } from '@/lib/actions/notifications.action';

const supabase = getSupabaseBrowserClient();

interface CreateCommentVariables {
  postId: string;
  commentText: string;
  postCreatedBy: string;
  parentId?: number;
  depth?: number;
  parentAuthorId? : string;
}

interface CreateCommentContext {
  previousComments: Comment[] | undefined;
  optimisticComment: Comment;
}

export function useCommentMutation(post: DetailPost) {
  const queryClient = useQueryClient();
  const user = useUserState(state => state.user);

  return useMutation<
    Comment, // Expected data type on success (the new comment)
    Error, // Expected error type
    CreateCommentVariables, // Variables passed to the mutation function
    CreateCommentContext // Context type for onMutate/onError
  >({
    mutationFn: async ({ postId, commentText, parentId , depth, parentAuthorId  }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post: postId,
          comment_text: commentText,
          parent_id: parentId ? Number(parentId) : null,
          depth: depth ? depth : 0,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Log activity after successful insertion
      const relatedUser =
        post.created_by === user?.id ? undefined : post.created_by;
      logActivity({
        userId: user?.id || '',
        relatedUserId: relatedUser ?? '',
        entityType: 'comment',
        action: 'commented',
        postId: postId,
        metadata: { content: commentText, link: `/post/${postId}` },
      });

      if (user?.id !== post.created_by && post.created_by) {
        await createNotification({
          recipient_user_id: post.created_by,
          actor_id: user?.id || null,
          type: 'new_comment',
          entity_id: postId,
          metadata: { content: commentText, link: `/post/${postId}` },
        });
      }

      if(parentAuthorId && user?.id !== parentAuthorId){
        await createNotification({
          recipient_user_id: parentAuthorId,
          actor_id: user?.id || null,
          type: 'comment_reply',
          entity_id: postId,
          metadata: { content: commentText, link: `/post/${postId}` },
        });
      }

      return data; // Return the inserted comment data
    },
    onMutate: async ({ postId, commentText, parentId, depth }) => {
      // Cancel any outgoing refetches for the comments query
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });

      // Snapshot the previous value of the comments query
      const previousComments = queryClient.getQueryData<Comment[]>([
        'comments',
        postId,
      ]);

      // Create an optimistic comment object (needs a temporary ID)
      const optimisticComment: Comment = {
        id: Math.random(), // Temporary ID for optimistic update
        post: postId,
        comment_text: commentText,
        created_at: new Date().toISOString(), // Use current time
        created_by: user?.id || '', // Use current user ID
        author_name: user?.username || 'Anonymous', // Use current username
        author_avatar_url: user?.avatar_url || null,
        depth: depth ? depth : 0,
        parent_id: parentId ? Number(parentId) : null,
        pinned_status: 'none',
      };

      // Optimistically update the comments list
      queryClient.setQueryData<Comment[]>(['comments', postId], old =>
        old ? [...old, optimisticComment] : [optimisticComment],
      );

      // Return context with the snapshot and optimistic comment
      return { previousComments, optimisticComment };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context to roll back the optimistic update
      if (context?.previousComments) {
        queryClient.setQueryData<Comment[]>(
          ['comments', variables.postId],
          context.previousComments,
        );
      }
      console.error('Comment mutation failed:', err);
      // You might want to show a toast notification here
    },
    onSuccess: (newComment, variables, context) => {
      // Replace the optimistic comment with the actual comment from the server
      queryClient.setQueryData<Comment[]>(['comments', variables.postId], old =>
        old?.map(comment =>
          comment.id === context?.optimisticComment.id ? newComment : comment,
        ),
      );
      // You might want to show a success toast notification here
    },
    onSettled: (data, error, variables) => {
      // Invalidate the comments query to refetch and ensure consistency
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.postId],
      });
    },
  });
}
