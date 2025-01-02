"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { TermsConditions } from "../shared/TermsConditions";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import ToggleEyeIcon from "../ui/ToggleEyeIcon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { signUpSchema } from "@/validation";
import { signUpAction } from "@/app/actions";
import { ActionState } from "@/lib/auth/middleware";

import Loader from "../shared/loaders/Loader";
import { FormMessage as SubmitFormMessage } from "../shared/form-message";

const male: "male" = "male";
const female: string = "female";
const emailRegex = /^\S+@\S+$/;

const SignUpForm = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signUpAction,
    { success: false, message: "" }
  );

  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      terms: false,
    },
  });

  //   listen for changes in form input
  const { watch } = form;
  const [username, password, terms, email] = watch([
    "username",
    "password",
    "terms",
    "email",
  ]);

  //
  const handleClick = () => {
    if (
      username.length >= 2 &&
      password.length >= 8 &&
      emailRegex.test(email)
    ) {
      toast({
        variant: "default",
        title: " ➰ Creating account and profile in a moment 🧐",
      });
    }
  };

  // error message
  const errorMessage = {
    error: state?.message || "",
  };

  return (
    <Form {...form}>
      <form action={formAction} className=" z-10  w-full max-sm:p-2 ">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="username"
                  {...field}
                  type="text"
                  className="w-full max-sm:py-6 md:h-12  text-black dark:text-white"
                  required
                  min={2}
                  max={12}
                  autoComplete="off"
                />
              </FormControl>
              <FormDescription className="text-[12px]">
                <span className=" text-amber-400 font-semibold"> NB: </span>{" "}
                Avoid using an identifiable username
              </FormDescription>
              {state?.errors?.username && (
                <div className="text-red-500 text-sm">
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
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email"
                  {...field}
                  type="email"
                  className="w-full max-sm:py-6 sm:py-5 md:h-12 mb-4 mt-2 text-black dark:text-white"
                  required
                  autoComplete="off"
                />
              </FormControl>
              {state?.errors?.email && (
                <div className="text-red-500 text-sm">
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
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className=" relative text-black dark:text-white">
                  <Input
                    placeholder="********"
                    {...field}
                    className="w-full max-sm:py-6 sm:py-5 md:h-12"
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
              <FormDescription className="text-[12px]">
                <span className="">Tip: </span>
                Minimum 8 characters, atleast 1 uppercase, 1 number
              </FormDescription>
              {state?.errors?.password && (
                <div className="text-red-500 text-sm">
                  {state.errors.password[0]}
                </div>
              )}
            </FormItem>
          )}
        />

        {/* gender radio field */}

        {username.length >= 2 && password.length >= 8 && (
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className=" space-y-2 mb-2 mt-2">
                <FormLabel>Select your gender...</FormLabel>
                <FormControl>
                  <RadioGroup
                    {...field}
                    value={field.value} // Bind value from React Hook Form
                    onValueChange={field.onChange} // Update value in React Hook Form
                    className="flex justify-around items-center"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value="male"
                          userGender={true}
                          genderType={male}
                          className=" bg-blue4 shadow-[0_2px_10px] shadow-blue7 hover:bg-blue3 focus:shadow-[0_0_0_2px] focus:shadow-black"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value="female"
                          userGender={true}
                          genderType="female"
                          className=" bg-crimson5 shadow-[0_2px_10px] shadow-crimson7 hover:bg-crimson3 focus:shadow-[0_0_0_2px] focus:shadow-black"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                {state?.errors?.type && (
                  <div className="text-red-500 text-sm">
                    {state.errors.type[0]}
                  </div>
                )}
              </FormItem>
            )}
          />
        )}

        {/* Terms & conditions */}
        <div className=" flex items-start  mb-2 mt-3">
          {/* checkbox*/}
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className=" space-x-4 space-y-1 leading-none">
                  <FormLabel className="text-dark-3 dark:text-white">
                    I agree <TermsConditions />
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {state?.message && <SubmitFormMessage message={errorMessage} />}

        {/* submit button */}
        <div className=" px-8 mt-5">
          <Button
            disabled={!terms || pending}
            className=" w-full bg-gradient-to-r from-sky-600 to-sky-400 font-semibold hover:from-sky-500 hover:to-sky-300"
            type="submit"
            onClick={handleClick}
          >
            {pending ? (
              <div className="flex items-center justify-center gap-x-2">
                {" "}
                <Loader /> <span>Loading...</span>
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </div>

        <p className="mb-0 mt-2 pt-1 text-sm font-semibold text-dark-4">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className=" text-red-600 transition duration-150 ease-in-out hover:text-red-600 focus:text-red-600 active:text-red-700"
          >
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignUpForm;
