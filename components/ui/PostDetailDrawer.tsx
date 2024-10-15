"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import clsx from "clsx";
import { Textarea } from "./textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  HeartFilledIcon,
  HeartIcon,
  DoubleArrowLeftIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import CommentCard from "../cards/CommentCard";

import PostStats from "../shared/PostStats";
import { useToast } from "../ui/use-toast";
import Loader from "../shared/Loader";
import { CommentSchema } from "@/validation";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";

const PostDetailDrawer = ({ post }: any) => {
  const supabase = getSupabaseBrowserClient();
  const { toast } = useToast();
  const router = useRouter();
  const [comments, setComments] = useState(post?.comments || []);

  //   counter for comment fields
  const counter: number = 300;

  // initial height of the bottom drawer
  const [snap, setSnap] = useState<number | string | null>("180px");

  // form validator
  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      comment: "",
    },
  });

  // get for changes in the comment field
  const { watch } = form;
  const comment = watch("comment");

  //
  async function onSubmit(data: z.infer<typeof CommentSchema>) {
    const { comment } = data;
    console.log(comment);
    supabase
      .from("comments")
      .insert({
        post: post.id,
        comment_text: comment,
      })
      .then(() => {
        toast({
          title: "Comment Created 🖌️",
          description: "Your comment has been successfully created! 😆",
          variant: "default",
        });
        form.reset();
      });
  }

  return (
    <>
      <Drawer
        open
        snapPoints={["180px", "355px", 1]}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
      >
        <DrawerContent className="h-full max-h-[97%]">
          <DrawerHeader className="flex flex-col items-center relative">
            <Button
              variant={"link"}
              className="absolute left-5 max-sm:top-3 md:left-10 dark:text-sky-500 text-blue"
              onClick={() => router.back()}
            >
              <DoubleArrowLeftIcon className="dark:text-sky-500 text-blue mr-1" />
              back
            </Button>
            {true ? (
              <PostStats
                post={post}
                section="details"
                commentLength={comments.length}
              />
            ) : (
              <div>Kindly refresh the page!!</div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full md:w-1/2 "
              >
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Post your reply"
                          className="resize-none mb-2 h-[40px] rounded-full text-dark-1 dark:text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center">
                  <Button
                    size={"sm"}
                    disabled={comment.length > 300 || false}
                    type="submit"
                    className=" rounded-full"
                  >
                    {false ? (
                      <div className="flex items-center justify-center gap-x-2">
                        {" "}
                        <Loader /> <span>Loading</span>
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <p
                    className={` dark:text-white text-slate-900/90 border ${
                      counter - comment.length < 0
                        ? "border-red-500 bg-red-400"
                        : "border-blue bg-blue"
                    } h-9 min-h-9 max-h-9 w-9 min-w-9 max-w-9 flex justify-center items-center p-3 rounded-full shadow-sm`}
                  >
                    {counter - comment.length}
                  </p>
                </div>
              </form>
            </Form>
          </DrawerHeader>

          <div
            className={clsx(
              "flex flex-col max-sm:max-w-md mx-auto w-full md:w-1/2 p-4 pt-5",
              {
                "overflow-y-auto": snap === 1,
                "overflow-hidden": snap !== 1,
              }
            )}
          >
            {comments.map((comment: any) => (
              <CommentCard comment={comment} />
            ))}
            {comments.length == 0 && (
              <div>
                <p>No comments</p>
              </div>
            )}
          </div>

          <DrawerFooter>
            <div className=" flex justify-between items-center text-blue dark:text-sky-500 px-4">
              <Link href={"/feed"}>Home</Link>
              <Link href={"/profile"}>Profile</Link>

              <Link href={"https://www.instagram.com/"}>
                <InstagramLogoIcon color="red" className="h-6 w-6" />
              </Link>
              <Link href={"https://www.instagram.com/"}>
                <LinkedInLogoIcon color="blue" className="h-6 w-6" />
              </Link>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PostDetailDrawer;
