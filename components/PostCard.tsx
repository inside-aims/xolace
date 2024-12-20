"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UpvoteIcon } from "./animated/Icons/UpvoteIcon";
import { DownvoteIcon } from "./animated/Icons/DownvoteIcon";
import { MoreHorizontal, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: {
    id: string;
    author_name: string;
    author_avatar_url: string;
    content: string;
    timestamp: string;
    mood: {
      emoji: string;
      gif?: string;
      style: string;
      name: string;
    };
    expires_in_24hr: boolean;
    upvotes: number;
    downvotes: number;
    comments: number;
  };
  className?: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, className }) => {
  const [voteStatus, setVoteStatus] = useState<"upvote" | "downvote" | null>(
    null
  );
  const [upvoteCount, setUpvoteCount] = useState(post.upvotes);
  const [downvoteCount, setDownvoteCount] = useState(post.downvotes);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const handleUpvote = () => {
    if (voteStatus === "upvote") {
      setVoteStatus(null);
      setUpvoteCount(upvoteCount - 1);
    } else {
      setVoteStatus("upvote");
      setUpvoteCount(upvoteCount + 1);
      if (voteStatus === "downvote") {
        setDownvoteCount(downvoteCount - 1);
      }
    }
  };

  const handleDownvote = () => {
    if (voteStatus === "downvote") {
      setVoteStatus(null);
      setDownvoteCount(downvoteCount - 1);
    } else {
      setVoteStatus("downvote");
      setDownvoteCount(downvoteCount + 1);
      if (voteStatus === "upvote") {
        setUpvoteCount(upvoteCount - 1);
      }
    }
  };

  return (
    <Card
      className={cn(
        "w-full mb-5 overflow-hidden transition-colors duration-300 ",
        className
      )}
    >
      <CardHeader className="flex flex-row justify-between items-start p-4">
        <div className="flex gap-4 items-center">
          <Avatar>
            <AvatarImage src={post.author_avatar_url} />
            <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h5 className="text-sm font-semibold">{post.author_name}</h5>
            <small className="text-xs text-gray-500 dark:text-gray-400">
              {post.timestamp}
            </small>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <MoreHorizontal size={20} />
        </button>
      </CardHeader>
      <Link href={`/post/${post.id}`}>
        <CardContent className="p-4">
          <p className="text-sm">{truncateText(post.content, 150)}</p>
        </CardContent>
      </Link>
      <CardFooter className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <UpvoteIcon
              filled={voteStatus === "upvote"}
              onClick={handleUpvote}
            />
            <span className="text-sm ml-1">{upvoteCount}</span>
          </div>
          <div className="flex items-center">
            <DownvoteIcon
              filled={voteStatus === "downvote"}
              onClick={handleDownvote}
            />
            <span className="text-sm ml-1">{downvoteCount}</span>
          </div>
          <div className="flex items-center ml-4">
            <MessageCircle
              size={20}
              className="text-gray-500 dark:text-gray-400"
            />
            <span className="text-sm ml-1">{post.comments}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl" title={post.mood.name}>
            {post.mood.emoji}
          </span>
          {post.expires_in_24hr && (
            <span className="animate-bounce text-xl">⏳</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
