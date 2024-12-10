"use client";
import { useState } from "react";
import Image from "next/image";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostDropdown from "../shared/PostDropdown";
import ReportForm from "../forms/ReportForm";
import { KvngSheet } from "../shared/KvngSheet";
import { moodMap } from "@/types";

export function DetailCard({ postId, post }: { postId: any; post: any }) {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const postMood = moodMap[post?.mood] || moodMap["neutral"];

  const { created_at, content, author_name, author_avatar_url, created_by } =
    post;

  return (
    <>
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
          <PostDropdown
            postId={postId}
            postDetail={true}
            onOpenChange={setIsSheetOpen}
            postCreatedBy={created_by}
          />
        </CardHeader>
        <CardContent className=" !text-wrap overflow-x-hidden">
          {content}
        </CardContent>
        <CardFooter>
          <div
            className={`flex justify-center items-center rounded-3xl dark:bg-transparent border p-1  ${
              postMood.style
            }`}
          >
            <span>
              {postMood.gif ? (
                <Image
                  src={postMood.gif}
                  alt="Gif Emoji"
                  width={24}
                  height={24}
                  className="h-6 "
                />
              ) : (
                postMood.emoji
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
      <KvngSheet
        onOpenChange={setIsSheetOpen}
        open={isSheetOpen}
        title="Report Post"
        description="Let us know what you are having problems with"
        trigger={false}
      >
        <ReportForm postId={postId} />
      </KvngSheet>
    </>
  );
}
