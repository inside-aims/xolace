'use client';

import SettingsWrapper from "@/components/settings/settings-wrapper";
import { SettingsNavigationWrapper } from "@/components/settings/settings-navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { z } from "zod";

export default function PasswordPage() {
  return (
    <>
      <div className="w-full flex items-start flex-col md:hidden">
        <PasswordContent />
      </div>
      <div className="hidden md:flex items-center flex-col">
        <SettingsWrapper>
          <PasswordContent />
        </SettingsWrapper>
      </div>
    </>
  );
}

function PasswordContent() {
  // Form schema validations
  const FormSchema = z.object({
    currentPassword: z.string().min(5, {
      message: "Current password must be at least 5 characters.",
    }),
    newPassword: z.string().min(5, {
      message: "New password must be at least 5 characters.",
    }),
    confirmNewPassword: z.string().min(5, {
      message: "Please confirm your new password with at least 5 characters.",
    }),
  });

  // Form initial values
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SettingsNavigationWrapper title="Change Password">
      <div className="w-full flex flex-col items-start">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            {/* Current Password */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col px-4 pb-4">
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      {...field}
                      required
                      className="py-6 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4 w-full flex flex-col items-start gap-4 border-t px-4 py-6">
              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col pb-4 w-full">
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        {...field}
                        required
                        className="py-6 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm New Password */}
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col pb-4 w-full">
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Re-enter new password"
                        {...field}
                        required
                        className="py-6 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Info Notice */}
            <div className="flex border-t px-4 py-6 text-neutral-500 text-sm">
              Changing your password will log you out of all active sessions except the
              one you’re using now. Applications connected to your account will remain
              unaffected.
            </div>

            {/* Submit Button */}
            <div className="flex justify-end border-t px-4 py-6">
              <Button type="submit" className="rounded-full px-8">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </SettingsNavigationWrapper>
  );
}
