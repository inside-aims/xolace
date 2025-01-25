'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { PostCard } from '@/components/cards/PostCard';
import UpdatePasswordCardForm from '@/components/forms/UpdatePasswordCardForm';
import UpdateUsernameCardForm from '@/components/forms/UpdateUsernameCardForm';
import DeleteUserAccountCard from '@/components/cards/DeleteUserAccountCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import Loader from '@/components/shared/loaders/Loader';
import { useUserState } from '@/lib/store/user';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import BlurFade from '@/components/ui/blur-fade';
import { Post } from '@/types/global';

const Profile = () => {
  const router = useRouter();
  // get user profile data
  const user = useUserState(state => state.user);

  // initialize supabase client
  const supabase = getSupabaseBrowserClient();

  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  // fetch user posts
  useEffect(() => {
    const fetchUserPosts = async () => {
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
          likes(
          *
          ),
          comments:comments(count),
          views:views(count)
    `,
        )
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });
      const { data: postData, error } = await postStatement;

      if (error) {
        console.error(error);
      } else {
        setPosts(postData);
        setIsLoadingPosts(false);
      }
    };

    fetchUserPosts();
  }, [supabase, user?.id]);

  // handle post click
  const handlePostClick = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  return (
    <>
      <div className="flex items-center justify-center gap-3 md:gap-4">
        <Avatar>
          <AvatarImage src={user?.avatar_url ?? undefined} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start justify-center gap-1">
          <h5 className="text-small text-default-400 tracking-tight text-dark-2 dark:text-white">
            {user?.username}
          </h5>
          <h4 className="text-dark-4/65 dark:text-gray-400">{posts?.length}</h4>
        </div>
      </div>
      <Separator className="my-4" />

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="sticky top-16 z-10 grid w-full grid-cols-2 ">
          <TabsTrigger value="account">Posts</TabsTrigger>
          <TabsTrigger value="password">Edit profile</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="px-2">
          <ScrollArea className="h-[calc(100vh-20rem)] w-full rounded-md md:h-[calc(100vh-22rem)]">
            <div className="space-y-4 py-2">
              {isLoadingPosts ? (
                <Loader />
              ) : posts?.length > 0 ? (
                <div className="flex w-full flex-1 flex-col">
                  {posts?.map((post: Post, idx: number) => (
                    <BlurFade
                      key={post.id}
                      className="flex w-full justify-center"
                      delay={0.15 + idx * 0.05}
                      duration={0.3}
                    >
                      <PostCard 
                        post={post} 
                        section="profile" 
                        onClick={() => handlePostClick(post.id)}
                        className="mb-4 w-full ring-1 ring-white/[0.05] transition duration-300 dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#193a47]" 
                      />
                    </BlurFade>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">You have no posts🤔</p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="password" className="mb-10 space-y-6">
          <UpdatePasswordCardForm />
          <UpdateUsernameCardForm />
          <DeleteUserAccountCard />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Profile;
