'use client';

import React, {useRef, useState} from 'react';
import { useRouter } from 'next/navigation';
import { Link, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserState } from '@/lib/store/user';
import {TopTags} from "@/components/profile/top-tags";
import {Stats} from "@/components/profile/stats";
import {Tabs, TabsList, TabsContent, TabsTrigger} from '@/components/ui/tabs'
import Posts from "@/components/profile/posts";
import { Badge } from '@/components/ui/badge';

const Profile = () => {
  // get user profile data
  const router = useRouter();
  const user = useUserState(state => state.user);
  const {roles} = useUserState()
  const [selectedCategory, setSelectedCategory] = useState<string>("stats")
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle date format to humanize
  const formattedDate = (joinedDate: string) => {
    const date = new Date(joinedDate);
    return `Joined ${date.toLocaleDateString('en-US', {month: 'short'})}
    ${date.getDate()}, ${date.getFullYear()}
    `
  }

  const handleSelectedItem = (itemKey: string) => {
    setSelectedCategory(itemKey);
  };

  //dummy data for profile menu options
  const profileMenu: {key: string, name: string, children: React.ReactNode}[] = [
    {key: 'stats', name: 'Stats', children: <Stats reputation={user?.reputation || 0} userId={user?.id || ""} />},
    {key: 'topTags', name: 'Top Tags', children: <TopTags/>},
    {key: 'posts', name: 'Your Posts', children: <Posts/> },
  ]

  console.log(roles)
    // Determine badge eligibility
    const isProfessional = roles.includes('help_professional');
    const isMentor = roles.includes('mentor');
    const isVerified = roles.includes('verified');

  return (
      <div className="w-full grid grid-cols-12 md:h-screen pb-12 md:pb-0">
        <div
          className="col-span-12 md:col-span-8 px-0 md:px-8 border-0 md:border-e space-y-4 md:space-y-12">
          <div className={"flex flex-col md:flex-row px-4 md:px-0 items-start md:items-center pt-4 md:pt-8 gap-4"}>
            {/*profile avatar and username section*/}
            <Avatar className="w-40 h-40">
              <AvatarImage
                src={user?.avatar_url ?? undefined}
                className="w-full h-full object-cover object-center rounded-full border"
              />
              <AvatarFallback className="text-4xl border">
                {user?.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className={"w-full flex flex-col items-start gap-4"}>
              <div>
                <h3 className={"font-semibold leading-tight text-xl"}>
                  {user?.username}
                </h3>
                <div className='flex items-center gap-x-2'>
                  <span className={"lowercase"}>{`@${user?.username}`}</span>
                  <Badge variant="minimal" className="text-[8px] py-[1px] text-amber-400 bg-amber-900/90 dark:bg-amber-900/20 border-amber-800/50">
                    CAMPER 🔥
                  </Badge>
                  {isProfessional && <Badge variant="minimal" className="text-[8px] py-[1px] text-green-400 bg-green-900/90 dark:bg-green-900/20 border-green-800/50">
                    PROFESSIONAL
                  </Badge>}
                {isMentor && <Badge variant="minimal" className="text-[8px] py-[1px] text-orange-400 bg-orange-900/90 dark:bg-orange-900/20 border-orange-800/50">
                    MENTOR
                  </Badge>}
                {isVerified && <Badge variant="minimal" className="text-[8px] py-[1px] text-blue-400 bg-blue-900/90 dark:bg-blue-900/20 border-blue-800/50">
                    VERIFIED
                  </Badge>}
                
                </div>
              </div>
              <div className={"w-full flex flex-row flex-wrap items-center gap-4 "}>
                <p className={"flex items-center flex-row gap-1"}>
                  <Link size={18}/>
                  <span
                    className={"text-blue9 cursor-pointer hover:underline"}
                    onClick={() => router.push('/settings/your-account')}
                  >
                    Settings
                  </span>
                </p>
                {/* <p className={"flex items-center flex-row gap-1"}>
                  <span><MapPin size={18}/></span>
                  Miami
                </p> */}
                <p className={"flex items-center flex-row gap-1"}>
                  <span><Calendar size={18}/></span>
                  {user?.created_at ?
                    formattedDate(user.created_at) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/*profile options on only mobile view*/}
          <div className="block md:hidden w-full">
            <div className="mx-4 flex w-full items-center gap-2 overflow-x-auto touch-pan-x md:touch-none flex-nowrap no-scrollbar pb-2"
              ref={scrollRef}
            >
              {profileMenu.map((option) => {
                const isActive = selectedCategory === option.key;
                return (
                  <p
                    key={option.key}
                    className={`whitespace-nowrap flex items-center px-3 cursor-pointer border rounded-md  ${
                      isActive ? "border-lavender-500 text-lavender-500" : "border-neutral-300 hover:border-lavender-400"
                    }`}
                    onClick={() => handleSelectedItem(option.key)}
                  >
                    {`${option.name}`}
                  </p>
                );
              })}
            </div>
            <div className={"pt-2"}>
              {profileMenu.map((option) => (
                <div
                  key={option.key}
                  style={{display: selectedCategory === option.key ? "block" : "none"}}
                >
                  {option.children}
                </div>
              ))}
            </div>
          </div>

          {/*profile stats badges and top tags only on desktop view*/}
          <div className="hidden md:block col-span-12 md:col-span-8 overflow-y-auto space-y-12">
            <Stats reputation={user?.reputation || 0} userId={user?.id || ""}/>
            <TopTags/>
          </div>
        </div>

        {/* profile options(except stats and top tags) on only desktop view */}
        <div className="hidden md:block col-span-12 md:col-span-4 overflow-y-auto">
          <div className="flex flex-row w-full gap-4 overflow-x-auto whitespace-nowrap flex-nowrap no-scrollbar">
            <Tabs defaultValue="" className="w-full">
              <TabsList className="flex m-2 gap-2">
                {profileMenu.filter((menu) =>
                  menu.key !== 'stats' && menu.key !== 'topTags')
                  .map((menu) => (
                    <TabsTrigger key={menu.key} value={menu.key} className={"px-8"}>
                      {menu.name}
                    </TabsTrigger>
                  ))}
              </TabsList>
              {profileMenu.filter((menu) =>
                menu.key !== 'stats' || 'top-tags')
                .map((menu) => (
                  <TabsContent key={menu.key} value={menu.key} className={"rounded-none"}>
                    {menu.children}
                  </TabsContent>
                ))}
            </Tabs>
          </div>
        </div>
      </div>
  );
};

export default Profile;

