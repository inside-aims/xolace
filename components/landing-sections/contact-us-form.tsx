"use client";

import { IconMail, IconMessage, IconUser } from "@tabler/icons-react";
import { motion } from "motion/react";
import Form from "next/form";
import { useActionState } from "react";
import { FormInput } from "@/components/shared/auth/form-input";
import { FormTextarea } from "@/components/shared/auth/form-textarea";
import { CtaButton } from "@/components/shared/cta-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {contactFormAction} from "@/lib/actions/auth";
import type {ContactFormState} from "@/lib/validation/landing";

// Could’t find what you were looking for under the faq
// Reach out - we’re here for you.
// Component

export default function ContactUsForm() {
  const [formState, formAction] = useActionState<ContactFormState, FormData>(
    contactFormAction,
    {
      values: {
        fullName: "",
        email: "",
        description: "",
      },
      errors: null,
      success: false,
    },
  );

  return (
    <motion.div
      initial={{ opacity: 0.2 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.2 }}
      transition={{ duration: 0.4 }}
      className="w-full"
      id={"faq"}
    >
      <Card className="w-full mx-auto p-0 m-0">
        <CardHeader className="bg-muted/50 px-6 md:px-12 py-4 border-b-2 border-border">
          <CardTitle>Still Need Help?</CardTitle>
          <CardDescription>
            Could’t find what you were looking for? Reach out - we’re here for
            you.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 md:px-12 pb-6">
          <Form action={formAction} id="contact-form">
            <FieldGroup>
              <FormInput
                id="fullName"
                name="fullName"
                type="text"
                label="Full Name"
                placeholder="John Doe"
                required
                defaultValue={formState.values?.fullName}
                leftAddon={
                  <IconUser className="size-4 text-muted-foreground" />
                }
                error={formState.errors?.fullName}
              />

              {/* Email */}
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                required
                defaultValue={formState.values?.email}
                leftAddon={
                  <IconMail className="size-4 text-muted-foreground" />
                }
                error={formState.errors?.email}
              />

              {/* Description */}
              <FormTextarea
                name="description"
                label="Description"
                required
                placeholder="Tell us more..."
                rows={5}
                leftAddon={
                  <IconMessage className="size-4 text-muted-foreground" />
                }
                error={formState.errors?.description}
              />
            </FieldGroup>
            <CtaButton
              label={"Send Message"}
              form="contact-form"
              type="submit"
              showArrow={false}
              className={"w-full mt-6"}
            />

            <Separator className="opacity-50" />

            {formState.success && (
              <p className="text-sm text-center">
                Message sent successfully. We’ll get back to you soon!
              </p>
            )}
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
