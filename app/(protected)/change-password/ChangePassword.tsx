'use client';

import React, { useState, useActionState, useRef, useEffect } from 'react';

import { resetPasswordAction } from '@/app/actions';
import { ResetPasswordSchema } from '@/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { ResetPasswordActionState } from '@/lib/auth/middleware';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import ToggleEyeIcon from '@/components/ui/ToggleEyeIcon';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Loader from '@/components/shared/loaders/Loader';
import { SecurityAlert } from '@/components/shared/xolace-alert';

export default function ChangePassword({ from }: { from: string | undefined }) {
  const [showPassword, setShowPassword] = useState(false);
  const toastIdRef = useRef<string | number | null>(null);
  const [state, formAction, pending] = useActionState<
    ResetPasswordActionState,
    FormData
  >(resetPasswordAction, {
    newPassword: '',
    confirmNewPassword: '',
  });

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  //   listen for changes in form input
  const { watch } = form;
  const [newPassword, confirmNewPassword] = watch([
    'newPassword',
    'confirmNewPassword',
  ]);

  const handleClick = () => {
    // Validate password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (newPassword === confirmNewPassword && passwordRegex.test(newPassword)) {
      const toastId = toast('Change-password');
      toastIdRef.current = toastId;
      toast.loading(' ➰ Resetting password in a moment', {
        id: toastIdRef.current,
      });
    }
  };

  useEffect(() => {
    if (!toastIdRef.current || !state.message) return;

    if (state.success) {
      // Handle success
      toast.success(state.message, {
        id: toastIdRef.current,
      });
      form.reset();
    } else {
      // Handle error
      toast.error(state.message, {
        id: toastIdRef.current,
      });
    }

    // Clear the ref after handling the toast to prevent re-firing
    toastIdRef.current = null;
  }, [state]);

  return (
    <>
      {/*  will show an alert if the from is equal to "professional-onboarding"*/}
      {from === 'professional-onboarding' && (
        <div className="px-3 pt-3 sm:px-0">
          <SecurityAlert
            title="Welcome to Your Professional Account!"
            description="For security, we recommend changing your temporary password to something personal and secure."
            supportingText="This helps protect your professional data and client information"
            className="mb-6"
          />
        </div>
      )}

      <Form {...form}>
        <form
          className="flex w-full max-w-md flex-col gap-2 p-4 [&>input]:mb-4"
          action={formAction}
        >
          <h1 className="text-2xl font-medium">Change Password</h1>
          <p className="text-foreground/60 text-sm">
            Please enter your new password below.
          </p>
          {/* Password input */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      className="w-full rounded-lg"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-[10] right-3 text-neutral-400 md:top-[-5]"
                    >
                      <ToggleEyeIcon showPassword={showPassword} />
                    </button>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-neutral-400">
                  Tip: Min 8 chars,at least 1 uppercase & 1 number.
                </FormDescription>

                {state?.errors?.newPassword && (
                  <div className="text-sm text-red-500">
                    {state.errors.newPassword[0]}
                  </div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      className="w-full rounded-lg"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-[10] right-3 text-neutral-400 md:top-[-5]"
                    >
                      <ToggleEyeIcon showPassword={showPassword} />
                    </button>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-neutral-400">
                  Tip: Min 8 chars,at least 1 uppercase & 1 number.
                </FormDescription>

                {state?.errors?.confirmNewPassword && (
                  <div className="text-sm text-red-500">
                    {state.errors.confirmNewPassword[0]}
                  </div>
                )}
              </FormItem>
            )}
          />
          <div className="">
            <Button
              disabled={pending}
              className={
                pending
                  ? `bg-ocean-100 text-ocean-400 w-full`
                  : `bg-ocean-500 hover:bg-ocean-600 w-full transform rounded-lg transition-transform duration-300 ease-in-out hover:scale-[1.03]`
              }
              type="submit"
              onClick={handleClick}
            >
              {pending ? (
                <div className="flex items-center justify-center gap-x-2">
                  {' '}
                  <Loader /> <span>Changing...</span>
                </div>
              ) : (
                'Reset Password'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
