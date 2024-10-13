"use client";

import React, { useState, useEffect } from "react";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { checkIsLiked } from "@/lib/utils";
import { toggleLikePost } from "@/utils/helpers/toggleLikePost";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";

const LikeButton = ({ postId, likes, setLikes, userId }: any) => {
  const supabase = getSupabaseBrowserClient();
  console.log("initial-> ", likes, postId);
  console.log("user ->", userId);
  const [isLiked, setIsLiked] = useState(checkIsLiked(likes, userId.id));
  console.log("bool -> ", isLiked);

  useEffect((): any => {
    const listener = (payload: any) => {
      const eventType = payload.eventType;

      console.log("eventType", payload);

      if (eventType === "INSERT") {
        setLikes((prevLikes: any) => [
          ...prevLikes,
          { id: payload.new.id, user_id: payload.new.user_id },
        ]);
      } else if (eventType === "DELETE") {
        setLikes((prevLikes: any) =>
          prevLikes.filter((like: any) => like.id !== payload.old.id)
        );
      }
      // else if (eventType === "UPDATE") {
      //   setComments((prevComments) =>
      //     prevComments.map((comment) =>
      //       comment.id === payload.new.id ? payload.new : comment,
      //     ),
      //   );
      // }
    };

    const subscription = supabase
      .channel("my-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "likes",
          // filter: `ticket=eq.${ticket}`,
        },
        listener
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  //   function to handle button clicks
  const handleLikePost = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Toggle the like status & add or delete within the database
    await toggleLikePost(postId, isLiked, userId);
    setIsLiked(!isLiked);
  };
  return (
    <>
      <p
        className="font-semibold text-default-400 text-small cursor-pointer"
        onClick={handleLikePost}
      >
        {isLiked ? (
          <HeartFilledIcon className="transition-all ease-in-out duration-300 w-[24px] h-[24px] dark:text-[#2e4ea7] text-[#b42d24]" />
        ) : (
          <HeartIcon className="transition-all ease-in-out duration-300 w-[24px] h-[24px] dark:text-[#f3f3f3] text-[#000000]" />
        )}
      </p>
    </>
  );
};

export default LikeButton;
