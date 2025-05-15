'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Link, Calendar, MapPin } from "lucide-react";
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserState } from '@/lib/store/user';

const Profile = () => {
  // get user profile data
  const router = useRouter();
  const user = useUserState(state => state.user);

  const formattedDate = (joinedDate: string) => {
    const date = new Date(joinedDate);
    return `Joined ${date.toLocaleDateString('en-US', {month: 'short'})}
    ${date.getDate()}, ${date.getFullYear()}
    `
  }

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

//Dummy profile stats for badges
  const profileStatBadges: {key: string, value: number, name: string, imageURL: string}[] = [
    { key: "gold", value: 0, name: "Gold Badges", imageURL: "gold-medal" },
    { key: "silver", value: 0, name: "Silver Badges", imageURL: "silver-medal" },
    { key: "bronze", value: 0, name: "Bronze Badges", imageURL: "bronze-medal" },
  ]

  //Dummy top tags status
  const postTags: {key: string, value: number, name: string}[] = [
    {key: 'relationship', value: 8, name: "Relationship"},
    {key: 'academics', value: 30, name: "Academics"},
    {key: 'friendship', value: 3, name: "Friendship"},
    {key: 'mentalHealth', value: 10, name: "Mental Health"},
    {key: 'trust', value: 4, name: "Trust"},
    {key: 'drugAddict', value: 9, name: "Drug Addict"},
    {key: 'family', value: 5, name: "Family"},
  ]
  return (
    <>
      <div className="w-full grid grid-cols-12 h-screen pb-28 md:pb-0">
        {/* Hey Section */}
        <div className="col-span-12 md:col-span-9 overflow-y-auto px-4 md:px-8 border-0 md:border-e space-y-12">
          <div className={"flex flex-col md:flex-row items-start md:items-center pt-4 md:pt-8 gap-4"}>
            {/*profile avatar and user name section*/}
            <Avatar className="w-40 h-40">
              <AvatarImage
                src={user?.avatar_url ?? undefined}
                className="w-full h-full object-cover object-center rounded-full border"
              />
              <AvatarFallback className="text-4xl md:bg-white border">
                {user?.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className={"w-full flex flex-col items-start gap-4"}>
              <div>
                <h3 className={"font-semibold leading-tight text-xl"}>
                  {user?.username}
                </h3>
                <span className={"lowercase"}>{`@${user?.username}`}</span>
              </div>
              <div className={"w-full flex flex-row items-center gap-4 md:gap-8"}>
                <p className={"flex items-center flex-row gap-1"}>
                  <Link size={18}/>
                  <span
                    className={"text-blue9 cursor-pointer hover:underline"}
                    onClick={() => router.push('/settings/your-account')}
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
                  {
                    user?.created_at ? formattedDate(user.created_at) : "N/A"
                  }
                </p>
              </div>
            </div>
          </div>

          {/*stats badge section*/}
          <div className={"w-full flex flex-col items-start gap-4"}>
            <h3 className={"font-semibold text-xl"}> Stats </h3>
            <div className={"w-full grid grid-cols-12 items-center justify-between gap-4"}>
              <div
                className={"col-span-12 md:col-span-3 p-4 shadow-lg rounded-lg items-start justify-start md:justify-center flex flex-row md:flex-col gap-4 border"}>
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
                    className={"col-span-12 md:col-span-3 p-4 shadow-lg rounded-lg items-start justify-start md:justify-center flex flex-row md:flex-col gap-4 md:gap-8 border"}>
                    <p className={"flex w-8 h-8 flex-col gap-0 m-0"}>
                      <Image
                        src={`/assets/images/${badge.imageURL}.svg`}
                        alt={badge.name}
                        width={36}
                        height={36}
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

          {/*top tags,filtered by most used 6 tags */}
          <div className="w-full flex flex-col gap-4">
            <h3 className="font-semibold text-xl">Top Tags</h3>
            <div className="flex flex-wrap gap-3">
              {postTags
                .filter((tag) => tag.value >= 1)
                .sort((a,b) => b.value - a.value)
                .slice(0,6)
                .map((tag) => {
                  let tagStyle = '';
                  let holeColor = '';

                  if (tag.value >= 10) {
                    tagStyle = 'bg-moss-300 text-moss-900 border-moss-900';
                    holeColor = 'bg-moss-900';
                  } else if (tag.value >= 5) {
                    tagStyle = 'bg-ocean-300 text-ocean-900 border-ocean-900';
                    holeColor = 'bg-ocean-900';
                  } else {
                    tagStyle = 'bg-lavender-300 text-lavender-900 border-lavender-900';
                    holeColor = 'bg-lavender-950';
                  }

                  return (
                    <div
                      key={tag.key}
                      className={`relative pr-6 pl-3 py-1 border rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:shadow-md hover:cursor-wait ${tagStyle}`}
                    >
                      <span className="capitalize">{tag.name}</span>
                      <span className="text-xs font-semibold opacity-70">[{tag.value}]</span>
                      <span
                        className={`absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-white shadow-inner ${holeColor}`}
                      ></span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* One Section (hidden on mobile) */}
        <div className="hidden md:block md:col-span-3 overflow-y-auto p-4">
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
