"use server";

import {ContactFormState, contactSchema} from "@/lib/validation";

export async function contactFormAction(
  _prev: ContactFormState,
  formData: FormData,
) {
  const values = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    description: formData.get("description") as string,
  };

  const result = contactSchema.safeParse(values);

  if (!result.success) {
    return {
      values,
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Do something with the values.
  // Call your database or API here.

  return {
    values: {
      fullName: "",
      email: "",
      subject: "",
      description: "",
    },
    errors: null,
    success: true,
  };
}
