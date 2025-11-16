'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {Control, FieldPath, FieldValues} from 'react-hook-form';

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group';

import {Tooltip, TooltipTrigger, TooltipContent} from '@/components/ui/tooltip';
import {InfoIcon} from 'lucide-react';
import {Textarea} from '@/components/ui/textarea';

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'textarea'
  disabled?: boolean;
  autoComplete?: string;
  info?: string;
}

export function FormInput<T extends FieldValues>(
  {
    control,
    name,
    label,
    placeholder,
    type = 'text',
    disabled,
    autoComplete = 'off',
    info,
  }: FormInputProps<T>) {

  const isPassword = type === 'password';
  const isTextarea = type === 'textarea';

  return (
    <FormField
      control={control}
      name={name}
      render={({field}) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <InputGroup>
              {isTextarea ? (
                <Textarea
                  {...field}
                  disabled={disabled}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  className="resize-none"
                />
              ) : (
                <>
                  <InputGroupInput
                    {...field}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete={autoComplete}
                  />
                </>
              )}

              {/* Addon section (only for non-textarea fields) */}
              {!isTextarea && (info || isPassword) && (
                <InputGroupAddon align="inline-end">
                  {info && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InputGroupButton
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Info"
                        >
                          <InfoIcon size={18}/>
                        </InputGroupButton>
                      </TooltipTrigger>
                      <TooltipContent>{info}</TooltipContent>
                    </Tooltip>
                  )}
                </InputGroupAddon>
              )}
            </InputGroup>
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />
  );
}
