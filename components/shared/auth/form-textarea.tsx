"use client";

import { nanoid } from "nanoid";
import * as React from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export interface FormTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "type"> {
  label?: string;
  description?: string;
  error?: string | string[];
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  fieldClassName?: string;
  inputGroupClassName?: string;
  required?: boolean;
  showForgotPasswordLink?: boolean;
}

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(
  (
    {
      label,
      description,
      error,
      leftAddon,
      rightAddon,
      fieldClassName,
      inputGroupClassName,
      required = false,
      id,
      name,
      className,
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const useId = React.useId();
    const hasError = !!error;
    const errorArray = Array.isArray(error) ? error : error ? [error] : [];

    const inputId = id || name || useId;

    return (
      <Field className={fieldClassName} data-invalid={hasError}>
        {/* Label */}
        {label && (
          <FieldLabel htmlFor={inputId}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FieldLabel>
        )}

        <InputGroup className={cn("items-start", inputGroupClassName)}>
          {/* Left Addon */}
          {leftAddon && (
            <InputGroupAddon align="inline-start" className="pt-2">
              {leftAddon}
            </InputGroupAddon>
          )}

          {/* Textarea */}
          <textarea
            ref={ref}
            id={inputId}
            name={name}
            aria-invalid={hasError}
            aria-describedby={
              description || hasError
                ? `${inputId}-description ${inputId}-error`
                : undefined
            }
            className={cn(
              "flex-1 resize-none bg-transparent outline-none px-3 py-2 text-sm",
              className,
            )}
            rows={rows}
            {...props}
          />

          {/* Right Addon */}
          {rightAddon && (
            <InputGroupAddon align="inline-end" className="pt-2">
              {rightAddon}
            </InputGroupAddon>
          )}
        </InputGroup>

        {/* Description */}
        {description && (
          <FieldDescription id={`${inputId}-description`}>
            {description}
          </FieldDescription>
        )}

        {/* Errors */}
        {hasError && (
          <FieldError id={`${inputId}-error`}>
            {errorArray.length === 1 ? (
              errorArray[0]
            ) : (
              <ul className="ml-4 flex list-disc flex-col gap-1">
                {errorArray.map((err) => (
                  <li key={`${err}-${nanoid()}`}>{err}</li>
                ))}
              </ul>
            )}
          </FieldError>
        )}
      </Field>
    );
  },
);

FormTextarea.displayName = "FormTextarea";
