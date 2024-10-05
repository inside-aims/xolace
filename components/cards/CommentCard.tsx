"use client";
import * as React from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostDropdown from "../shared/PostDropdown";
// import { IUser } from "@/types";

const CommentCard = () => {
  // if (!comment) {
  //   return (
  //     <>
  //       <div>Oops!! couldn&apos;t retrieve comments</div>
  //     </>
  //   );
  // }
  return (
    <Card className="w-[350px] md:w-full mb-5 dark:bg-dark-3">
      <CardHeader className=" flex-row justify-between items-start px-4 py-2 ">
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage src={""} />
            <AvatarFallback>XO</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 items-start justify-center">
            <h5 className="text-small tracking-tight text-default-400">
              user
              {/* {comment.creator.username} */}
            </h5>
          </div>
          <small className="ml-4 text-sm dark:text-gray-400 text-zinc-500">
            time
            {/* {format(comment.$createdAt)} */}
          </small>
        </div>
        <PostDropdown
          comment={true}
          userId={""}
          permissions={[]}
          postId={"comment.$id"}
        />
      </CardHeader>
      <CardContent className=" ">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat dolorum
        dicta, tempora non ipsa quisquam libero earum temporibus harum et
        veritatis, necessitatibus deserunt ex id rem ipsum? Ab, autem
        dignissimos.
        {/* {comment.caption} */}
      </CardContent>
    </Card>
  );
};

export default CommentCard;
