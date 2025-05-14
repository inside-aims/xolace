'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Link, Calendar, MapPin, Medal } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

//import { PostCard } from '@/components/cards/PostCard';
//import UpdatePasswordCardForm from '@/components/forms/UpdatePasswordCardForm';
//import UpdateUsernameCardForm from '@/components/forms/UpdateUsernameCardForm';
//import DeleteUserAccountCard from '@/components/cards/DeleteUserAccountCard';
import { useUserState } from '@/lib/store/user';

const Profile = () => {
  // get user profile data
  const router = useRouter();
  const user = useUserState(state => state.user);


  // fetch user posts
  // useEffect(() => {
  //   if (!user) {
  //     return;
  //   }
  //
  //   const fetchUserPosts = async () => {
  //     // initialize supabase client
  //     const supabase = getSupabaseBrowserClient();
  //     const postStatement = supabase
  //       .from('posts')
  //       .select(
  //         `
  //      *,
  //       posttags (
  //       tags (
  //         name
  //       )
  //     ),
  //         votes(
  //         user_id,
  //         vote_type
  //         ),
  //         comments:comments(count),
  //         views:views(count),
  //         collections(
  //         user_id
  //         )
  //   `,
  //       )
  //       .eq('created_by', user?.id)
  //       .order('created_at', { ascending: false });
  //     const { data: postData, error } = await postStatement;
  //
  //     if (error) {
  //       toast({
  //         title: 'Error fetching posts',
  //         description:
  //           'Something must have gone wrong. Kindly refresh the page',
  //         variant: 'destructive',
  //       });
  //     } else {
  //       setPosts(postData);
  //       setIsLoadingPosts(false);
  //     }
  //   };
  //
  //   fetchUserPosts();
  // }, [user?.id]);


  const profileStatBadges: {key: string, value: number, name: string, color: string}[] = [
    { key: "gold", value: 0, name: "Gold Badges", color: "#f8d727" },
    { key: "silver", value: 0, name: "Silver Badges", color: "#C0C0C0" },
    { key: "bronze", value: 0, name: "Bronze Badges", color: "#CD7F32" },
  ]
  return (
    <>
      <div className="w-full grid grid-cols-12 h-screen">
        {/* Hey Section */}
        <div className="col-span-12 md:col-span-8 overflow-y-auto px-4 md:px-8 md:bg-neutral-100 space-y-12">
          <div className={"flex flex-col md:flex-row items-start md:items-center pt-8 gap-4"}>
            {/*profile avatar and user name section*/}
            <Avatar className="w-40 h-40">
              <AvatarImage
                src={user?.avatar_url ?? undefined}
                className="w-full h-full object-cover object-center rounded-full border"
              />
              <AvatarFallback className="text-4xl">
                {user?.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className={"w-full flex flex-col items-start gap-4"}>
              <div>
                <h3 className={"font-semibold leading-tight text-xl"}>
                  FedeJnr
                </h3>
                <span> @fedejnr </span>
              </div>
              <div className={"w-full flex flex-row items-center gap-4 md:gap-8"}>
                <p className={"flex items-center flex-row gap-1"}>
                  <Link size={18}/>
                  <span
                    className={"text-blue9 cursor-pointer hover:underline"}
                    onClick = { () => router.push('/settings/your-account')}
                  >
                    Settings
                  </span>
                </p>
                <p className={"flex items-center flex-row gap-1"}>
                  <span><MapPin size={18}/></span>
                  Miami
                </p>
                <p className={"flex items-center flex-row gap-1"}>
                  <span><Calendar size={18}/></span>
                  Joined March 2034
                </p>
              </div>
            </div>
          </div>

          {/*stats badge section*/}
          <div className={"w-full flex flex-col items-start gap-8"}>
            <h3 className={"font-semibold text-xl"}> Stats </h3>
            <div className={"w-full grid grid-cols-12 items-center justify-between gap-4"}>
              <div
                className={"col-span-12 md:col-span-3 p-4 shadow-lg rounded-lg items-start justify-center flex flex-col gap-4 border"}>
                <p className={"flex flex-col gap-0 m-0"}>
                  <span>0</span>
                  <span>Posts</span>
                </p>
                <p className={"flex flex-col"}>
                  <span>1</span>
                  <span>Reactions</span>
                </p>
              </div>
              {
                profileStatBadges.map((badge) => (
                  <div
                    key={badge.key}
                    className={"col-span-12 md:col-span-3 p-4 shadow-lg rounded-lg items-start justify-center flex flex-col gap-4 border"}>
                    <p className={"flex flex-col gap-0 m-0"}>
                      <Medal
                        className="w-12 h-12"
                        style = {{ color: badge.color }}
                      />
                    </p>
                    <p className={"flex flex-col"}>
                      <span>{badge.value}</span>
                      <span>{badge.name}</span>
                    </p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* One Section (hidden on mobile) */}
        <div className="hidden md:block md:col-span-4 overflow-y-auto p-4">
          <div className="flex flex-col w-full gap-4">
            <h3 className={"font-semibold leading-normal text-xl"}>Your posts</h3>
            <div>
              Hey thee there there there there there there there there there
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Profile;
