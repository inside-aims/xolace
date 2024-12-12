"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { format } from "timeago.js";

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
import KvngDialogDrawer from "../shared/KvngDialogDrawer";

const CommentCard = ({ comment }: any) => {
  // states
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState("");

  //
  useEffect(() => {
    setTimestamp(format(comment.created_at));
  }, [comment]);

  return (
    <>
      {/* dialog or drawer to report comment */}
      <KvngDialogDrawer
        title="Report Comment"
        isDialogDrawerOpen={isOpen}
        setIsDialogDrawerOpen={setIsOpen}
      >
        <ReportForm commentId={comment.id} />
      </KvngDialogDrawer>

      <Card className="w-full md:w-full mb-5 dark:bg-dark-3">
        <CardHeader className=" flex-row justify-between items-start px-4 py-2 ">
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage src={comment?.author_avatar_url} />
              <AvatarFallback>XO</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 items-start justify-center">
              <h5 className="text-small tracking-tight text-default-400">
                {comment.author_name}
              </h5>
            </div>
            <small className="ml-4 text-sm dark:text-gray-400 text-zinc-500">
              {timestamp}
            </small>
          </div>
          <PostDropdown
            postId={""}
            comment={true}
            commentId={comment.id}
            commentCreatedBy={comment.created_by}
            onOpenChange={setIsOpen}
          />
        </CardHeader>
        <CardContent className=" ">{comment.comment_text}</CardContent>
      </Card>
    </>
  );
};

export default CommentCard;
