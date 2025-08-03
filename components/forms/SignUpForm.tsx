'use client';

import React, { useState, useActionState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { TermsConditions } from '../shared/TermsConditions';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import ToggleEyeIcon from '../ui/ToggleEyeIcon';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
//import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import { signUpSchema } from '@/validation';
import { signUpAction } from '@/app/actions';
import { ActionState } from '@/lib/auth/middleware';

import Loader from '../shared/loaders/Loader';
import { FormMessage as SubmitFormMessage } from '../shared/form-message';
import Image from "next/image";
import mascot from "@/public/assets/images/mas.webp";

const male = 'male' as const;
const female = 'female' as const;
const emailRegex = /^\S+@\S+$/;

const SignUpForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams();
    const nexturl = searchParams.get('nexturl');
  const toastIdRef = useRef<string | number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signUpAction,
    { success: false, message: '' },
  );

  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      terms: false,
    },
  });

  //   listen for changes in form input
  const { watch } = form;
  const [username, password, terms, email] = watch([
    'username',
    'password',
    'terms',
    'email',
  ]);

  //
  const handleClick = () => {
    if (
      username.length >= 2 &&
      password.length >= 8 &&
      emailRegex.test(email)
    ) {
      const toastId = toast('Signup');
      toastIdRef.current = toastId;
      toast.loading(' ➰ Creating account and profile in a moment 🧐', { id: toastIdRef.current });
    }
  };

  useEffect(() => {
    if (!toastIdRef.current || !state.message) return;

    if (state.success) {
      // Handle success
      toast.success(state.message, {
        id: toastIdRef.current,
      });
      // Redirect after a short delay for better UX
      if (state.redirectUrl) {
        setTimeout(() => {
          router.push(state.redirectUrl as string);
        }, 1500); // 1.5 second delay
      }
    } else {
      // Handle error
      toast.error(state.message, {
        id: toastIdRef.current,
      });
    }

    // Clear the ref after handling the toast to prevent re-firing
    toastIdRef.current = null;
    
  }, [state, router]);

  // error message
  const errorMessage = {
    error: state?.message || '',
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-8 p-4">
      <div className="flex md:hidden">
        <Image
          src={mascot}
          alt="logo"
          width={60}
          height={60}
          priority={true}
          className="w-auto h-auto"
        />
      </div>
      <div className="w-full max-w-md items-start">
        <h2 className="text-4xl sm:text-5xl font-bold">Register Here</h2>
      </div>

      <div className="w-full max-w-md">
        <Form {...form}>
          <form
            action={formAction}
            className="flex flex-col gap-8">
            <div className={"w-full flex flex-col gap-4"}>
              {/* username */}
              <FormField
                control={form.control}
                name="username"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="w-full rounded-lg"
                        required
                        min={2}
                        max={12}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-neutral-400">
                      Tip: Pick a unique name - Definitely not the name your mom gave you
                    </FormDescription>

                    {state?.errors?.username && (
                      <div className="text-sm text-red-500">
                        {state.errors.username[0]}
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {/* Email input */}
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="w-full rounded-lg"
                        required
                        autoComplete="off"
                      />
                    </FormControl>
                    {state?.errors?.email && (
                      <div className="text-sm text-red-500">
                        {state.errors.email[0]}
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {/* Password input */}
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
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
                          className="absolute right-3 top-[10] md:top-[-5] text-neutral-400"
                        >
                          <ToggleEyeIcon showPassword={showPassword}/>
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription className="text-sm text-neutral-400">
                      Tip: Min 8 chars,at least 1 uppercase & 1 number.
                    </FormDescription>

                    {state?.errors?.password && (
                      <div className="text-sm text-red-500">
                        {state.errors.password[0]}
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {username.length >= 2 && password.length >= 8 && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({field}) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Select your gender...</FormLabel>
                      <FormControl>
                        <RadioGroup
                          {...field}
                          value={field.value} // Bind value from React Hook Form
                          onValueChange={field.onChange} // Update value in React Hook Form
                          className="flex items-center flex-row gap-12"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value="male"
                                userGender={true}
                                genderType={male}
                                className="w-4 h-4 bg-blue4 shadow-[0_2px_10px] shadow-blue7 hover:bg-blue3 focus:shadow-[0_0_0_2px] focus:shadow-black"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value="female"
                                userGender={true}
                                genderType={female}
                                className="w-4 h-4 bg-crimson5 shadow-[0_2px_10px] shadow-crimson7 hover:bg-crimson3 focus:shadow-[0_0_0_2px] focus:shadow-black"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Female</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      {state?.errors?.type && (
                        <div className="text-sm text-red-500">
                          {state.errors.type[0]}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              )}

              {/* Terms & conditions */}
              <FormField
                control={form.control}
                name="terms"
                render={({field}) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-x-4 space-y-1 leading-none">
                      <FormLabel className="">
                        I’ve read and agree to the <TermsConditions />
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {state?.message && !state?.success && <SubmitFormMessage message={errorMessage}/>}
            </div>

            {/* submit button */}
            <div className="">
              <Button
                disabled={!terms || pending}
                className={!terms || pending ? `bg-ocean-100 text-ocean-400 w-full` : `rounded-lg bg-ocean-500 hover:bg-ocean-600 transition-transform transform hover:scale-[1.03] duration-300 ease-in-out w-full`}
                type="submit"
                onClick={handleClick}
              >
                {pending ? (
                  <div className="flex items-center justify-center gap-x-2">
                    {' '}
                    <Loader/> <span>Loading...</span>
                  </div>
                ) : (
                  'Register'
                )}
              </Button>
            </div>

            {/*Already existing user - login*/}
            <p className="text-sm text-center md:text-left">
              Already registered?{' '}
              <Link
                href={nexturl ? `/sign-in?nexturl=${nexturl}` : '/sign-in'}
                className="font-semibold ml-1 text-lavender-500 hover:text-lavender-600 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUpForm;
