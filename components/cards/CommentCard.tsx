"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { format } from "timeago.js";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostDropdown from "../shared/PostDropdown";

import { useMediaQuery } from "@/hooks/use-media-query";
import ReportForm from "../forms/ReportForm";

const CommentCard = ({ comment }: any) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  // states
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState("");

  //
  //
  useEffect(() => {
    setTimestamp(format(comment.created_at));
  }, [comment]);

  // if (!comment) {
  //   return (
  //     <>
  //       <div>Oops!! couldn&apos;t retrieve comments</div>
  //     </>
  //   );
  // }
  return (
    <>
     {isDesktop ? (
        <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Report</DialogTitle>
              <DialogDescription>
                What area are you having problems with?
              </DialogDescription>
            </DialogHeader>
            <ReportForm commentId={comment.id} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Report</DrawerTitle>
              <DrawerDescription>
                What area are you having problems with?
              </DrawerDescription>
            </DrawerHeader>
            <ReportForm commentId={comment.id} />
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    
    <Card className="w-[350px] md:w-full mb-5 dark:bg-dark-3">
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
            {format(comment.created_at)}
          </small>
        </div>
        <PostDropdown
          postId={""}
          comment={true}
          commentId={comment.id}
          commentCreatedBy={comment.created_by}
          onOpenChange={setIsSheetOpen}
        />
      </CardHeader>
      <CardContent className=" ">{comment.comment_text}</CardContent>
    </Card>
    </>
  );
};

export default CommentCard;
