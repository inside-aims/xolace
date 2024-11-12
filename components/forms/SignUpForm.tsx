"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

import Loader from "../shared/Loader";
import { urlPath } from "@/utils/url-helpers";

const male: "male" = "male";
const female: string = "female";
const SignUpForm = () => {
  const router = useRouter();

  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

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

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log(values);
    const { username, email, password, type } = values;
    toast({
      variant: "default",
      title: "�� Creating account and profile",
    });
  }
  // onSubmit={form.handleSubmit(onSubmit)}

  //
  const handleClick = () => {
    setLoading(true);
    toast({
      variant: "default",
      title: " ➰ Creating account and profile in a moment 🧐",
    });
  };

  return (
    <Form {...form}>
      <form
        method="POST"
        action={urlPath(`/auth/register?type=${gender}`)}
        className=" z-10  w-full max-sm:p-2 "
      >
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
                  className="w-full max-sm:py-6 md:h-12 mb-4 text-black dark:text-white"
                  required
                  autoComplete="off"
                />
              </FormControl>
              {/* <FormDescription >
              This is your public display name.
            </FormDescription> */}
              <FormMessage />
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
                  className="w-full max-sm:py-6 sm:py-5 md:h-12 mb-4 text-black dark:text-white"
                  required
                  autoComplete="off"
                />
              </FormControl>
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
                <div className=" relative mb-3 text-black dark:text-white">
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* gender radio field */}

        {username.length >= 5 && password.length >= 8 && (
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className=" space-y-2 mb-2">
                <FormLabel>Select your gender...</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => setGender(value)}
                    defaultValue={gender}
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
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Terms & conditions */}
        <div className=" flex flex-col  items-start md:flex-row md:justify-between md:items-center mb-7">
          <TermsConditions />

          {/* checkbox*/}
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className=" space-x-4 space-y-1 leading-none">
                  <FormLabel className="text-dark-3 dark:text-white">
                    Agree Terms and Conditions
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* submit button */}
        <div className=" px-8">
          <Button
            disabled={!terms}
            className=" w-full dark:bg-sky-600 hover:dark:bg-sky-500"
            type="submit"
            onClick={handleClick}
          >
            {loading ? (
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
