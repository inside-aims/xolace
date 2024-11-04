"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { format } from "timeago.js";

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

type PostCardType = {
  className?: string;
  post: any;
  section?: "profile";
};

// Map mood to emoji and button style
const moodMap: Record<string, { emoji: string; style: string }> = {
  neutral: { emoji: "😐", style: "border-zinc-600 bg-gray-500" },
  happy: { emoji: "😆", style: "border-green-500 bg-green-400" },
  sad: { emoji: "🥹", style: "border-blue bg-blue-400" },
  angry: { emoji: "😠", style: "border-red-500 bg-red-400" },
  confused: { emoji: "🫤", style: "border-yellow-500 bg-yellow-400" },
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
        className={`w-full  md:w-full mb-5 ${className} ring-1 ring-white/[0.05] transition duration-300 dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]`}
        id={post.id}
      >
        <CardHeader className=" flex-row justify-between items-start px-4 py-2 ">
          <div className="flex gap-2 md:gap-4 items-center">
            <Avatar>
              <AvatarImage src={post.author_avatar_url} />
              <AvatarFallback>XO</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 items-start justify-center">
              <h5 className="text-small tracking-tight text-default-400">
                {post.author_name}
              </h5>
            </div>
            <small className="ml-4 md:ml-10 text-sm dark:text-gray-400 text-zinc-500">
              {timestamp}
            </small>
          </div>
          <PostDropdown
            postCard
            postId={post.id}
            postCreatedBy={post.created_by}
            onOpenChange={setIsOpen}
          />
        </CardHeader>
        <Link href={`post/${post.id}`}>
          <CardContent>{post.content}</CardContent>
        </Link>
        <CardFooter className="flex justify-between items-center">
          <PostStats post={post} userId={user?.id} />
          <div>
            <Button
              type="button"
              className={`flex gap-x-2 rounded-3xl dark:bg-transparent border border-gray-700 dark:text-white text-black  text-sm text-center ${
                mood.style
              }`}
            >
              {mood.emoji}
              <span className=" animate-bounce duration-700 ease-in-out ">
                {" "}
                {post?.expires_in_24hr && "⏳"}
              </span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
