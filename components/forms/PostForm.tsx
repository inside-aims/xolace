"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "../ui/use-toast";
import Loader from "../shared/Loader";
import { PostSchema } from "@/validation";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";
import { urlPath } from "@/utils/url-helpers";

export function PostForm() {
  const supabase = getSupabaseBrowserClient();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const counter: number = 300;

  //  form
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      content: "",
    },
  });

  // watch post realtime updates
  const { watch } = form;
  const content = watch("content");

  async function onSubmit(data: z.infer<typeof PostSchema>) {
    // Do something with the form values.
    setIsLoading(true);
    console.log(data);
    const { content } = data;

    try {
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .insert({
          content,
        })
        .select()
        .single();

      if (postError) {
        console.log(postError);
        return;
      }

      if (postData) {
        // show notification
        toast({
          variant: "default",
          title: "Post created successfully🤭 !",
        });
        router.push(urlPath(`/post/${postData.id}`));
      }
    } catch (error: any) {
      toast({
        title: "Error!",
        description: "Ooops🫢 !! Could not create post, Please try again",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }

  useEffect(() => {
    router.prefetch(`post/[postId]`);
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" w-full md:w-2/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="What's on your mind?"
                  className="resize-none h-[130px] text-dark-2 dark:text-white"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription>
                You can <span>@mention</span> other users and organizations.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className=" flex justify-between items-center">
          <Button
            disabled={content.length > 300 || isLoading}
            type="submit"
            className=" rounded-full"
          >
            {isLoading ? (
              <span className=" flex gap-2">
                <Loader />
                <p>Loading...</p>
              </span>
            ) : (
              "Submit"
            )}
          </Button>
          <p
            className={` dark:text-white text-slate-900/90 border ${
              counter - content.length < 0
                ? "border-red-500 bg-red-400"
                : "border-blue bg-blue"
            } h-9 min-h-9 max-h-9 w-9 min-w-9 max-w-9 flex justify-center items-center p-3 rounded-full shadow-sm`}
          >
            {counter - content.length}
          </p>
        </div>
      </form>

      <div className=" text-sm text-zinc-600 container mx-auto text-center pt-20  px-3">
        Tip : Platform made to share your thought without holding back..
      </div>
    </Form>
  );
}
