'use client';

import React, { useEffect, useState } from 'react';

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
          comments:comments(count)
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

  return (
    <>
      <div className="flex items-center justify-center gap-3 md:gap-4">
        <Avatar>
          <AvatarImage src={user?.avatar_url} />
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

      <Tabs defaultValue="account" className="w-[100%]">
        <TabsList className="sticky top-16 grid w-full grid-cols-2">
          <TabsTrigger value="account">Posts</TabsTrigger>
          <TabsTrigger value="password">Edit profile</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="p-2">
          <ScrollArea className="h-[58vh] w-full rounded-md md:h-80">
            <div className="p-4">
              {isLoadingPosts ? (
                <Loader />
              ) : posts?.length > 0 ? (
                <ul className="flex w-full flex-1 flex-col gap-3">
                  {posts?.map((post: Post, idx: number) => (
                    <BlurFade
                      key={post.id}
                      className="flex w-full justify-center"
                      delay={0.15 + idx * 0.05}
                      duration={0.3}
                    >
                      <PostCard post={post} section="profile" />
                    </BlurFade>
                  ))}
                </ul>
              ) : (
                <p>You have no posts🤔</p>
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
