'use client';

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import React, {useState} from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {useForm} from "react-hook-form";
import { useToast} from "@/components/ui/use-toast";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const FormSchema = z.object({
  question: z
    .string()
    .min(8, {
      message: "Question must be at least 8 characters.",
    })
    .max(255),
})

export default function GetInTouchDialog(){
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const {toast} = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      question: ''
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    setTimeout(() => {
      try {
        const request = {
          ...data,
        };

        console.log('Request', request);
        setOpen(false);
        toast({
          title: '✅ Thanks for reaching out!',
          description: "We've received your question and will be in touch shortly.",
        });
        form.reset();
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: `😿 Something went wrong while reaching out! Try again.`,
        });
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };


  return(
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          className={"bg-lavender-500 hover:bg-lavender-600 px-[6%] transition-transform duration-300 ease-in-out hover:scale-110 text-white"}>
          Get in touch
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md space-y-2 w-full flex flex-col items-start mx-2"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader className={"w-full items-start"}>
          <DialogTitle>Send us your question!</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex-col space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <DialogDescription className="text-sm">
                  {`Didn't find what you were looking for? 
                  We're happy to help just drop your question below.`}
                </DialogDescription>
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          id={field.name}
                          {...field}
                          rows={3}
                          required
                          className={"w-full text-sm p-1"}
                          placeholder={"Type your question here."}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-full flex items-end justify-end">
              <div className="flex gap-4">
                <DialogClose asChild>
                  <Button variant="outline" className={"px-6"}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={"bg-lavender-500 hover:bg-lavender-600 transition-transform duration-300 ease-in-out hover:scale-110 text-white px-6"}
                >
                  {isLoading ? 'Sending..' : 'Send'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}