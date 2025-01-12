/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  type: string;
}

export type ActionState = {
  message?: string;
  success?: boolean;
  errors?: {
    [K in keyof SignupFormData]?: string[];
  };
  [key: string]: any; // This allows for additional properties
};

type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData,
) => Promise<T>;

export function validatedAction<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>,
) {
  return async (prevState: ActionState, formData: FormData): Promise<T> => {
    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return {
        message: 'Please fix the errors in the form',
        errors: result.error.flatten().fieldErrors,
      } as T;
    }

    return action(result.data, formData);
  };
}
