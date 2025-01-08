'use client';

import * as React from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { cn } from '@/lib/utils';

interface NewRadioGroupItem
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  userGender?: boolean | undefined;
  genderType?: 'male' | 'female';
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  NewRadioGroupItem
>(({ className, userGender, genderType, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        `aspect-square ${userGender ? 'flex h-[60px] w-[60px] items-center justify-center rounded-xl bg-white p-5' : 'h-5 w-5 rounded-lg'} border border-slate-900 text-slate-900 shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-50 dark:text-slate-50 dark:focus-visible:ring-slate-300`,
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        {!userGender && <CheckIcon className="h-3.5 w-3.5 fill-primary" />}
        {userGender && genderType === 'male' && (
          <div className="text-5xl font-extrabold text-black">
            &#x2642;&#xFE0F;
          </div>
        )}

        {userGender && genderType === 'female' && (
          <div className="text-5xl font-extrabold text-black">
            &#x2640;&#xFE0F;
          </div>
        )}
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
