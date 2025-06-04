'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import mascot from '../../public/assets/images/mas.webp';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
//import { useToast } from '../ui/use-toast';
import { toast } from 'sonner';
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
import Image from 'next/image';

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
          localStorage.setItem('welcomePopupDismissed', 'true');
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
    } = supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_IN') {
        toast.success(' 😸 Welcome to Xolace! Ready to explore! 🎭');
        router.push('/feed');
      }
    });

    // end subscription event
    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 p-4">
      <div className="flex md:hidden">
        <Image
          src={mascot}
          alt="logo"
          width={60}
          height={60}
          priority={true}
          loading="eager"
        />
      </div>
      <div className="w-full max-w-md items-start">
        <h2 className="text-4xl font-bold sm:text-5xl">Holla 👋,</h2>
        <h2 className="text-4xl font-bold sm:text-5xl">Welcome Back</h2>
      </div>

      <div className="w-full max-w-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <div className={'flex w-full flex-col gap-4'}>
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        type="email"
                        className="rounded-lg px-4"
                        autoComplete="off"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your password"
                          {...field}
                          className="items-center rounded-lg px-4"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="off"
                          required
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Forgot Password Link */}
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className={'h-4 w-4 rounded-none'}
                        />
                      </FormControl>
                      <FormLabel className="mb-1 items-center text-sm">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Link
                  href={'/forgot-password'}
                  className="text-lavender-400 text-sm hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-ocean-500 hover:bg-ocean-600 w-full transform rounded-lg transition-transform duration-300 ease-in-out hover:scale-[1.03]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader />
                  <span>Loading...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* OR Divider */}
            <div className="flex items-center justify-center gap-3">
              <Separator className="flex-1 bg-black" />
              <span className="text-sm">OR</span>
              <Separator className="flex-1 bg-black" />
            </div>

            <AnonymousSignIn />

            {/* Register Redirect */}
            <p className="text-center text-sm md:text-left">
              Don’t have an account?{' '}
              <Link
                href={'/sign-up'}
                className="text-lavender-400 hover:text-lavender-500 ml-1 font-medium hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignInForm;
