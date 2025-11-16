'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import mascot from '../../public/assets/images/mas.webp';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import {FormInput} from "@/components/forms/FormInput";
import {FormCheckbox} from "@/components/forms/FormCheckbox";
import {AuthRedirect} from "@/components/forms/AuthRedirect";

const CookieInstructionsModal = dynamic(() => import('../extras/CookieInstructionModal'), { ssr: false });
const CookieAlert = dynamic(() => import('../extras/CookieAlert'), { ssr: false });
const LearnWhyModal = dynamic(() => import('../extras/LearnWhyModal'), { ssr: false });

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nexturl = searchParams.get('nexturl');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCookieAlert, setShowCookieAlert] = useState(true);
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [showLearnWhyModal, setShowLearnWhyModal] = useState(false);
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

    } catch (_) {
      toast.error(' 😿 Something must have gone wrong, Please try again');
    }

    return;
  }

  // Subscribe to the signin event from supabase to help redirect
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_IN') {
        toast.success(' 😸 Welcome to Xolace! Ready to explore! 🎭');
        if (nexturl) {
          router.push(nexturl);
        } else {
          router.push('/feed');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase, nexturl]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 p-4">
      <div className="flex md:hidden">
        <Image
          src={mascot}
          alt="logo"
          width={60}
          height={60}
          priority={true}
          className="h-auto w-auto"
        />
      </div>

      <div className="w-full max-w-md items-start">
        <div className="flex items-center gap-2">
          <h2 className="text-4xl font-bold sm:text-5xl">Holla 👋,</h2>
        </div>
        <h2 className="text-4xl font-bold sm:text-5xl">Welcome Back</h2>
      </div>

      <div className="w-full max-w-md">
        {/* Cookie Alert - positioned after header but before form */}
        {showCookieAlert && (
          <CookieAlert
            onDismiss={() => setShowCookieAlert(false)}
            onSeeHow={() => setShowCookieModal(true)}
            onLearnWhy={() => setShowLearnWhyModal(true)}
          />
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className={'flex w-full flex-col gap-4'}>
              {/* Email Field */}
              <FormInput
                control={form.control}
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
              />

              {/*Password field*/}
              <FormInput
                control={form.control}
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                info="Min 8 chars, 1 uppercase & 1 number"
              />

              {/* Forgot Password Link */}
              <div className="flex items-center justify-between">
                <FormCheckbox
                  control={form.control}
                  name="remember"
                  label="Remember me"
                  shape="rounded"
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
              <Separator className="flex-1 bg-black dark:bg-gray-600" />
              <span className="text-sm">OR</span>
              <Separator className="flex-1 bg-black dark:bg-gray-600" />
            </div>

            <AnonymousSignIn />

            {/* Register Redirect */}
            <AuthRedirect
              text="Don’t have an account?"
              linkText="Create one"
              href="/sign-up"
              nexturl={nexturl}
            />
          </form>
        </Form>
      </div>

      {/* Cookie Instructions Modal */}
      <CookieInstructionsModal
        isOpen={showCookieModal}
        onClose={() => setShowCookieModal(false)}
      />

      {/* Learn Why Modal */}
      <LearnWhyModal
        isOpen={showLearnWhyModal}
        onClose={() => setShowLearnWhyModal(false)}
        onProceedToInstructions={() => {
          setShowLearnWhyModal(false);
          setShowCookieModal(true);
        }}
      />
    </div>
  );
};

export default SignInForm;