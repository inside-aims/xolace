"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AddHealthTipsSchema } from "@/validation";

import HelathTipTagCard from "../cards/HelathTipTagCard";
import Editor from "../editor";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";
import { useUserState } from "@/lib/store/user";
import { generateSlug } from "@/lib/utils";
import { toast } from "sonner";
import { DefaultLoader } from "../shared/loaders/DefaultLoader";

const HealthTipsForm = () => {
  const supabase = getSupabaseBrowserClient();
  const { user , roles} = useUserState();
  console.log("roles ", roles)

  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef<MDXEditorMethods>(null);
  const form = useForm<z.infer<typeof AddHealthTipsSchema>>({
    resolver: zodResolver(AddHealthTipsSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const handleCreateHealthTip = async (data : z.infer<typeof AddHealthTipsSchema>) => {
    if(!user){
      return;
    }
    setIsLoading(true);
    // TODO: Create question logic here
    console.log(data);
    console.log(form.getValues());

    try {
      // we will call the edge fuction over here 
    // const { data : healthTipData, error : healthTipError } = await supabase.functions.invoke('insert-health-tip', 
    //     {
    //     body: JSON.stringify(data), // Explicitly stringify
    //   } 
    // )

    // generate a slug from the title
    const slug = generateSlug(data.title);

    const { data: healthTipData, error } = await supabase
  .rpc('insert_health_tip_with_tags', {
    p_title: data.title,
    p_content: data.content,
    p_created_by: user.id,
    p_author_name: user.username,
    p_author_avatar_url: user.avatar_url,
    p_tags: data.tags,
    p_slug: slug
  });

    if (error) {
      console.error('Error creating health tip:', error);
      return;
    }

    console.log('Health tip created successfully:', healthTipData);
    form.reset();
    form.setValue("content", "");
    toast.success("Health tip submitted successfully, currently under review and will be published soon 🖊️");
    //editorRef.current?.setValue("");
    } catch (error) {
      console.error('Error creating health tip:', error);
      toast.error("Failed to create health tip, please try again later 🖊️");
    } finally {
      setIsLoading(false);
    }
    // Redirect to the dashboard or show a success message.
  };

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);
    form.setValue("tags", newTags);

    if(newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "At least one tag is required",
      });
    }
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();

      if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag length should be less than 15 characters",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateHealthTip)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2.5 ">
              <FormLabel className=" paragraph-semibold text-dark400_light800">
                Health Tip Title <span className=" text-rose-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  required
                  {...field}
                  className=" paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] rounded-1.5 border"
                />
              </FormControl>
              <FormDescription className=" body-regular mt-2.5 text-light-500">
                The title should be specific and easy to understand
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2.5 ">
              <FormLabel className=" paragraph-semibold text-dark400_light800">
                Health Tip Content{" "}
                <span className=" text-rose-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  editorRef={editorRef}
                  value={field.value}
                  fieldChange={field.onChange}
                />
              </FormControl>
              <FormDescription className=" body-regular mt-2.5 text-light-500">
                Introduce the health tip and expand on what you&apos;ve put in the
                title
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2.5 ">
              <FormLabel className=" paragraph-semibold text-dark400_light800">
                Tags <span className=" text-rose-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    placeholder="Add Tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                    className=" paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] rounded-1.5 border"
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 flex-wrap gap-2.5 ">
                      {field.value.map((tag: string) => (
                        <HelathTipTagCard
                          key={tag}
                          _id={tag}
                          name={tag}
                          compact
                          remove
                          isButton
                          handleRemove={() => handleTagRemove(tag, field)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className=" body-regular mt-2.5 text-light-500">
                Add up to three tags to describe what your question is about.
                You need to press enter to add a tag
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className=" mt-5 mb-16 md:mb-5 flex justify-end">
          <Button
          variant="flat"
            className=" w-fit !text-light-900 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? <DefaultLoader size={20}/> : 'Add Health Tip'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HealthTipsForm;
