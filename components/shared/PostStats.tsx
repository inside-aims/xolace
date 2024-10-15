import React, { useEffect, useState } from "react";
import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";
import { toggleLikePost } from "@/utils/helpers/toggleLikePost";
import { useUserState } from "@/lib/store/user";

interface postStatProps {
  post: any;
  section?: string;
  commentLength?: number;
}

const PostStats = ({
  post,
  section = "post",
  commentLength,
}: postStatProps) => {
  const supabase = getSupabaseBrowserClient();
  const user = useUserState((state) => state.user);

  // Set local state for likes
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(false);

  // Check if the current user has liked this post
  useEffect(() => {
    if (user?.id) {
      const likedByUser = likes.some((like: any) => like.user_id === user.id);
      setIsLiked(likedByUser);
    }
  }, [likes, user?.id]);

  // Real-time updates for likes
  useEffect((): any => {
    const subscription = supabase
      .channel("public:likes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "likes",
          //filter: `post_id=eq.${post.id}`,
        },
        (payload) => {
          const eventType = payload.eventType;
          if (eventType === "INSERT") {
            setLikes((prevLikes: any) => [...prevLikes, payload.new]);
          } else if (eventType === "DELETE") {
            setLikes((prevLikes: any) =>
              prevLikes.filter((like: any) => like.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [post.id]);

  // Handle like button click (with debounce)
  const handleLike = async () => {
    await toggleLikePost(post.id, isLiked, user?.id);
    setIsLiked(!isLiked);
  };

  return (
    <div className="flex gap-4 items-center">
      <div className="flex items-center">
        <button onClick={handleLike}>
          {isLiked ? (
            <HeartFilledIcon className="transition-all ease-in-out duration-300 w-[24px] h-[24px] dark:text-[#2e4ea7] text-[#b42d24]" />
          ) : (
            <HeartIcon className="text-gray-500" />
          )}
        </button>
        <span>{likes.length}</span>
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
