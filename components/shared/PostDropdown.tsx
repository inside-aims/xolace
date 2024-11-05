"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "../ui/use-toast";
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
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostDropdown: React.FC<DropdownMenuProp> = ({
  comment,
  postDetail,
  postCard,
  postId,
  postCreatedBy,
  commentId,
  commentCreatedBy,
  onOpenChange,
}) => {
  const router = useRouter();
  const user = useUserState((state) => state.user);
  const supabase = getSupabaseBrowserClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // open sheet
  const handleReportClick = () => {
    onOpenChange(true);
  };

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
        console.log(deleteError);
        throw new Error();
      }

      // display success toast
      toast({
        title: `Successfully Deleted Post.💯 `,
      });

      // navigate to feed page if its the details page
      postDetail && router.replace('/feed')
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
      <DropdownMenu modal={false}>
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
              className="hover:cursor-pointer text-red-400"
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
              className="hover:cursor-pointer text-red-400 hover:text-red-500"
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

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={handleReportClick}
          >
            <p className="text-red-400">Report</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default PostDropdown;
