// src/hooks/useRealtimePosts.js
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

export function useRealtimePosts() {
  const supabase = getSupabaseBrowserClient();
  const queryClient = useQueryClient();

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
              payload.new,
              ...oldPosts,
            ]);
          } else if (payload.eventType === 'UPDATE') {
            console.log('inside real update');
            console.log('******** ', payload);
            queryClient.setQueryData(['posts'], (oldPosts: any[]) =>
              oldPosts.map(post =>
                post.id === payload.new.id ? { ...post, ...payload.new } : post,
              ),
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
