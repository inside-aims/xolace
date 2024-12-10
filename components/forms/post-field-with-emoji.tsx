'use client'

import { useState, useRef, useCallback } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { FloatingCheckbox } from "../floating-checkbox"

export const postSchema = z.object({
  content: z
    .string()
    .min(10, {
      message: "Post must be at least 10 characters.",
    })
    .max(500, {
      message: "Post must not be longer than 500 characters.",
    }),
    is24HourPost: z.boolean(),
});

export default function PostFieldWithEmoji() {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      is24HourPost: false,
    },
  })

  const handleEmojiClick = useCallback((emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = form.getValues("content").substring(0, start) + emoji + form.getValues("content").substring(end)
      form.setValue("content", newContent, { shouldValidate: true })
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length
        textarea.focus()
      }, 0)
    }
    setIsEmojiPickerOpen(false)
  }, [form])

  const onSubmit = useCallback((data: z.infer<typeof postSchema>) => {
    console.log("Form submitted:", data)
    // Here you would typically send the post data to your backend
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-4">
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
                      field.ref(e)
                      // @ts-expect-error current
                      textareaRef.current = e
                    }}
                    placeholder="Write your post..."
                    className="min-h-[150px] pr-10 pt-10"
                    aria-label="Post content"
                  />
                  <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
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
                      <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Post</Button>
      </form>
    </Form>
  )
}

