"use client";

import {Control, FieldPath, FieldValues, useController} from "react-hook-form";
import {Checkbox} from "@/components/ui/checkbox";
import {FormItem, FormLabel, FormMessage} from "@/components/ui/form";

type CheckboxShape = "square" | "rounded";

interface FormCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string | React.ReactNode;
  shape?: CheckboxShape;
  className?: string;
}

export function FormCheckbox<T extends FieldValues>(
  {
    control,
    name,
    label,
    shape = "square",
    className,
  }: FormCheckboxProps<T>) {
  const {field, fieldState} = useController({control, name});

  return (
    <FormItem className={`flex items-center gap-2 ${className ?? ""}`}>
      <Checkbox
        checked={field.value}
        onCheckedChange={field.onChange}
        className={`w-4 h-4 flex-shrink-0 self-center ${
          shape === "rounded" ? "rounded-full" : "rounded-none"
        }`}
      />

      <FormLabel className="mb-1.5 text-sm leading-none select-none cursor-pointer">
        {label}
      </FormLabel>

      {fieldState.error && (
        <FormMessage>{fieldState.error.message}</FormMessage>
      )}
    </FormItem>
  );

}
