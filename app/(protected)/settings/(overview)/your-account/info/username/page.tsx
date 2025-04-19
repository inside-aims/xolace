'use client';

import SettingsWrapper from "@/components/settings/settings-wrapper";
import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem, FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { z } from "zod"


export default function UsernamePage() {
  return(
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <UsernameContent/>
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <UsernameContent/>
        </SettingsWrapper>
      </div>
    </>
  )
}

function UsernameContent() {
  // Schema validation
  const FormSchema = z.object({
    username: z.string().min(5, {
      message: "Username must be at least 5 characters.",
    }),
  });
  // Initial values
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "F E D E J N R",
    },
  });
  // Handle form submission
  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log(data)
    } catch(error) {
      console.log(error)
    }
  }

  return(
    <SettingsNavigationWrapper title={"Change username"}>
      <div className={"w-full flex flex-col items-start"}>
        <Form {...form}>
          <form  onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <FormField control={form.control} name="username"
              render={({ field }) => (
                <FormItem className={'flex flex-col px-4 pb-4'}>
                  <FormLabel>Current username (:</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} required className={"py-6"}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={"mt-4 flex flex-col items-start gap-4 border-t px-4 py-6"}>
              <h5 className={"text-lg font-semibold"}>Suggestions</h5>
              <span>Federico</span>
              <span>Fede</span>
              <span>FedeDeJnr</span>
            </div>
            <div className={"flex justify-end border-t px-4 py-6"}>
              <Button type="submit" className={"bg-blue9 hover:bg-blue10 font-semibold text-white rounded-full px-8"}>Save</Button>
            </div>
          </form>
        </Form>
      </div>
    </SettingsNavigationWrapper>
  )
}