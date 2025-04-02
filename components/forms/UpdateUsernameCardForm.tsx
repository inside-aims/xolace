'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { logActivity } from '@/lib/activity-logger';
import { ActivityType } from '@/types/activity';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UpdateUsernameSchema } from '@/validation';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useUserState } from '@/lib/store/user';
import { useToast } from '../ui/use-toast';
import Loader from '../shared/loaders/Loader';

export default function UpdateUsernameCardForm() {
  // get user profile data
  const user = useUserState(state => state.user);

  // initialize supabase client
  const supabase = getSupabaseBrowserClient();

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // destructure toast function
  const { toast } = useToast();

  // initialize form state
  const form = useForm<z.infer<typeof UpdateUsernameSchema>>({
    resolver: zodResolver(UpdateUsernameSchema),
    defaultValues: {
      username: '',
    },
  });

  // function to update username
  async function onSubmit(data: z.infer<typeof UpdateUsernameSchema>) {
    setIsLoading(true);
    const { username } = data;

    if (!user) {
      toast({
        title: 'Error updating username',
        description: 'User is not logged in.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // save old username 
    const oldUsername = user.username;

    // update username in profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        username,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      toast({
        title: 'Error updating username',
        description:
          'Oops🫢!!, Something must have gone wrong or you are probably an anonymous user🤔',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: 'Username updated successfully',
      description: 'Go showcase your new username by posting😃!!',
    });

    // log profile update activity
    await logActivity({
      userId: user.id,
      entityType: ActivityType.PROFILE,
      action: 'updated',
      metadata: { new_username: username, old_username: oldUsername }
    });

    useUserState.setState({user: {...user, username: username}});
    setIsLoading(false);
    form.reset();
  }

  return (
    <Form {...form}>
      <Card className="relative overflow-hidden bg-gradient-to-bl from-white to-gray-50 p-1 shadow-xl dark:from-[hsl(228_85%_5%)] dark:to-[hsl(228_85%_3%)]">
        {/* <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] dark:bg-[linear-gradient(45deg,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)]" /> */}
        <div className="absolute right-0 top-0 h-16 w-16 rotate-45 bg-gradient-to-br from-purple-500/20 to-transparent dark:from-purple-500/10" />
        
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Update Username
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Choose a new username to represent yourself
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="New username"
                        className="backdrop-blur-sm"
                        {...field}
                      />
                      {field.value && (
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground">
                          @{field.value}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="-mx-6 -mb-6 mt-4 bg-gray-50/50 px-6 py-4 dark:bg-[hsl(228_85%_4%)] ">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600 "
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : 'Update Username'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}
