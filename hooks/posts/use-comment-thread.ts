// /hooks/use-comment-thread.ts

import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import type { Comment } from '@/types/global'; // Your existing Comment type

// Add a 'replies' property to our Comment type for the nested structure
export type NestedComment = Comment & { replies: NestedComment[] };

// Helper function to transform the flat list into a tree
export const nestComments = (comments: Comment[]): NestedComment[] => {
  const commentMap = new Map<number, NestedComment>();
  const nestedComments: NestedComment[] = [];

  // First pass: create a map of all comments and add a 'replies' array
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: link replies to their parents
  comments.forEach(comment => {
    const nestedComment = commentMap.get(comment.id)!;
    if (comment.parent_id && commentMap.has(comment.parent_id)) {
      commentMap.get(comment.parent_id)!.replies.push(nestedComment);
    } else {
      // This is a top-level comment
      nestedComments.push(nestedComment);
    }
  });

  return nestedComments;
};


export function useCommentThread(postId: string) {
  const supabase = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_comments_with_replies', {
        post_id_param: postId,
      });

      if (error) throw new Error(error.message);

      // Fetch the flat list, then nest it for the UI
      return nestComments(data as Comment[]);
    },
    enabled: !!postId,
  });
}