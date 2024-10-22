"use client";

import { useState } from "react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { handleDelete } from "@/hooks/useDelete";
import { useToast } from "../ui/use-toast";
import React from "react";
import { useUserState } from "@/lib/store/user";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";

type DropdownMenuProp = {
  comment?: boolean;
  postDetail?: boolean;
  postCard?: boolean;
  postId?: string;
  postCreatedBy?: string | number;
  commentId?: string;
  commentCreatedBy?: string | number;
};

const PostDropdown: React.FC<DropdownMenuProp> = ({
  comment,
  postDetail,
  postCard,
  postId,
  postCreatedBy,
  commentId,
  commentCreatedBy,
}) => {
  const user = useUserState((state) => state.user);
  const supabase = getSupabaseBrowserClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // check if user is author of the comment
  const isCommentAuthor = commentCreatedBy === user?.id;

  // check if user is the author of the post
  const isPostAuthor = postCreatedBy === user?.id;

  //  delete comment
  const onCommentDelete = async () => {
    setIsLoading(true);
    try {
      // await handleDelete({ comment, postCard, postId });
      const response = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);
      toast({
        title: `Successfully Deleted Comment.💯 `,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error deleting comment:",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // delete post
  const onPostDelete = async () => {
    setIsLoading(true);
    try {
      // await handleDelete({ comment, postCard, postId });
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (deleteError) {
        toast({
          title: "Error deleting post",
          description: "Oops! Something went wrong , please try again 👀 ",
        });
        throw new Error();
      }

      // display success toast
      toast({
        title: `Successfully Deleted Post.💯 `,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error deleting post:",
      });
      throw new Error();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isCommentAuthor && (
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={onCommentDelete}
            >
              {isLoading
                ? "Deleting..."
                : comment
                  ? "Delete Comment"
                  : "Delete Post"}
            </DropdownMenuItem>
          )}

          {/* delete action for post */}
          {isPostAuthor && (
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={onPostDelete}
            >
              {isLoading ? "Deleting..." : "Delete Post"}
            </DropdownMenuItem>
          )}

          {postCard && (
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href={`post/${postId}`}>View</Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="hover:cursor-pointer">
            <Link href={``}>Report</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default PostDropdown;
