// src/hooks/useRealtimePosts.js
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

export function useRealtimePosts() {
  const supabase = getSupabaseBrowserClient();
  const queryClient = useQueryClient();

   // Helper function to ensure consistent post structure
//    const normalizePost = (post: any) => ({
//     ...post,
//     views: post.views || [{ count: 0 }],
//     comments: post.comments || [{ count: 0 }],
//     posttags: post.posttags || [],
//     votes: post.votes || [],
//     collections: post.collections || [],
//     // Add other default values for nested fields
//   });

  useEffect(() => {
    const subscription = supabase
      .channel('posts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        payload => {
          if (payload.eventType === 'INSERT') {
            console.log('inside real');
            queryClient.setQueryData(['posts'], (oldPosts: any) => [
                {
                    ...payload.new,
                    views: [{ count: 0 }],
                    comments: [{ count: 0 }],
                    votes: [],
                    posttags: [],
                    collections: [],
                  },
              ...oldPosts,
            ]);
          } else if (payload.eventType === 'UPDATE') {
            console.log('inside real update');
            console.log('******** ', payload);
            queryClient.setQueryData(['posts'], (oldPosts: any[]) =>
                oldPosts.map(post => {
                    if (post.id === payload.new.id) {
                      return {
                        ...post, // Keep existing data including votes array
                        upvotes: payload.new.upvotes, // Only update counts
                        downvotes: payload.new.downvotes,
                        // Preserve all other nested data
                      };
                    }
                    return post;
                  })
            );
          } else if (payload.eventType === 'DELETE') {
            queryClient.setQueryData(['posts'], (oldPosts: any[]) =>
              oldPosts.filter(post => post.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient]);
}
