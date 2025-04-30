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
import { Sparkles } from 'lucide-react'; // Import an icon for flair


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

  // Creative username suggestion generator - Level Up!
  const generateSuggestions = (currentUsername: string): string[] => {
    if (!currentUsername) return [];

    const clean = currentUsername.replace(/[^a-zA-Z0-9_]/g, ''); // Allow underscore
    const vowels = 'aeiouAEIOU';
    //const consonants = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';
    const year = new Date().getFullYear().toString().slice(-2);
    const randNum = (digits = 3) => Math.floor(Math.random() * (10 ** digits));
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    const prefixes = ['The', 'Real', 'Captain', 'Agent', 'Just', 'Simply', ''];
    const suffixes = ['Pro', 'X', 'Prime', 'Legend', 'Guru', 'Ninja', 'Bot', 'Verse', 'Hub', 'HQ', year, `_${randNum(2)}`];
    const separators = ['_', '.', '']; // Add dot as separator

    const suggestions: Set<string> = new Set();

    // 1. Basic variations
    suggestions.add(`${clean}${randNum()}`);
    suggestions.add(`${clean}${pick(separators)}${year}`);

    // 2. Prefix/Suffix combos
    suggestions.add(`${pick(prefixes)}${clean}`);
    suggestions.add(`${clean}${pick(suffixes)}`);
    suggestions.add(`${pick(prefixes)}${clean}${pick(suffixes)}`);

    // 3. Character play
    if (clean.length > 3) {
      suggestions.add(`${clean.slice(0, 3)}${clean.slice(-1)}${randNum(2)}`); // First 3 + last + num
      suggestions.add(`${clean.split('').map(c => vowels.includes(c) ? pick(vowels.split('')) : c).join('')}${randNum(1)}`); // Vowel swap
    }
    suggestions.add(`${clean.split('').reverse().join('')}`); // Reversed

    // 4. Techy/Gaming
    suggestions.add(`${clean}.io`);
    suggestions.add(`${clean}_dev`);
    suggestions.add(`${clean}GG`);

    // 5. Descriptive (if username is somewhat dictionary-like)
    suggestions.add(`Awesome${clean}`);


    // Filter, ensure uniqueness, remove original, limit
    const finalSuggestions = Array.from(suggestions)
      .filter(s => s.length > 3 && s.length < 20 && s.toLowerCase() !== currentUsername.toLowerCase()) // Basic sanity checks
      .sort(() => Math.random() - 0.5) // Shuffle
      .slice(0, 5); // Take top 5 unique ones

    // Ensure at least 3 suggestions if possible
    while (finalSuggestions.length < 3 && suggestions.size > finalSuggestions.length) {
        const nextSuggestion = Array.from(suggestions).find(s => !finalSuggestions.includes(s) && s.toLowerCase() !== currentUsername.toLowerCase());
        if (nextSuggestion) {
            finalSuggestions.push(nextSuggestion);
        } else {
            break; 
        }
    }

     // Fallback if still less than 3
     if (finalSuggestions.length < 3) {
        const fallback = [`${clean}123`, `${clean}_star`, `My${clean}Profile`];
        fallback.forEach(fb => {
            if (finalSuggestions.length < 3 && !finalSuggestions.includes(fb) && fb.toLowerCase() !== currentUsername.toLowerCase()) {
                finalSuggestions.push(fb);
            }
        });
     }


    return finalSuggestions.slice(0, 5); // Return final list (max 5)
  };


  return(
    <SettingsNavigationWrapper title={"Change username"}>
      <div className={"w-full flex flex-col items-start"}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            {/* Username FormField */}
            <FormField
              control={form.control}
              name="username"
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

            {/* Creative Username Suggestions */}
            {user?.username && !user?.is_anonymous && (
              <div className="mt-2 px-4 py-6 border-t"> 
                <h5 className="text-base font-semibold mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Need inspiration?
                </h5>
                <div className="flex flex-wrap gap-2">
                  {generateSuggestions(user.username).map((suggestion, index) => (
                    <button
                      key={index}
                      type="button" 
                      className="px-3 py-1.5 text-sm rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-50" 
                      onClick={() => {
                        form.setValue('username', suggestion, {
                          shouldDirty: true,
                          shouldValidate: true
                        });
                      }}
                      title={`Use @${suggestion}`}
                    >
                      @{suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
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