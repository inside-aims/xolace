import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .refine(
      (value) => {
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        if (!hasUppercase || !hasNumber) {
          return false;
        }
        return true;
      },
      {
        message:
          "Password must contain at least one uppercase letter and one number.",
      }
    ),
  remember: z.boolean().default(false).optional(),
});

export const signUpSchema = z.object({
  username: z.string().min(5, {
    message: "Username must be at least 5 characters.",
  }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .refine(
      (value) => {
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        if (!hasUppercase || !hasNumber) {
          return false;
        }
        return true;
      },
      {
        message:
          "Password must contain at least one uppercase letter and one number.",
      }
    ),
  terms: z.boolean().default(false).optional(),
  type: z.enum(["male", "female"], {
    required_error: "You need to select a gender type.",
  }),
});
