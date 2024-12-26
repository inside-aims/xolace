"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { format } from "timeago.js";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import PostDropdown from "../shared/PostDropdown";
import PostStats from "../shared/PostStats";
import { Button } from "../ui/button";
import { useUserState } from "@/lib/store/user";
import ReportForm from "../forms/ReportForm";
import KvngDialogDrawer from "../shared/KvngDialogDrawer";
import { moodMap } from "@/types";
import { truncateText } from "@/lib/utils";
import TagCard from "./TagCard";

type PostCardType = {
  className?: string;
  post: any;
  section?: "profile";
};

export function PostCard({ className, post, section }: PostCardType) {
  // get user data
  const user = useUserState((state) => state.user);

  // states
  const [timestamp, setTimestamp] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // get mood from mood object
  const mood = moodMap[post?.mood] || moodMap["neutral"];

  // convert created_at
  useEffect(() => {
    setTimestamp(format(post.created_at));
  }, [post]);

  const timeLeft = post.expires_at
    ? formatDistanceToNow(new Date(post.expires_at), {
        addSuffix: true,
      })
    : null;

  return (
    <>
      {/* dialog or drawer to report post */}
      <KvngDialogDrawer
        title="Report Post"
        isDialogDrawerOpen={isOpen}
        setIsDialogDrawerOpen={setIsOpen}
      >
        <ReportForm postId={post.id} />
      </KvngDialogDrawer>

      <Card
        className={`w-full  md:w-full mb-5  ring-1 ring-white/[0.05] transition duration-300 dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#193a47] ${className}`}
        id={post.id}
      >
        <CardHeader className=" flex-row justify-between items-start px-4 py-2 ">
          <div className="flex gap-4 md:gap-7 items-center">
            <Avatar>
              <AvatarImage src={post.author_avatar_url} />
              <AvatarFallback>XO</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 items-start justify-center">
              <h5 className="text-small tracking-tight text-default-400">
                {post.author_name}
              </h5>
              <small className=" text-[13px] dark:text-gray-400 text-zinc-500">
                {timestamp}
              </small>
            </div>
            {timeLeft && (
              <div className="flex items-center space-x-2">
                <Clock size={14} />
                <span className="text-[12px] text-muted-foreground">
                  {timeLeft}
                </span>
              </div>
            )}
          </div>
          <PostDropdown
            postCard
            postId={post.id}
            postCreatedBy={post.created_by}
            onOpenChange={setIsOpen}
          />
        </CardHeader>
       
          <CardContent>
          <Link href={`post/${post.id}`} className="mb-2">
            {truncateText(post.content, 70)}
        </Link>
        <div className="flex flex-wrap gap-2 mt-2">
        <TagCard name="Home" _id="id"/>
        <TagCard name="Temp" _id="2"/>
        </div>
          </CardContent>
        <CardFooter className="flex justify-between items-center">
          <PostStats post={post} userId={user?.id} />

          <div
            className={`flex justify-center items-center rounded-3xl dark:bg-transparent border p-1  ${
              mood.style
            }`}
          >
            <span>
              {mood.gif ? (
                <Image
                  src={mood.gif}
                  alt="Gif Emoji"
                  width={24}
                  height={24}
                  className="h-6 "
                />
              ) : (
                mood?.emoji
              )}
            </span>

            {post?.expires_in_24hr && (
              <span className=" animate-bounce duration-700 ease-in-out ">
                {" "}
                ⏳
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
