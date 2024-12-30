"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import EmojiPicker, {
  EmojiClickData,
  Theme,
  EmojiStyle,
} from "emoji-picker-react";
import { Smile } from "lucide-react";
import { motion } from "framer-motion";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "../ui/use-toast";
import Loader from "../shared/Loader";
import { PostSchema } from "@/validation";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";
import { urlPath } from "@/utils/url-helpers";
import { getMoodLabelStyle, postMoods } from "@/constants";
import { Checkbox } from "../ui/checkbox";
import { Send } from "lucide-react";
import MoodCarousel from "../mood-carousel";
import { Mood } from "@/types";
import ShinyButton from "../ui/shiny-button";
import { FloatingCheckbox } from "../create-postComponents/floating-checkbox";
import { calculateExpiryDate } from "@/lib/utils";
import { removeHashtags } from "@/lib/utils";

export function PostForm() {
  const supabase = getSupabaseBrowserClient();
  const { toast } = useToast();

  // states
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(postMoods[0]);
  const [tags, setTags] = useState<string[]>([]);

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // get mood boolean value
  const isNeutral = selectedMood?.value === "neutral";
  const isHappy = selectedMood?.value === "happy";
  const isSad = selectedMood?.value === "sad";
  const isAngry = selectedMood?.value === "angry";
  const isConfused = selectedMood?.value === "confused";

  //  counter for comment fields
  const counter: number = 500;

  //  form
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      content: "",
      is24HourPost: false,
    },
  });

  // watch post realtime updates
  const { watch } = form;
  const content = watch("content");

  // function to handle emoji selection add to post field
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent =
        form.getValues("content").substring(0, start) +
        emoji +
        form.getValues("content").substring(end);
      form.setValue("content", newContent, { shouldValidate: true });

      // Set cursor position after the inserted emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    }
    setIsEmojiPickerOpen(false);
  };

  // retrieve tags from content
  const handleInput = (value: string) => {
    // Extract tags
    const newTags = value.match(/#\w+/g) || [];
    const cleanTags = newTags.map((tag) =>
      tag
        .slice(1)
        .replace(/[^a-zA-Z0-9_]/g, "")
        .toLowerCase()
    );
    setTags([...new Set(cleanTags)]); // Remove # from tags
  };

  // function to handle submit
  async function onSubmit(data: z.infer<typeof PostSchema>) {
    // save post values to db
    setIsLoading(true);
    console.log(data);
    const { content, is24HourPost } = data;
    // remove tags from post content
    const contentWithoutTags = removeHashtags(content);
    const duration = is24HourPost ? 24 : null;
    const expires_at = duration ? calculateExpiryDate(duration) : null;

    try {
      // const { data: postData, error: postError } = await supabase
      //   .from("posts")
      //   .insert({
      //     content: contentWithoutTags,
      //     mood: selectedMood?.value,
      //     expires_in_24hr: is24HourPost,
      //     duration,
      //     expires_at
      //   })
      //   .select()
      //   .single();

      console.log(
        "data -> ",
        tags,
        " ",
        contentWithoutTags,
        " ",
        expires_at,
        " ",
        is24HourPost
      );

      const { error: postError } = await supabase.rpc(
        "create_post_with_tags",
        {
          content: contentWithoutTags,
          duration: duration ? `${duration}` : duration,
          expires_at,
          expires_in_24hr: is24HourPost,
          mood: selectedMood?.value,
          tag_names: tags,
        }
      );


      if (postError) {
        toast({
          variant: "destructive",
          title: "Oops, something must have gone wrong 😵‍💫!",
        });
        console.log(postError);
        return;
      }


        // show notification
        toast({
          variant: "default",
          title: "Post created successfully🤭 !",
        });

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
      setSelectedMood(postMoods[0]);
      setTags([]);
    }
  }

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
                <div className="relative">
                  <Textarea
                    {...field}
                    ref={(e) => {
                      field.ref(e);
                      textareaRef.current = e;
                    }}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      field.onChange(e);
                      handleInput(e.target.value);
                    }}
                    placeholder="What's on your mind? Use # for tags!"
                    className={`resize-none h-[150px] !pr-10 !pt-8 text-dark-2 dark:text-white transition-all duration-300 no-focus ${isNeutral && "border-pink-500 dark:border-pink-400"}
                    ${isHappy && "border-green-500 dark:border-green-400"} ${isSad && "border-blue dark:border-sky-400"}
                    ${isAngry && "border-red-500 dark:border-red-400"} ${isConfused && "border-yellow-500 dark:border-yellow-400"}
                    `}
                  />

                  {/* mood icon */}
                  <div className=" absolute bottom-3 left-3 flex items-center gap-x-1">
                    <span>
                      {selectedMood?.gif ? (
                        <Image
                          src={selectedMood?.gif}
                          alt="Sad Emoji"
                          width={24}
                          height={24}
                          className="h-6 sm:h-7 sm:w-7"
                        />
                      ) : (
                        selectedMood?.icon
                      )}
                    </span>
                    <p className="dark:text-gray-500 text-gray-900 text-[12px]">
                      Mood:{" "}
                      <span
                        className={`${isNeutral && "text-pink-500 dark:text-pink-400"}
                    ${isHappy && "text-green-500 dark:text-green-400"} ${isSad && "text-blue dark:text-sky-400"}
                    ${isAngry && "text-red-500 dark:text-red-400"} ${isConfused && "text-yellow-500 dark:text-yellow-400"}`}
                      >
                        {selectedMood?.label}
                      </span>
                    </p>
                  </div>

                  {/* emoji picker */}
                  <Popover
                    open={isEmojiPickerOpen}
                    onOpenChange={setIsEmojiPickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-2 right-2"
                        aria-label="Open emoji picker"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="end">
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        width="100%"
                        theme={Theme.AUTO}
                        height={370}
                        searchDisabled
                        emojiStyle={EmojiStyle.APPLE}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>

              {/* checkbox*/}
              <FormField
                control={form.control}
                name="is24HourPost"
                render={({ field }) => (
                  <FloatingCheckbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />

              {/* tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              )}

              <div className="h-4">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="w-full max-sm:px-10 !mt-1 ">
          <MoodCarousel
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
          />
        </div>

        <div className=" flex flex-row-reverse justify-between items-center">
          <ShinyButton
            disabled={content.length > 500 || isLoading}
            type="submit"
            className=" rounded-full"
          >
            {isLoading ? (
              <span className=" flex gap-2">
                <Loader />
                <p>Loading...</p>
              </span>
            ) : (
              <>
                <Send size={20} strokeWidth={1.75} absoluteStrokeWidth />
              </>
            )}
          </ShinyButton>
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
