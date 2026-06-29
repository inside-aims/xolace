import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long." }),
});

export type ContactFormState = {
  values?: z.infer<typeof contactSchema>;
  errors: null | Partial<Record<keyof z.infer<typeof contactSchema>, string[]>>;
  success: boolean;
};
