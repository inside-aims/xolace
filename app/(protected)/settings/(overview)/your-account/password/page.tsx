'use client';

import { useState } from 'react'; // Import useState
import { notFound } from 'next/navigation'; // Import notFound

import SettingsWrapper from '@/components/settings/settings-wrapper';
import { SettingsNavigationWrapper } from '@/components/settings/settings-navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Loader from '@/components/shared/loaders/Loader';
import ToggleEyeIcon from '@/components/ui/ToggleEyeIcon';
import { SettingsPasswordSchema } from '@/validation';

export default function PasswordPage() {
  return (
    <>
      <div className="flex w-full flex-col items-start md:hidden">
        <PasswordContent />
      </div>
      <div className="hidden flex-col items-center md:flex">
        <SettingsWrapper>
          <PasswordContent />
        </SettingsWrapper>
      </div>
    </>
  );
}

function PasswordContent() {
  const { toast } = useToast();
  const supabase = getSupabaseBrowserClient();

  // States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  // Form initial values using the refined schema
  const form = useForm<z.infer<typeof SettingsPasswordSchema>>({
    resolver: zodResolver(SettingsPasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  async function onSubmit(data: z.infer<typeof SettingsPasswordSchema>) {
    setIsLoading(true);
    const { currentPassword, newPassword } = data; // confirmNewPassword is validated by schema

    // Get user data
    const user = (await supabase.auth.getUser()).data?.user;
    if (!user) {
      setIsLoading(false);
      return notFound();
    }

    if (user.is_anonymous) {
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
        password: currentPassword,
      });

      if (signInError) {
        toast({
          title: 'Current password is incorrect',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Current password is correct, now update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
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
        description:
          'Your password has been updated successfully. You will be logged out.',
      });
      // Clear form, Log out the user
      setIsLoading(false);
      form.reset();

      // Sign out after successful password change
      await supabase.auth.signOut();
      // Optionally redirect to login page after sign out
      // window.location.href = '/sign-in';
    } else {
      toast({
        title: 'Error updating password',
        description: 'User email not found.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  }

  return (
    <SettingsNavigationWrapper title="Change Password">
      <div className="flex w-full flex-col items-start">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            {/* Current Password */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col px-4 pb-4">
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Enter current password"
                        {...field}
                        required
                        className="w-full py-6 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-3 transform md:top-[-3]"
                      >
                        <ToggleEyeIcon showPassword={showCurrentPassword} />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4 flex w-full flex-col items-start gap-4 border-t px-4 py-6">
              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col pb-4">
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Enter new password"
                          {...field}
                          required
                          className="w-full py-6 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 transform md:top-[-3]"
                        >
                          <ToggleEyeIcon showPassword={showNewPassword} />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm New Password */}
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col pb-4">
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <div className=" relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Re-enter new password"
                          {...field}
                          required
                          className="w-full py-6 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-3 transform bg-red-400 md:top-[-3]"
                        >
                          <ToggleEyeIcon showPassword={showConfirmPassword} />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Info Notice */}
            <div className="flex border-t px-4 py-6 text-sm text-neutral-500">
              Changing your password will log you out of the session you are in
              now and probably all your other sessions.
            </div>

            {/* Submit Button */}
            <div className="flex justify-end border-t px-4 py-6">
              <Button
                type="submit"
                className="btn-depth hover:btn-depth-hover active:btn-depth-active"
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : 'Save'}{' '}
                {/* Show loader when loading */}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </SettingsNavigationWrapper>
  );
}
