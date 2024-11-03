"use client";
import * as React from "react";
import { format } from "timeago.js";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import PostDropdown from "../shared/PostDropdown";

// Map mood to emoji and button style
const moodMap: Record<string, { emoji: string; style: string }> = {
  neutral: { emoji: "😐", style: "border-zinc-600 bg-gray-500" },
  happy: { emoji: "😆", style: "border-green-500 bg-green-400" },
  sad: { emoji: "🥹", style: "border-blue bg-blue-400" },
  angry: { emoji: "😠", style: "border-red-500 bg-red-400" },
  confused: { emoji: "🫤", style: "border-yellow-500 bg-yellow-400" },
};

export function DetailCard({ postId, post }: { postId: any; post: any }) {
  const postMood = moodMap[post?.mood] || moodMap["neutral"];

  const {
    created_at,
    content,
    created_by,
    mood,
    author_name,
    author_avatar_url,
  } = post;

  return (
    <Card className="w-full md:w-full mb-5 mt-5">
      <CardHeader className=" flex-row justify-between items-start px-4 py-2 ">
        <div className="flex gap-2 md:gap-4 items-center">
          <Avatar>
            <AvatarImage src={author_avatar_url} />
            <AvatarFallback>XO</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 items-start justify-center">
            <h5 className="text-small tracking-tight text-default-400">
              {author_name}
            </h5>
          </div>
          <small className="ml-4 md:ml-10 text-sm dark:text-gray-400 text-zinc-500">
            {format(created_at)}
          </small>
        </div>
        {/* <PostDropdown postDetail={true} onOpenChange={setIsSheetOpen} /> */}
      </CardHeader>
      <CardContent>
        {/* {post.caption} */}
        {content}
      </CardContent>
      <CardFooter>
        <div>
          <Button
            type="button"
            className={`flex gap-2 rounded-3xl dark:bg-transparent border border-gray-700 dark:text-white text-black  text-sm text-center ${
              postMood.style
            }`}
          >
            {postMood.emoji}
            <span className=" animate-bounce duration-700 ease-in-out ">
              {" "}
              {post?.expires_in_24hr && "⏳"}
            </span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
