"use client";
import * as React from "react";
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
import { useEffect } from "react";

type PostCardType = {
  className?: string;
  post: any;
  section?: "profile";
};

export function PostCard({ className, post, section }: PostCardType) {
  return (
    <Card
      className={`w-full  md:w-full mb-5 ${className} ring-1 ring-white/[0.05] transition duration-300 dark:ring-zinc-800 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]`}
      id={post.id}
    >
      <CardHeader className=" flex-row justify-between items-start px-4 py-2 ">
        <div className="flex gap-2 md:gap-4 items-center">
          <Avatar>
            <AvatarImage
              //   src={section ? user?.avatarUrl : post.creator?.avatarUrl}
              src={post.author_avatar_url}
            />
            <AvatarFallback>XO</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 items-start justify-center">
            <h5 className="text-small tracking-tight text-default-400">
              {/* {section ? user.username : post.creator.username} */}
              {post.author_name}
            </h5>
          </div>
          <small className="ml-4 md:ml-10 text-sm dark:text-gray-400 text-zinc-500">
            {format(post.created_at)}
          </small>
        </div>
        <PostDropdown
          postCard
          postId={post.id}
          postCreatedBy={post.created_by}
        />
      </CardHeader>
      <Link href={`post/${post.id}`}>
        <CardContent>
          {post.content}
          {/* <p>
            Frontend developer and UI/UX enthusiast. Join me on this coding
            adventure!
          </p>
          <span className="pt-2">
            #FrontendWithZoey
            <span className="py-2" aria-label="computer" role="img">
              💻
            </span>
          </span> */}
        </CardContent>
      </Link>
      <CardFooter className="">
        <PostStats post={post} />
      </CardFooter>
    </Card>
  );
}
