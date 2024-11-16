"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import ToggleEyeIcon from "../ui/ToggleEyeIcon";
import { signinSchema } from "@/validation";
import Loader from "../shared/Loader";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";
import { format } from "path";
import { Separator } from "@/components/ui/separator";
import AnonymousSignIn from "../ui/AnonymousSignIn";
import { FORM_TYPES } from "@/constants";

const SignInForm = ({ formType }: { formType: string }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();

  const isPasswordRecovery = formType === FORM_TYPES.PASSWORD_RECOVERY;
  const isPasswordLogin = formType === FORM_TYPES.PASSWORD_LOGIN;

  // 1. Define your form.
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signinSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    console.log(values);
    const { email, password } = values;

    try {
      supabase.auth
        .signInWithPassword({
          email: email,
          password: password,
        })
        .then((result) => {
          if (!result.data?.user) {
            toast({
              variant: "destructive",
              title: " 😿 Invalid credentials, check email or password",
            });
            setIsLoading(false);
            form.reset();
            return;
          }

          setIsLoading(false);
          form.reset();
        });
    } catch (error) {
      console.log(error);
    }

    return;
  }

  // Subscribe to the signin event from supabase to help redirect
  // to feed when user is authenticated
  useEffect(() => {
    // listen for sign in events from the server(supabase)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        toast({
          title: " 😸 Welcome to Xolace!",
        });
        router.push("/feed");
      }
    });

    // end subscription event
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" z-10  w-full max-sm:p-2"
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
                    className="w-full max-sm:py-6 sm:py-5 md:h-12 mb-4 text-black dark:text-white"
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
                  <div className=" relative max-sm:mb-2 mb-1">
                    <Input
                      placeholder="********"
                      {...field}
                      className="w-full max-sm:py-6 sm:py-5 md:h-12 text-black dark:text-white"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="off"
                    />
                    <ToggleEyeIcon
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
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
              <FormItem className="flex justify-between items-start px-2 max-sm:mb-8 mb-5  relative">
                <div className=" flex flex-row items-center space-x-2  ">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="  text-black dark:text-white">
                    <FormLabel>Remember me</FormLabel>
                  </div>
                </div>

                <Link
                  href="/forgot-password"
                  className=" absolute right-2 -top-[6px]  text-sm text-blue transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                >
                  Forgot password
                </Link>
              </FormItem>
            )}
          />

          {/* submit button */}
          <div className=" px-8">
            <Button
              className=" w-full dark:bg-sky-600 hover:dark:bg-sky-500"
              type="submit"
              aria-disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-x-2">
                  {" "}
                  <Loader /> <span>Loading...</span>
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
          <p className="mb-0 mt-2 pt-1 text-sm font-semibold text-dark-3 dark:text-gray-500">
            Dont have an account?
            <Link
              href="/sign-up"
              className=" text-red-600 transition duration-150 ease-in-out hover:text-red-600 focus:text-red-600 active:text-red-700 ml-1"
            >
              Register
            </Link>
          </p>
        </form>
      </Form>
      <div className="flex justify-center items-center gap-3 mt-3">
        <Separator />
        <p className="text-sm text-gray-600 dark:text-gray-400">OR</p>
        <Separator />
      </div>

      <AnonymousSignIn />
    </>
  );
};

export default SignInForm;
