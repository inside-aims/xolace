'use client';

import {Globe, TicketCheck} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import React from "react";
import {CampfireAvatarInterface, formatMembers} from "@/components/campfires/campfires.types";
import CampfireAvatar from "@/components/campfires/campfire-avatar";
import Link from 'next/link';
import {CampfireDetails} from "@/queries/campfires/getCampfireWithSlug";
import CampfireAboutSkeleton from "./campfire-about-skeleton";
import { Badge } from "../ui/badge";

// Dummy data for rules
const rules: { id: string; question: string; answer: string }[] = [
  { id: "rule-1", question: "Follow community guidelines", answer: "Always follow the rules and respect other members." },
  { id: "rule-2", question: "No hate speech or bullying", answer: "We have zero tolerance for hate speech or personal attacks." },
  { id: "rule-3", question: "Stay on topic", answer: "All posts should be related to Ghana and its community." },
  { id: "rule-4", question: "No spam or self-promotion", answer: "Do not spam links, ads, or unrelated promotions." },
  { id: "rule-5", question: "Use descriptive titles", answer: "Make sure your post titles clearly reflect the content." },
];

// Dummy data for fire starters in a certain campfire
const fireStarters: CampfireAvatarInterface[] = [
  {
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    username: "ember_maven",
    userRoute: "/user/ember_maven",
    assignedRole: "The Keeper"
  },
  {
    avatarUrl: "https://i.pravatar.cc/150?img=2",
    username: "flame_tamer",
    userRoute: "/user/flame_tamer",
  },
  {
    avatarUrl: "https://i.pravatar.cc/150?img=4",
    username: "story_spark",
    userRoute: "/user/story_spark",
    assignedRole: "The Storyteller"
  },
  {
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    username: "log_master",
    userRoute: "/user/log_master",
  },
  {
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    username: "marshmallow_chief",
    userRoute: "/user/marshmallow_chief",
    assignedRole: "Overseer"
  }
];

interface CampfireAboutProps {
  campfire: CampfireDetails | undefined;
}



const CampfireAbout = ({campfire}: CampfireAboutProps) => {

  if (!campfire) {
    return <CampfireAboutSkeleton />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPurposeDescription = (purpose: string) => {
    const descriptions: Record<string, string> = {
      general_discussion: "Open conversations and community discussions",
      support: "Peer support and mental health resources",
      education: "Learning and educational content sharing",
      professional: "Professional networking and career development",
      hobby: "Shared interests and hobby discussions",
      local_community: "Location-based community engagement"
    };
    return descriptions[purpose] || "Community discussions and engagement";
  };

  const getRankInfo = (memberCount: number) => {
    if (memberCount >= 10000) return { rank: "Top 1%", color: "text-yellow-600" };
    if (memberCount >= 5000) return { rank: "Top 2%", color: "text-orange-600" };
    if (memberCount >= 1000) return { rank: "Top 5%", color: "text-blue-600" };
    if (memberCount >= 500) return { rank: "Top 10%", color: "text-green-600" };
    return { rank: "Growing", color: "text-gray-600" };
  };

  const rankInfo = getRankInfo(campfire.members);

  return (
    <div
      className="flex items-start flex-col py-4 gap-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-sm text-neutral-500 dark:text-neutral-300">
      {/*about the campfire section*/}
      <div className="flex items-start flex-col gap-4 px-2 py-2">
        <h2 className={"uppercase font-semibold"}>About {campfire.name}</h2>
        <div className="flex flex-col gap-2">
          <p className="text-neutral-700 dark:text-neutral-200 font-medium">
            {campfire.description || getPurposeDescription(campfire.purpose)}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <span className="flex items-center gap-2">
            <TicketCheck size={16} />
            Created {formatDate(campfire.createdAt || new Date().toISOString())}
          </span>
          <span className="flex items-center gap-2 uppercase">
            <Globe size={16} />
            {campfire.visibility} Community
          </span>
        </div>


        <Button
          size={"sm"}
          variant={"outline"}
          className={"w-full items-center  h-8 bg-neutral-300 dark:bg-neutral-900 border border-neutral-400 rounded-full"}
        >
          Campfire Guide
        </Button>


        <div className="w-full flex flex-row items-center justify-between text-xs">
          <div className="flex flex-col items-start">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {formatMembers(campfire.members)}
            </span>
            <span>Members</span>
          </div>
          
          <div className="flex flex-col items-start">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {/* {Math.floor(campfire.members * 0.05)} Approximate online users */}
              Online
            </span>
            {/* <span>Online</span> */}
          </div>
          
          <div className="flex flex-col items-start">
            <span className={`font-semibold ${rankInfo.color}`}>
              {rankInfo.rank}
            </span>
            <span>Rank by size</span>
          </div>
        </div>
      </div>
      <Separator className="border dark:border-neutral-100"/>

      {/*user section*/}
      <div className={"flex flex-col gap-4 py-2 px-4"}>
        <CampfireAvatar
          avatarUrl={"https://i.pravatar.cc/150?img=3"}
          username={"x/user-faire-123"}
          userRoute={"/"}
          assignedRole={"The Janitor"}
          title={"user flair"}
        />
      </div>
      <Separator className="border dark:border-neutral-100"/>

      {/*campfire rules section*/}
      <div className={"flex flex-col gap-4 py-2 px-4"}>
        <h2 className={"uppercase font-semibold"}>x/ghana rules</h2>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={rules[0]?.id}
        >
          {rules.map((rule, index) => (
            <AccordionItem
              value={rule.id}
              key={rule.id}
              className={`px-2 py-1 border-none hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors`}
            >
              <AccordionTrigger className="w-full flex items-center justify-between gap-2 py-1">
                <span className="flex items-start font-bold mr-2">{index + 1}.</span>
                <span className="flex-1 text-left">{rule.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-2">
                {rule.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <Separator className="border dark:border-neutral-100"/>

      {/*fire starters section*/}
      <div className={"flex flex-col gap-4 py-2 px-4"}>
        <h2 className={"uppercase font-semibold"}>Fire starters</h2>
        <div className={"w-full flex flex-col gap-2 items-start"}>
          {fireStarters.slice(0,4).map((fireStarter) => (
            <CampfireAvatar
              key={`${fireStarter.username}${fireStarter.avatarUrl}`}
              avatarUrl={fireStarter.avatarUrl}
              username={fireStarter.username}
              userRoute={fireStarter.userRoute}
              assignedRole={fireStarter.assignedRole}
            />
          ))}
        </div>
        {/*show view all fire starters button with more than 5*/}
        {/*link path not set yet */}
        {fireStarters.length >= 5 && (
         <Link href={"/"}>
           <Button
             size={"sm"}
             variant={"outline"}
             className={"w-full items-center  h-8 bg-neutral-300 dark:bg-neutral-900 border border-neutral-400 rounded-full"}
           >
             View all fire starters
           </Button>
         </Link>
        )}
      </div>
    </div>
  );
};

export default CampfireAbout;