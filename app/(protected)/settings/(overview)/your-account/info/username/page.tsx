'use client';

import { useState, useEffect } from 'react'; // Import useState and useEffect
import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem, FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { z } from "zod"
import { useUserState } from '@/lib/store/user'; 
import { getSupabaseBrowserClient } from '@/utils/supabase/client'; 
import { useToast } from '@/components/ui/use-toast'; 
import { logActivity } from '@/lib/activity-logger'; 
import { ActivityType } from '@/types/activity';
import { UpdateUsernameSchema } from '@/validation'; 
import Loader from '@/components/shared/loaders/Loader'; 

export default function UsernamePage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <UsernameContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <UsernameContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function UsernameContent() {
  // Get user profile data
  const user = useUserState(state => state.user);

  // Initialize Supabase client
  const supabase = getSupabaseBrowserClient();

  // States
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Destructure toast function
  const { toast } = useToast();

  // Use the correct schema from validation file
  const form = useForm<z.infer<typeof UpdateUsernameSchema>>({
    resolver: zodResolver(UpdateUsernameSchema),
    defaultValues: {
      username: '', 
    },
  });

  // Set default username when user data is available
  useEffect(() => {
    if (user?.username) {
      form.reset({ username: user.username });
    }
  }, [user, form]);


  // Handle form submission
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

    // Prevent updating if the username hasn't changed
    if (username === user.username) {
       toast({
        title: 'No changes detected',
        description: 'The username is the same as the current one.',
      });
      setIsLoading(false);
      return;
    }

    // Save old username
    const oldUsername = user.username;

    // Update username in profiles table
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
        description: updateError.message || 'Oops🫢!! Something went wrong.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: 'Username updated successfully',
      description: 'Your username has been changed!',
    });

    // Log profile update activity
    await logActivity({
      userId: user.id,
      entityType: ActivityType.PROFILE,
      action: 'updated',
      metadata: { new_username: username, old_username: oldUsername }
    });

    // Update user state in Zustand store
    useUserState.setState({user: {...user, username: username}});
    setIsLoading(false);
  }

  return(
    <SettingsNavigationWrapper title={"Change username"}>
      <div className={"w-full flex flex-col items-start"}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <FormField control={form.control} name="username"
              render={({ field }) => (
                <FormItem className={'flex flex-col px-4 pb-4'}>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="New username" {...field} required className={"py-6 pr-10"} disabled={user?.is_anonymous}/>
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
            {/* Remove or comment out the static suggestions */}
            {/* <div className={"mt-4 flex flex-col items-start gap-4 border-t px-4 py-6"}>
              <h5 className={"text-lg font-semibold"}>Suggestions</h5>
              <span>Federico</span>
              <span>Fede</span>
              <span>FedeDeJnr</span>
            </div> */}
            <div className={"flex justify-end border-t px-4 py-6"}>
              <Button type="submit" className={"bg-blue9 hover:bg-blue10 font-semibold text-white rounded-full px-8"} disabled={isLoading || !form.formState.isDirty}>
                {isLoading ? <Loader /> : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </SettingsNavigationWrapper>
  )
}