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
import { postMoods } from "@/constants";
import { Checkbox } from "../ui/checkbox";

export function PostForm() {
  const supabase = getSupabaseBrowserClient();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mood, setMood] = useState(postMoods[0]);
  const [isChecked, setIsChecked] = useState<"indeterminate" | boolean>(false);

  // get mood boolean value
  const isNeutral = mood.value === "neutral";
  const isHappy = mood.value === "happy";
  const isSad = mood.value === "sad";
  const isAngry = mood.value === "angry";
  const isConfused = mood.value === "confused";

  //  counter for comment fields
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

  // function to handle submit
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
          mood: mood.value,
          expires_in_24hr: isChecked,
        })
        .select()
        .single();

      if (postError) {
        toast({
          variant: "destructive",
          title: "Oops, something must have gone wrong 😵‍💫!",
        });
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

  const Hours = () => <p className="text-[9px]">24h</p>;

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
            <FormItem className="relative">
              <FormControl>
                <Textarea
                  placeholder="What's on your mind?"
                  className={`resize-none h-[130px] text-dark-2 dark:text-white transition-all duration-300
                    ${isHappy && "border-green-500 dark:border-green-400"} ${isSad && "border-blue dark:border-sky-400"}
                    ${isAngry && "border-red-500 dark:border-red-400"} ${isConfused && "border-yellow-500 dark:border-yellow-400"}
                    `}
                  {...field}
                />
              </FormControl>

              {/* mood icon */}
              <div className=" absolute bottom-3 left-3">{mood.icon}</div>

              {/* checkbox*/}

              <div className="absolute bottom-3 right-3">
                <Checkbox
                  indicator={<Hours />}
                  className=" transform duration-300 ease-in-out"
                  checked={isChecked}
                  onCheckedChange={(value) => setIsChecked(value)}
                />
                {isChecked}
              </div>

              {/* <FormDescription>
                You can <span>@mention</span> other users and organizations.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* mood buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {postMoods.map((mood) => (
            <Button
              key={mood.id}
              type="button"
              className={`flex gap-2 rounded-3xl dark:bg-transparent border border-gray-700 dark:text-white text-black  text-sm text-center ${
                isNeutral && mood.value === "neutral"
                  ? "border-zinc-600 bg-gray-500"
                  : isHappy && mood.value === "happy"
                    ? "border-green-500 bg-green-400"
                    : isSad && mood.value === "sad"
                      ? "border-blue bg-blue"
                      : isAngry && mood.value === "angry"
                        ? "border-red-500 bg-red-400"
                        : isConfused && mood.value === "confused"
                          ? "border-yellow-500 bg-yellow-400"
                          : "border-zinc-400 bg-zinc-100"
              }`}
              onClick={() => {
                setMood(mood);
              }}
            >
              {` ${mood.icon} ${mood.label}`}
            </Button>
          ))}
        </div>

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
