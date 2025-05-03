'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

//import { PostCard } from '@/components/cards/PostCard';
//import UpdatePasswordCardForm from '@/components/forms/UpdatePasswordCardForm';
//import UpdateUsernameCardForm from '@/components/forms/UpdateUsernameCardForm';
//import DeleteUserAccountCard from '@/components/cards/DeleteUserAccountCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import Loader from '@/components/shared/loaders/Loader';
import { useUserState } from '@/lib/store/user';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
//import BlurFade from '@/components/ui/blur-fade';
import { Post } from '@/types/global';
import { useToast } from '@/components/ui/use-toast';

// Dynamic imports for non-critical components
const PostCard = dynamic(
  () => import('@/components/cards/PostCard').then(mod => mod.PostCard),
  {
    loading: () => <Loader />,
    ssr: false,
  },
);
const UpdatePasswordCardForm = dynamic(
  () => import('@/components/forms/UpdatePasswordCardForm'),
  {ssr: false, loading: () => <p className="p-4">Loading forms...</p>}
);
const UpdateUsernameCardForm = dynamic(() => import('@/components/forms/UpdateUsernameCardForm'), {ssr: false});
const DeleteUserAccountCard = dynamic(() => import('@/components/cards/DeleteUserAccountCard'), {ssr: false});
const BlurFade = dynamic(() => import('@/components/ui/blur-fade'), {
    ssr: false
  });

const Profile = () => {
  const router = useRouter();
  // get user profile data
  const user = useUserState(state => state.user);

  // destructure toast function
  const { toast } = useToast();

  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
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
        setIsLoadingPosts(false);
      }
    };

    fetchUserPosts();
  }, [user?.id]);

  // handle post click
  const handlePostClick = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  return (
    <>
      <div className="flex items-center justify-center gap-3 md:gap-4 pt-3">
        <Avatar>
          <AvatarImage src={user?.avatar_url ?? undefined} />
          <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start justify-center gap-1">
          <h5 className="text-small text-default-400 tracking-tight text-dark-2 dark:text-white">
            {user?.username}
          </h5>
          <h4 className="text-dark-4/65 dark:text-gray-400">{posts?.length}</h4>
        </div>
      </div>
      <Separator className="my-4" />

      <Tabs defaultValue="account" className="w-full px-1 md:px-2 lg:px-5">
        <TabsList className="sticky top-16 z-10 grid w-full grid-cols-2">
          <TabsTrigger value="account">Posts</TabsTrigger>
          <TabsTrigger value="password">Edit profile</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="md:px-2">
          <ScrollArea className="h-[calc(100vh-20rem)] w-full rounded-md md:h-[calc(100vh-22rem)]">
            <div className="space-y-4 py-2">
              {isLoadingPosts ? (
                <Loader />
              ) : posts?.length > 0 ? (
                <div className="flex w-full flex-1 flex-col px-4">
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
                        className="mb-4 w-full bg-[radial-gradient(ellipse_at_top,hsl(0_0%_100%),hsl(0_0%_95%)_70%),linear-gradient(to_bottom_right,hsl(0_0%_98%),hsl(0_0%_96%))] from-[hsl(228_85%_4%)] to-[hsl(228_85%_8%)] ring-1 ring-white/[0.05] transition duration-300 hover:bg-[radial-gradient(ellipse_at_top,hsl(0_0%_100%),hsl(0_0%_99%)_70%),linear-gradient(to_bottom_right,hsl(0_0%_99%),hsl(0_0%_97%))] dark:bg-gradient-to-br dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#193a47]"
                      />
                    </BlurFade>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  You have no posts🤔
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="password" className="mb-16 space-y-6">
            <UpdatePasswordCardForm />
            <UpdateUsernameCardForm />
            <DeleteUserAccountCard />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Profile;
