"use client";

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

export default function UpdateUsernameCardForm() {
  const form = useForm<z.infer<typeof UpdateUsernameSchema>>({
    resolver: zodResolver(UpdateUsernameSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(data: z.infer<typeof UpdateUsernameSchema>) {
    console.log(data);
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
            <Button type="submit">Save</Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}
