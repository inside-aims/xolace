import { z } from 'zod';

export const signinSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .refine(
      value => {
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        if (!hasUppercase || !hasNumber) {
          return false;
        }
        return true;
      },
      {
        message:
          'Password must contain at least one uppercase letter and one number.',
      },
    ),
  remember: z.boolean().default(false).optional(),
});

export const signUpSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .refine(
      value => {
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        if (!hasUppercase || !hasNumber) {
          return false;
        }
        return true;
      },
      {
        message:
          'Password must contain at least one uppercase letter and one number.',
      },
    ),
  terms: z.boolean().default(false).optional(),
  type: z.enum(['male', 'female'], {
    required_error: 'You need to select a gender type.',
  }),
});

export const PostSchema = z.object({
  content: z
    .string(),
  is24HourPost: z.boolean(),
  type: z.enum(["single", "carousel"])
})


// Validation schema for comment form
export const CommentSchema = z.object({
  comment: z
    .string()
    .min(1, {
      message: 'Reply must be at least 1 characters.',
    })
    .max(300, {
      message: 'Reply must not be longer than 200 characters.',
    }),
});

export const UpdatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .refine(
      value => {
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        if (!hasUppercase || !hasNumber) {
          return false;
        }
        return true;
      },
      {
        message:
          'Password must contain at least one uppercase letter and one number.',
      },
    ),

  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .refine(
      value => {
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        if (!hasUppercase || !hasNumber) {
          return false;
        }
        return true;
      },
      {
        message:
          'Password must contain at least one uppercase letter and one number.',
      },
    ),
});

export const SettingsPasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .refine(
        value => {
          const hasUppercase = /[A-Z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          if (!hasUppercase || !hasNumber) {
            return false;
          }
          return true;
        },
        {
          message:
            'Password must contain at least one uppercase letter and one number.',
        },
      ),

    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .refine(
        value => {
          const hasUppercase = /[A-Z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          if (!hasUppercase || !hasNumber) {
            return false;
          }
          return true;
        },
        {
          message:
            'Password must contain at least one uppercase letter and one number.',
        },
      ),

    confirmNewPassword: z
      .string()
      .min(8, {
        message: 'Please confirm your new password with at least 8 characters.',
      })
      .refine(
        value => {
          const hasUppercase = /[A-Z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          if (!hasUppercase || !hasNumber) {
            return false;
          }
          return true;
        },
        {
          message:
            'Confirm Password must contain at least one uppercase letter and one number.',
        },
      ),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ['confirmNewPassword'], // path of error
  });

export const UpdateUsernameSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(16, {
      message: 'Username must not be longer than 16 characters.',
    }),
});


export const AddHealthTipsSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title is required." })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  content: z.string().min(1, { message: "Body is required" }),
  tags: z
    .array(z.string().min(1, { message: "Tag is required" }))
    .max(30, { message: "Tag cannot exceed 30 characters." })
    .min(1, { message: "At least one tag is required" })
    .max(3, { message: "Cannot add more than 3" }),
});