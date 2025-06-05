'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

const FormSchema = z.object({
  question: z
    .string()
    .min(8, {
      message: 'Question must be at least 8 characters.',
    })
    .max(255),
});

export default function GetInTouchDialog() {
  // initialize supabase client
  const supabase = getSupabaseBrowserClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      question: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    try {
      const request = {
        ...data,
      };

      const { error: helpCenterError } = await supabase
        .from('help_center')
        .insert(request);

      if (helpCenterError) {
        toast.error(`😿 Something went wrong while reaching out! Try again.`);
        setIsLoading(false);
        return;
      }

      setOpen(false);
      toast.success('Thanks for reaching out!', {
        description:
          "We've received your question and will be in touch shortly.",
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error(`😿 Something went wrong while reaching out! Try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={
            'bg-lavender-500 hover:bg-lavender-600 px-[6%] text-white transition-transform duration-300 ease-in-out hover:scale-110'
          }
        >
          Get in touch
        </Button>
      </DialogTrigger>
      <DialogContent
        className="mx-2 flex max-w-[90%] flex-col items-start space-y-2 sm:max-w-md"
        onInteractOutside={event => {
          event.preventDefault();
        }}
      >
        <DialogHeader className={'w-full items-start'}>
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
                          className={'w-full p-1 text-sm'}
                          placeholder={'Type your question here.'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex w-full items-end justify-end">
              <div className="flex gap-4">
                <DialogClose asChild>
                  <Button variant="outline" className={'px-6'}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={
                    'bg-lavender-500 hover:bg-lavender-600 px-6 text-white transition-transform duration-300 ease-in-out hover:scale-110'
                  }
                >
                  {isLoading ? 'Sending..' : 'Send'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
