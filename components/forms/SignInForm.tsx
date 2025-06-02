'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
//import { useToast } from '../ui/use-toast';
import {toast} from 'sonner'
import { useRouter } from 'next/navigation';

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
import { Checkbox } from '@/components/ui/checkbox';
import ToggleEyeIcon from '../ui/ToggleEyeIcon';
import { signinSchema } from '@/validation';
import Loader from '../shared/loaders/Loader';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { Separator } from '@/components/ui/separator';
import AnonymousSignIn from '../ui/AnonymousSignIn';

const SignInForm = () => {
  const router = useRouter();
  //const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signinSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    const { email, password } = values;

    try {
      supabase.auth
        .signInWithPassword({
          email: email,
          password: password,
        })
        .then(result => {
          if (!result.data?.user) {
            toast.error(' 😿 Invalid credentials, check email or password');
            setIsLoading(false);
            return;
          }

          setIsLoading(false);
          form.reset();
        });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(' 😿 Something must have gone wrong, Please try again');
    }

    return;
  }

  // Subscribe to the signin event from supabase to help redirect
  // to feed when user is authenticated
  useEffect(() => {
    // listen for sign in events from the server(supabase)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        toast.success(' 😸 Welcome to Xolace! Ready to explore! 🎭');
        router.push('/feed');
      }
    });

    // end subscription event
    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase, toast]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="z-10 w-full max-sm:p-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    type="email"
                    className="mb-4 w-full text-black dark:text-white max-sm:py-6 sm:py-5 md:h-12"
                    required
                    autoComplete="off"
                  />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Password input */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative mb-1 max-sm:mb-2">
                    <Input
                      placeholder="********"
                      {...field}
                      className="w-full text-black dark:text-white max-sm:py-6 sm:py-5 md:h-12"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-4 md:top-[-3] transform"
                    >
                      <ToggleEyeIcon showPassword={showPassword} />
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* checkbox*/}
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="relative mb-5 flex items-start justify-between px-2 max-sm:mb-8">
                <div className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="text-black dark:text-white">
                    <FormLabel>Remember me</FormLabel>
                  </div>
                </div>

                <Link
                  href="/forgot-password"
                  className="hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:active:text-primary-600 absolute -top-[6px] right-2 text-sm text-blue transition duration-150 ease-in-out dark:hover:text-primary-500 dark:focus:text-primary-500"
                >
                  Forgot password
                </Link>
              </FormItem>
            )}
          />

          {/* submit button */}
          <div className="px-8">
            <Button
              className="w-full btn-flat! hover:btn-flat-hover! active:btn-flat-active!"
              type="submit"
              aria-disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-x-2">
                  {' '}
                  <Loader /> <span>Loading...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
          </div>
          <p className="mb-0 mt-2 pt-1 text-sm font-semibold text-dark-3 dark:text-gray-500">
            Dont have an account?
            <Link
              href="/sign-up"
              className="ml-1 text-lavender-600 transition duration-150 ease-in-out hover:text-lavender-700 focus:text-lavender-600 active:text-lavender-700"
            >
              Register
            </Link>
          </p>
        </form>
      </Form>
      <div className="mt-3 flex items-center justify-center gap-3">
        <Separator />
        <p className="text-sm text-gray-600 dark:text-gray-400">OR</p>
        <Separator />
      </div>

      <AnonymousSignIn />
    </>
  );
};

export default SignInForm;
