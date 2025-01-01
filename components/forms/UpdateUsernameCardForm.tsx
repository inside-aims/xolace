"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UpdateUsernameSchema } from "@/validation";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";
import { useUserState } from "@/lib/store/user";
import { useToast } from "../ui/use-toast";
import Loader from "../shared/loaders/Loader";

export default function UpdateUsernameCardForm() {
  // get user profile data
  const user = useUserState((state) => state.user);

  // initialize supabase client
  const supabase = getSupabaseBrowserClient();

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // destructure toast function
  const { toast } = useToast();

  // initialize form state
  const form = useForm<z.infer<typeof UpdateUsernameSchema>>({
    resolver: zodResolver(UpdateUsernameSchema),
    defaultValues: {
      username: "",
    },
  });

  // funtion to update username
  async function onSubmit(data: z.infer<typeof UpdateUsernameSchema>) {
    setIsLoading(true);
    const { username } = data;

    // update username in profiles table
    const { data: newUser, error: updateError } = await supabase
      .from("profiles")
      .update({
        username,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating username:", updateError);
      toast({
        title: "Error updating username",
        description:
          "Oops🫢!!, Something must have gone wrong or you are probably an anonymous user🤔",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    console.log("new ->" + JSON.stringify(newUser, null, 2));

    toast({
      title: "Username updated successfully",
      description: "Go showcase your new username by posting😃!!",
    });
    setIsLoading(false);
    form.reset();
  }

  return (
    <Form {...form}>
      <Card>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <CardHeader>
            <CardTitle>Username</CardTitle>
            <CardDescription>Change your username here.</CardDescription>
          </CardHeader>

          <CardContent className="">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      className=" md:w-1/2 "
                    />
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
              className="flex gap-x-2 dark:bg-sky-400 dark:hover:bg-sky-300 "
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-x-2">
                  {" "}
                  <Loader /> <span>Updating...</span>
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
}
