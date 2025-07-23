'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Loader from '@/components/shared/loaders/Loader';
import { useUserState } from '@/lib/store/user';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
//import BlurFade from '@/components/ui/blur-fade';
import { Post } from '@/types/global';
import { useToast } from '@/components/ui/use-toast';
import {domAnimation, LazyMotion} from "motion/react";

// Dynamic imports for non-critical components
const PostCard = dynamic(
  () => import('@/components/cards/PostCard').then(mod => mod.PostCard),
  {
    loading: () => <Loader />,
    ssr: false,
  },
);

const BlurFade = dynamic(() => import('@/components/ui/blur-fade'), {
  ssr: false
});

const Posts = () => {
  const router = useRouter();
  // get user profile data
  const user = useUserState(state => state.user);

  // destructure toast function
  const { toast } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);

  // fetch user posts
  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchUserPosts = async () => {
      // initialize supabase client
      const supabase = getSupabaseBrowserClient();
      const postStatement = supabase
        .from('posts')
        .select(
          `
       *,
        posttags (
        tags (
          name
        )
      ),
          votes(
          user_id,
          vote_type
          ),
          comments:comments(count),
          views:views(count),
          collections(
          user_id
          ),
          post_slides (
            slide_index,
            content
          )  
    `,
        )
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });
      const { data: postData, error } = await postStatement;

      if (error) {
        toast({
          title: 'Error fetching posts',
          description:
            'Something must have gone wrong. Kindly refresh the page',
          variant: 'destructive',
        });
      } else {
        setPosts(postData);
      }
    };

    fetchUserPosts();
  }, [toast, user, user?.id]);

  // handle post click
  const handlePostClick = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  return (
    <>
      <LazyMotion features={domAnimation}>
        <div className="flex flex-col gap-4" >
          <BlurFade>
            <div className="flex w-full flex-1 flex-col gap-3 pt-3" id='userPostsList' data-tour="userPostsList" >
              { posts.length > 1 ? (
                Array.isArray(posts) && posts.map((post, index) => (
                  <BlurFade
                    key={post.id}
                    postId={`post-${index + 1}`}
                    duration={0.3}
                    inView
                  >
                    <PostCard
                      post={post}
                      onClick={() => handlePostClick(post.id)}
                      className="rounded-none mb-5 w-full bg-bg dark:bg-bg-dark dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#193a47] md:w-full border-x-0"
                    />
                  </BlurFade>
                ))
              ) : (
                <div className="flex items-center justify-center text-muted-foreground">
                  You have no posts🤔
                </div>
              )}
            </div>
          </BlurFade>
        </div>
      </LazyMotion>
    </>
  );
};

export default Posts;
