import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useUserState } from '@/lib/store/user';
import { EnhancedPost } from '@/queries/posts/getEnhancedFeed';

interface NewRealtimePost {
  author_avatar_url: string;
  author_name: string;
  author_roles: string[];
  campfire_id: string | null;
  content: string;
  created_at: string; // ISO date string
  created_by: string; // UUID
  daily_prompt_id: string | null;
  downvotes: number;
  duration: number | null;
  expires_at: string | null; // ISO date string or null
  expires_in_24hr: boolean;
  id: string; // UUID
  is_prompt_response: boolean;
  is_reshared_anon_meg: boolean;
  is_sensitive: boolean;
  mood: string;
  type: string;
  upvotes: number;
}

interface Vote {
  id: number;
  post_id?: string;   // present in INSERT/UPDATE
  user_id?: string;   // present in INSERT/UPDATE
  vote_type?: "upvote" | "downvote"; // present in INSERT/UPDATE
  created_at?: string; // present in INSERT/UPDATE
}

interface VotePayload {
  schema: string;
  table: string;
  commit_timestamp: string; // ISO timestamp
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: Partial<Vote>; // INSERT/UPDATE fill this
  old: Partial<Vote>; // DELETE/UPDATE fill this
  errors: string | null;
}



export function useEnhancedRealtimePosts() {
  const queryClient = useQueryClient();
  const supabase = getSupabaseBrowserClient();
  const user = useUserState(state => state.user);

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to posts table changes
    const postsSubscription = supabase
      .channel('enhanced-feed-posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        async (payload) => {
          // For new posts, we need to check if they should appear in user's feed
          if (payload.eventType === 'INSERT') {
            const newPost = payload.new as any;
            
            // Check if this post should be in user's feed
            const shouldInclude = await checkPostVisibility(newPost, user.id);
            
            if (shouldInclude) {
              // Invalidate and refetch the feed to maintain proper ordering
              queryClient.invalidateQueries({
                queryKey: ['enhanced-feed', user.id]
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedPost = payload.new as NewRealtimePost;
            
            // Update the post in cache with new vote counts
            queryClient.setQueryData(
              ['enhanced-feed', user.id],
              (oldData: any) => {
                if (!oldData) return oldData;
                
                return {
                  ...oldData,
                  pages: oldData.pages.map((page: any) => ({
                    ...page,
                    posts: page.posts.map((post: EnhancedPost) => {
                      if (post.id === updatedPost.id) {
                        return {
                          ...post,
                          upvotes: updatedPost.upvotes || post.upvotes,
                          downvotes: updatedPost.downvotes || post.downvotes,
                          // Update other fields that might have changed
                          content: updatedPost.content || post.content,
                          is_sensitive: updatedPost.is_sensitive ?? post.is_sensitive,
                        };
                      }
                      return post;
                    })
                  }))
                };
              }
            );

            // Also invalidate single post queries
            queryClient.invalidateQueries({
              queryKey: ['post', updatedPost.id]
            });
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted post from cache
            queryClient.setQueryData(
              ['enhanced-feed', user.id],
              (oldData: any) => {
                if (!oldData) return oldData;
                
                return {
                  ...oldData,
                  pages: oldData.pages.map((page: any) => ({
                    ...page,
                    posts: page.posts.filter((post: EnhancedPost) => 
                      post.id !== payload.old.id
                    )
                  }))
                };
              }
            );
          }
        }
      )
      .subscribe();

    // Subscribe to votes table for real-time vote updates
    const votesSubscription = supabase
      .channel('enhanced-feed-votes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes'
        },
        (payload) => {
          if(payload.eventType === 'INSERT'){
            const voteData = payload.new as Vote;
            
            // Only invalidate if it's not from the current user (to avoid conflicts with optimistic updates)
            if (voteData?.user_id !== user.id) {
              // Invalidate the enhanced feed to get fresh vote counts
              queryClient.invalidateQueries({
                queryKey: ['enhanced-feed', user.id]
              });
            }
          }
          if(payload.eventType === 'DELETE'){
            const voteData = payload.old as Partial<Vote>;
            
            // voteData only returns old vote id , nothing else
            // Only invalidate if it's not from the current user (to avoid conflicts with optimistic updates)
              // Invalidate the enhanced feed to get fresh vote counts
              queryClient.invalidateQueries({
                queryKey: ['enhanced-feed', user.id]
              });

          }
          
        }
      )
      .subscribe();

    // Subscribe to campfire membership changes (affects feed visibility)
    const membershipSubscription = supabase
      .channel('enhanced-feed-memberships')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campfire_members',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // User joined/left a campfire, refresh entire feed
          queryClient.invalidateQueries({
            queryKey: ['enhanced-feed', user.id]
          });
        }
      )
      .subscribe();

    // Subscribe to comments for real-time comment count updates
    // const commentsSubscription = supabase
    //   .channel('enhanced-feed-comments')
    //   .on(
    //     'postgres_changes',
    //     {
    //       event: '*',
    //       schema: 'public',
    //       table: 'comments'
    //     },
    //     (payload) => {
    //       const commentData = payload.new || payload.old;
          
    //       // Update comment counts in cache
    //       queryClient.setQueryData(
    //         ['enhanced-feed', user.id],
    //         (oldData: any) => {
    //           if (!oldData || !commentData?.post_id) return oldData;
                
    //           return {
    //             ...oldData,
    //             pages: oldData.pages.map((page: any) => ({
    //               ...page,
    //               posts: page.posts.map((post: EnhancedPost) => {
    //                 if (post.id === commentData.post_id) {
    //                   let newCount = post.comments_count;
                      
    //                   if (payload.eventType === 'INSERT') {
    //                     newCount = post.comments_count + 1;
    //                   } else if (payload.eventType === 'DELETE') {
    //                     newCount = Math.max(0, post.comments_count - 1);
    //                   }
                      
    //                   return {
    //                     ...post,
    //                     comments_count: newCount
    //                   };
    //                 }
    //                 return post;
    //               })
    //             }))
    //           };
    //         }
    //       );
    //     }
    //   )
    //   .subscribe();

    return () => {
      postsSubscription.unsubscribe();
      votesSubscription.unsubscribe();
      membershipSubscription.unsubscribe();
    };
  }, [user?.id, queryClient, supabase]);
}

// Helper function to check if a post should be visible to user
async function checkPostVisibility(post: any, userId: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  
  // If post has no campfire_id, it's visible to everyone
  if (!post.campfire_id) {
    return true;
  }
  
  // Check if user is member of the campfire
  const { data, error } = await supabase
    .from('campfire_members')
    .select('id')
    .eq('campfire_id', post.campfire_id)
    .eq('user_id', userId)
    .single();
    
  return !error && !!data;
}