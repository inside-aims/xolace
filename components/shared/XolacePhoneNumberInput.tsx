'use client'

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form'
import { FieldValues, FieldPath, Control } from 'react-hook-form'

interface XolacePhoneNumberInput<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  placeholder?: string
  autoComplete?: string
  disabled?: boolean
}

export function XolacePhoneNumberInput<T extends FieldValues>({control, name, label, placeholder, autoComplete = 'off', disabled = false}: XolacePhoneNumberInput<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="text-slate-600">{label}</FormLabel>
          <FormControl>
            <div className={"m-0"}>
              <PhoneInput
                international
                defaultCountry="GH"
                autoComplete={autoComplete}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                onBlur={field.onBlur}
                disabled={disabled}
                name={field.name}
                placeholder={placeholder}
                className={`custom-phone-input px-4 h-10 rounded-md w-full ${
                  fieldState.error ? 'border-red-400' : 'border border-slate-300'
                }`}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
