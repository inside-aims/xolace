'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useToast } from '../ui/use-toast';
import Loader from '../shared/loaders/Loader';

const formSchema = z.object({
  area: z.string().min(2).max(100),
  description: z.string().min(2).max(100),
});

const FeedbackForm = () => {
  const { toast } = useToast();

  // initialize supabase client
  const supabase = getSupabaseBrowserClient();

  // states
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      area: '',
      description: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    const { area, description } = values;

    const feedback = {
      area,
      description,
    };

    //
    const { error: feedbackError } = await supabase
      .from('feedbacks')
      .insert(feedback);

    if (feedbackError) {
      toast({
        variant: 'destructive',
        title: 'Oops, something must have gone wrong 😵‍💫!',
      });
      setIsLoading(false);
      return;
    }

    // show notification
    toast({
      variant: 'default',
      title: 'The Team appreciates your valuable feedback💯',
    });

    setIsLoading(false);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 py-4">
          <div className="">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger id="area">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ui">UI</SelectItem>
                        <SelectItem value="donation">Donation</SelectItem>
                        <SelectItem value="contribution">
                          Contribution
                        </SelectItem>
                        <SelectItem value="bugs">Found bugs</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormDescription>
                      If you choose other then please specify the area in the
                      textbox below
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Tell Us more</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please include all information relevant to your feedback."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
          disabled={isLoading}
          type="submit"
          className="dark:bg-sky-500 dark:hover:bg-sky-400"
        >
          {isLoading ? (
            <span className="flex gap-2">
              <Loader />
              <p>Loading...</p>
            </span>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default FeedbackForm;
