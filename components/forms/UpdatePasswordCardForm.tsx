'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UpdatePasswordSchema } from '@/validation';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useToast } from '../ui/use-toast';
import Loader from '../shared/loaders/Loader';
import ToggleEyeIcon from '../ui/ToggleEyeIcon';

const UpdatePasswordCardForm = () => {
  const { toast } = useToast();
  const supabase = getSupabaseBrowserClient();

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      password: '',
      newPassword: '',
    },
  });

  //
  async function onSubmit(data: z.infer<typeof UpdatePasswordSchema>) {
    setIsLoading(true);
    console.log(data);

    const { password, newPassword } = data;

    // Get user data
    const user = (await supabase.auth.getUser()).data?.user;
    if (!user) {
      console.error('User not found');
      return;
    }

    if (user.is_anonymous) {
      console.log('anonymous-> ', user.is_anonymous);
      toast({
        title: 'Error updating password',
        description: 'Anonymous users cannot update passwords',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (user.email) {
      // Re-authenticate user with old password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      });

      if (signInError) {
        console.error('Old password is incorrect:', signInError.message);
        toast({
          title: 'Old password is incorrect',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Old password is correct, now update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error('Error updating password:', updateError.message);
        toast({
          title: 'Error updating password',
          description: updateError.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully',
      });
      // Clear form , Log out the user and redirect to login page
      setIsLoading(false);
      form.reset();

      supabase.auth.signOut();
    }
  }

  return (
    <Form {...form}>
      <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 p-1 shadow-xl dark:from-[hsl(228_85%_5%)] dark:to-[hsl(228_85%_3%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] dark:bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)]" />
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Change Password
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter your current password and choose a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Current password"
                        className="pr-10 backdrop-blur-sm"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 md:top-[-3] transform"
                    >
                      <ToggleEyeIcon showPassword={showPassword}
                        />
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="New password"
                        className="pr-10 backdrop-blur-sm"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 md:top-[-3] transform"
                    >
                      <ToggleEyeIcon showPassword={showNewPassword}
                         />
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="-mx-6 -mb-6 mt-4 bg-gray-50/50 px-6 py-4 dark:bg-[hsl(228_85%_4%)]">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue to-indigo-600 text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : 'Update Password'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};

export default UpdatePasswordCardForm;
