"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdatePasswordSchema } from "@/validation";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";
import { useToast } from "../ui/use-toast";
import Loader from "../shared/loaders/Loader";
import ToggleEyeIcon from "../ui/ToggleEyeIcon";

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
      password: "",
      newPassword: "",
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
      console.error("User not found");
      return;
    }

    if (user.is_anonymous) {
      console.log("anonymous-> ", user.is_anonymous);
      toast({
        title: "Error updating password",
        description: "Anonymous users cannot update passwords",
        variant: "destructive",
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
        console.error("Old password is incorrect:", signInError.message);
        toast({
          title: "Old password is incorrect",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Old password is correct, now update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error("Error updating password:", updateError.message);
        toast({
          title: "Error updating password",
          description: updateError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
      });
      // Clear form , Log out the user and redirect to login page
      setIsLoading(false);
      form.reset();

      supabase.auth.signOut();
    }
  }

  return (
    <Form {...form}>
      <Card>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you&apos;ll be logged
              out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative md:w-1/2">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Current Password"
                        {...field}
                        className="w-full"
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
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative md:w-1/2">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New Password"
                        {...field}
                        className="w-full"
                      />
                      <ToggleEyeIcon
                        showPassword={showNewPassword}
                        setShowPassword={setShowNewPassword}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              disabled={isLoading}
              type="submit"
              className="flex gap-2 dark:bg-sky-400 dark:hover:bg-sky-300"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-x-2">
                  {" "}
                  <Loader /> <span>Saving...</span>
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
};

export default UpdatePasswordCardForm;
