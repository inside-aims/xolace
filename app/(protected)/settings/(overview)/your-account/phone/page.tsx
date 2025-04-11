'use client';

import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import SettingsWrapper from "@/components/settings/settings-wrapper";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export default function PhonePage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <PhoneContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <PhoneContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function PhoneContent() {
  // Schema form validations
  const FormSchema = z.object({
    phoneNumber: z.string()
      .min(10, { message: "Phone number must be at least 10 digits." })
      .regex(/^\+?[0-9]{10,15}$/, {
        message: "Please enter a valid phone number",
      }),
  });

  // Form initial values
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phoneNumber: "+233559286073",
    },
  });

  // Handle form submission
  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SettingsNavigationWrapper title={"Change phone number"}>
      <div className={"w-full flex flex-col items-start"}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className={"flex flex-col px-4 pb-4"}>
                  <FormLabel>Current phone number (:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone number"
                      {...field}
                      required
                      className={"py-6"}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={"flex items-center justify-center border-t px-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-900"}>
              Update phone number
            </div>
          </form>
        </Form>
      </div>
    </SettingsNavigationWrapper>
  );
}
