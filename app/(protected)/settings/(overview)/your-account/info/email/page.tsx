'use client';

import { SettingsNavigationWrapper } from "@/components/settings/settings-navigation";
import SettingsWrapper from "@/components/settings/settings-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserState } from "@/lib/store/user";

export default function EmailPage() {
  return (
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <EmailContent />
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <EmailContent />
        </SettingsWrapper>
      </div>
    </>
  );
}

function EmailContent() {
// Get user profile data
const user = useUserState(state => state.user);

  // Handle form validations
  const FormSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
  });

  // Form initial values
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  // handle submission
  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SettingsNavigationWrapper title={"Change email"}>
      <div className={"w-full flex flex-col items-start"}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <FormField control={form.control} name="email"
              render={({ field }) => (
                <FormItem className={'flex flex-col px-4 pb-4'}>
                  <FormLabel>Current email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email"{...field} required className={"py-6"}
                      disabled/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={"flex items-center justify-center border-t px-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-900"}>Update email address</div>
          </form>
        </Form>
      </div>
    </SettingsNavigationWrapper>
  );
}
