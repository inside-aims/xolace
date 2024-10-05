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

type DropdownMenuProp = {
  comment?: boolean;
  postDetail?: boolean;
  postCard?: boolean;
  userId?: string | number;
  permissions?: string[];
  postId?: string;
};

const PostDropdown: React.FC<DropdownMenuProp> = ({
  comment,
  postDetail,
  postCard,
  userId,
  permissions,
  postId,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Delete post logic goes here.
  //   const onDelete = async () => {
  //     setIsLoading(true);
  //     try {
  //       await handleDelete({ comment, postCard, postId });
  //       toast({
  //         title: `Successfully Deleted Post. `,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
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
          {permissions?.includes(`delete(\"user:${userId}\")`) && (
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => console.log("delete")}
            >
              {isLoading
                ? "Deleting..."
                : comment
                  ? "Delete Comment"
                  : "Delete Post"}
            </DropdownMenuItem>
          )}

          {postCard && (
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href={`post/${postId}`}>View</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default PostDropdown;
