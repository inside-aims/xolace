"use client";

import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export interface FormInputProps
  extends Omit<React.ComponentProps<typeof InputGroupInput>, "type"> {
  /**
   * The label for the input field
   */
  label?: string;
  /**
   * The description text shown below the input
   */
  description?: string;
  /**
   * Error message(s) to display
   */
  error?: string | string[];
  /**
   * Content to display on the left side of the input (inline-start)
   */
  leftAddon?: React.ReactNode;
  /**
   * Content to display on the right side of the input (inline-end)
   */
  rightAddon?: React.ReactNode;
  /**
   * The input type (text, email, password, etc.)
   */
  type?: React.HTMLInputTypeAttribute;
  /**
   * Whether this is a password field with toggle visibility
   */
  enablePasswordToggle?: boolean;
  /**
   * Custom class name for the Field wrapper
   */
  fieldClassName?: string;
  /**
   * Custom class name for the InputGroup
   */
  inputGroupClassName?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * The ID of the input field
   */
  showForgotPasswordLink?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      description,
      error,
      leftAddon,
      rightAddon,
      type = "text",
      enablePasswordToggle = false,
      fieldClassName,
      inputGroupClassName,
      required = false,
      id,
      name,
      className,
      showForgotPasswordLink = false,
      ...props
    },
    ref,
  ) => {
    const useId = React.useId();
    const [showPassword, setShowPassword] = React.useState(false);
    const hasError = !!error;
    const errorArray = Array.isArray(error) ? error : error ? [error] : [];

    // Generate a unique ID if not provided
    const inputId = id || name || useId;

    // Determine the actual input type
    const inputType =
      type === "password" && enablePasswordToggle
        ? showPassword
          ? "text"
          : "password"
        : type;

    return (
      <Field className={fieldClassName} data-invalid={hasError}>
        <div
          className={cn(
            "",
            showForgotPasswordLink && "flex items-center justify-between",
          )}
        >
          {label && (
            <FieldLabel htmlFor={inputId}>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FieldLabel>
          )}

          {showForgotPasswordLink && (
            <Link
              href="/forgot-password"
              className="text-muted-foreground opacity-70 hover:opacity-100 text-xs hover:underline transition-all ease-in-out leading-none"
            >
              Forgot password?
            </Link>
          )}
        </div>

        <InputGroup className={inputGroupClassName}>
          {/* Left Addon */}
          {leftAddon && (
            <InputGroupAddon align="inline-start">{leftAddon}</InputGroupAddon>
          )}

          {/* Input Field */}
          <InputGroupInput
            ref={ref}
            id={inputId}
            name={name}
            type={inputType}
            aria-invalid={hasError}
            aria-describedby={
              description || hasError
                ? `${inputId}-description ${inputId}-error`
                : undefined
            }
            className={className}
            {...props}
          />

          {/* Right Addon or Password Toggle */}
          {(rightAddon || (type === "password" && enablePasswordToggle)) && (
            <InputGroupAddon align="inline-end">
              {rightAddon}
              {type === "password" && enablePasswordToggle && (
                <InputGroupButton
                  size="icon-xs"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  type="button"
                >
                  {showPassword ? (
                    <IconEyeOff className="size-4" />
                  ) : (
                    <IconEye className="size-4" />
                  )}
                </InputGroupButton>
              )}
            </InputGroupAddon>
          )}
        </InputGroup>

        {/* Description */}
        {description && (
          <FieldDescription id={`${inputId}-description`}>
            {description}
          </FieldDescription>
        )}

        {/* Error Messages */}
        {hasError && (
          <FieldError id={`${inputId}-error`}>
            {errorArray.length === 1 ? (
              errorArray[0]
            ) : (
              <ul className="ml-4 flex list-disc flex-col gap-1">
                {errorArray.map((err, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: let's use index for now
                  <li key={index}>{err}</li>
                ))}
              </ul>
            )}
          </FieldError>
        )}
      </Field>
    );
  },
);

FormInput.displayName = "FormInput";
