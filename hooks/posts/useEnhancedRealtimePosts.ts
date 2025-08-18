import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useUserState } from '@/lib/store/user';
import { EnhancedPost } from '@/queries/posts/getEnhancedFeed';

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
            // For updates, invalidate specific post data and refresh feed
            queryClient.invalidateQueries({
              queryKey: ['enhanced-feed', user.id]
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

    // Subscribe to post interactions (comments, votes, etc.)
    // const interactionsSubscription = supabase
    //   .channel('enhanced-feed-interactions')
    //   .on(
    //     'postgres_changes',
    //     {
    //       event: '*',
    //       schema: 'public',
    //       table: 'comments'
    //     },
    //     (payload) => {
    //       // Update comment counts in cache
    //       queryClient.setQueryData(
    //         ['enhanced-feed', user.id],
    //         (oldData: any) => {
    //           if (!oldData) return oldData;
              
    //           return {
    //             ...oldData,
    //             pages: oldData.pages.map((page: any) => ({
    //               ...page,
    //               posts: page.posts.map((post: EnhancedPost) => {
    //                 if (post.id === payload.new?.post_id || post.id === payload.old?.post_id) {
    //                   return {
    //                     ...post,
    //                     comments_count: payload.eventType === 'INSERT' 
    //                       ? post.comments_count + 1
    //                       : payload.eventType === 'DELETE'
    //                       ? Math.max(0, post.comments_count - 1)
    //                       : post.comments_count
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