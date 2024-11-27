"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import EmojiPicker, { EmojiClickData, Theme, EmojiStyle } from "emoji-picker-react";
import { Smile } from "lucide-react";

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
import { postMoods } from "@/constants";
import { Checkbox } from "../ui/checkbox";
import { Send } from "lucide-react";
import MoodCarousel from "../mood-carousel";
import { Mood } from "@/types";
import ShinyButton from "../ui/shiny-button";

export function PostForm() {
  const supabase = getSupabaseBrowserClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(postMoods[0]);
  const [isChecked, setIsChecked] = useState<"indeterminate" | boolean>(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // get mood boolean value
  const isNeutral = selectedMood?.value === "neutral";
  const isHappy = selectedMood?.value === "happy";
  const isSad = selectedMood?.value === "sad";
  const isAngry = selectedMood?.value === "angry";
  const isConfused = selectedMood?.value === "confused";

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

  // function to handle mood selection add to post field
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
          mood: selectedMood?.value,
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
      setSelectedMood(postMoods[0]);
    }
  }

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
                <div className="relative">
                  <Textarea
                    {...field}
                    ref={(e) => {
                      field.ref(e);
                      // @ts-expect-error current is read-only
                      textareaRef.current = e;
                    }}
                    placeholder="What's on your mind?"
                    className={`resize-none h-[150px] !pb-6 !pr-10 text-dark-2 dark:text-white transition-all duration-300
                    ${isHappy && "border-green-500 dark:border-green-400"} ${isSad && "border-blue dark:border-sky-400"}
                    ${isAngry && "border-red-500 dark:border-red-400"} ${isConfused && "border-yellow-500 dark:border-yellow-400"}
                    `}
                  />

                  {/* mood icon */}
                  <div className=" absolute bottom-3 left-3">
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
                  </div>

                  {/* checkbox*/}

                  <div className="absolute bottom-14 right-[17px] h-5 w-5">
                    <Checkbox
                      indicator={<Hours />}
                      className=" transform duration-300 ease-in-out data-[state=checked]:bg-amber-300 "
                      checked={isChecked}
                      onCheckedChange={(value) => setIsChecked(value)}
                    />
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

        <div className=" flex justify-between items-center">
          <ShinyButton
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
