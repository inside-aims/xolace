"use client";

import React, { useEffect, useState } from "react";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { checkIsLiked } from "@/lib/utils";
import LikeButton from "../ui/LikeButton";

// type PostStatsProps ={
//   post : Models.Document;
//   userId: string;
// }

const PostStats = ({ post, userId }: any) => {
  // const likesList = post.likes.map((like: any) => like.user_id);
  const likesList = post.likes.map((like: any) => {
    return {
      user_id: like.user_id,
      id: like.id,
    };
  });
  // getting the current user's exact like object

  console.log("list-> ", likesList);
  const [likes, setLikes] = useState(likesList);

  return (
    <div className="flex space-x-7">
      <div className="flex gap-1 items-center">
        <LikeButton
          postId={post.id}
          likes={likes}
          setLikes={setLikes}
          userId={userId}
        />
        <p className=" text-default-400 text-small">{likes.length}</p>
      </div>
      <div className="flex gap-1 items-center">
        <p className="font-semibold text-default-400 text-small">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-gray-600 -scale-x-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </p>
        <p className="text-default-400 text-small">5</p>
      </div>
    </div>
  );
};

export default PostStats;
