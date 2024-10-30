import React, { useEffect, useState } from "react";
import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";
import { toggleLikePost } from "@/utils/helpers/toggleLikePost";
import { checkIsLiked } from "@/lib/utils";

interface postStatProps {
  post: any;
  section?: string;
  commentLength?: number;
  userId: string;
}

const PostStats = ({
  post,
  section = "post",
  commentLength,
  userId,
}: postStatProps) => {
  const postLikesList = post.likes.map((like: any) => like.user_id);
  console.log(postLikesList);
  // Set local state for likes
  const [likesList, setLikesList] = useState(postLikesList || []);
  const [isLiked, setIsLiked] = useState(checkIsLiked(likesList || [], userId));

  // Check if the current user has liked this post
  // useEffect(() => {
  //   if (userId) {
  //     const likedByUser = likes.some((like: any) => like.user_id === userId);
  //     setIsLiked(likedByUser);
  //   }
  // }, [likes, userId]);

  // Real-time updates for likes
  // useEffect((): any => {
  //   const subscription = supabase
  //     .channel("public:likes")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "likes",
  //         filter: `post_id=eq.${post.id}`,
  //       },
  //       (payload) => {
  //         console.log(payload);
  //         const eventType = payload.eventType;
  //         if (eventType === "INSERT") {
  //           console.log("Inside realtime");
  //           console.log("Likes -> ", likesList, " ", payload.new.user_id);
  //           setLikesList((prevLikes: any) => [
  //             ...prevLikes,
  //             payload.new.user_id,
  //           ]);
  //         } else if (eventType === "DELETE") {
  //           console.log("inside delete");
  //           console.log("Likes -> ", likesList, " ", payload.old.user_id);
  //           setLikesList((prevLikes: any) =>
  //             prevLikes.filter((like: any) => like !== payload.old.user_id)
  //           );
  //         }
  //       }
  //     )
  //     .subscribe();

  //   return () => subscription.unsubscribe();
  // }, [post.id]);

  // Handle like button click (with debounce)
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    let newLikes = [...likesList];
    const hasLiked = newLikes.includes(userId);

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikesList(newLikes);
    setIsLiked(!isLiked);
    await toggleLikePost(post.id, isLiked, userId);
  };

  return (
    <div className="flex gap-4 items-center">
      <div className="flex items-center  w-12 min-w-12 max-w-12">
        <button type="button" onClick={handleLike}>
          {isLiked ? (
            <HeartFilledIcon className="transition-all ease-in-out duration-300 w-[24px] h-[24px] dark:text-[#2e4ea7] text-[#b42d24]" />
          ) : (
            <HeartIcon className="transition-all ease-in-out duration-300 w-[24px] h-[24px] text-gray-500" />
          )}
        </button>
        <span>{likesList.length}</span>
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
        <p className="text-default-400 text-small">
          {section === "details" ? commentLength : post?.comments[0].count}
        </p>
      </div>
    </div>
  );
};

export default PostStats;
