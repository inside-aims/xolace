'use client';

import { useState } from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {campfireFieldsByStep, CampfirePurpose, CampfireVisibility} from '@/components/campfires/campfires.types';
import { cn } from '@/lib/utils';
import TagCard from "@/components/cards/TagCard";
import {ZodType} from "zod";

const MAX_WORDS = 20;
const MAX_RULES = 4;

const RULE_OPTIONS = [
  { id: 'no_spam', label: 'No spam or self-promotion' },
  { id: 'be_respectful', label: 'Be respectful' },
  { id: 'stay_on_topic', label: 'Stay on topic' },
  { id: 'no_hate', label: 'No hate speech or bullying' },
  { id: 'use_search', label: 'Use the search before posting' },
  { id: 'no_politics', label: 'No political discussions' },
  { id: 'english_only', label: 'English only' },
  { id: 'no_piracy', label: 'No piracy or illegal content' },
];

const StepOneSchema = z.object({
  name: z.string().min(2, { message: 'Campfire name is required.' }),
  description: z
    .string()
    .min(5, { message: 'Please describe your Campfire.' })
    .refine((val) => val.trim().split(/\s+/).length <= MAX_WORDS, {
      message: `Description must be ${MAX_WORDS} words or fewer.`,
    }),
});

const StepTwoSchema = z.object({
  purpose: z.nativeEnum(CampfirePurpose),
  visibility: z.nativeEnum(CampfireVisibility),
  rules: z.array(z.string()).optional(),
});

const StepThreeSchema = z.object({
  icon_url: z.string().optional(),
  banner_url: z.string().optional(),
});

const FullFormSchema = StepOneSchema.merge(StepTwoSchema).merge(StepThreeSchema);

// Individual step schemas for step-by-step validation
const stepSchemas = [StepOneSchema, StepTwoSchema, StepThreeSchema];

export type FullFormType = z.infer<typeof FullFormSchema>;

interface CreateCampfireModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const stepTitles = [
  "Start your Campfire - Name & Describe",
  "Define the Rules & Visibility", 
  "Customize Your Campfire Appearance",
];

const CreateCampfireModal = ({ open, onOpenChange }: CreateCampfireModalProps) => {
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = campfireFieldsByStep.length;

  const form = useForm<FullFormType>({
    resolver: zodResolver(FullFormSchema),
    defaultValues: {
      name: '',
      description: '',
      purpose: undefined,
      visibility: CampfireVisibility.Public,
      rules: [],
      icon_url: '',
      banner_url: '',
    },
    mode: "onTouched"
  });

  const handleFinalSubmit = async (data: FullFormType) => {
    console.log('Campfire Created:', data);
    form.reset();
    setStep(1);
    onOpenChange(false);
  };

  const nextStep = async () => {
    const currentStepFields = campfireFieldsByStep[step - 1];
    const fieldsToValidate = currentStepFields.map((f) => f.name);

    console.log(`Validating step ${step} fields:`, fieldsToValidate);

    const isValid = await form.trigger(fieldsToValidate as (keyof FullFormType)[]);

    console.log(`Step ${step} validation result:`, isValid);

    if (isValid) {
      if (step < TOTAL_STEPS) {
        setStep((prev) => prev + 1);
      }
    } else {
      console.log('Validation failed for step', step);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setStep(1);
    }
    onOpenChange(newOpen);
  };

  // Helper function to get display name
  const getDisplayName = () => {
    const name = form.watch('name');
    if (name && name.trim()) {
      return `x/${name.trim()}`;
    }
    return 'x/campfire name';
  };

  // Helper function to get display description
  const getDisplayDescription = () => {
    const description = form.watch('description');
    if (description && description.trim()) {
      return description.trim();
    }
    return 'Your campfire description';
  };

  // Helper function to get purpose
  const getPurposeDisplayName = () => {
    const purpose = form.watch('purpose');

    if (purpose) {
      const purposeMap: Record<CampfirePurpose, string> = {
        [CampfirePurpose.Creative]: 'Creative',
        [CampfirePurpose.Support]: 'Support',
        [CampfirePurpose.Growth]: 'Growth',
      };
      return purposeMap[purpose] || 'Growth';
    }
    return 'Growth';
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="w-full max-w-[95vw] sm:max-w-[600px]"
      >
        <DialogHeader>
          <DialogTitle>{stepTitles[step - 1]}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          {/* REMOVE onSubmit from the form element - this is the key fix */}
          <div className="w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-8 items-start">
              <div className="col-span-1 md:col-span-7 order-2 md:order-1">
                {campfireFieldsByStep[step - 1].map(({ name, label, type, placeholder, options }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <div>
                            {type === "input" && ( <Input placeholder={placeholder} {...field} />)}

                            {type === "textarea" && name === "description" ? (
                              <Textarea
                                placeholder={placeholder}
                                {...field}
                                onChange={(e) => {
                                  const words = e.target.value.trim().split(/\s+/);
                                  if (words.length <= MAX_WORDS) {
                                    field.onChange(e);
                                  }
                                }}
                              />
                            ) : type === "textarea" ? (
                              <Textarea placeholder={placeholder} {...field} />
                            ) : null}

                            {type === "select" && options && (
                              <Select
                                onValueChange={field.onChange}
                                value={typeof field.value === "string" ? field.value : ""}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                  {options.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}

                            {name === "rules" && type === "checkbox" && (
                              <Popover modal={false}>
                                <PopoverTrigger asChild>
                                  <Button type='button' variant="outline" className="w-full justify-start">
                                    {field.value?.length
                                      ? RULE_OPTIONS.filter((r) => field.value?.includes(r.id)).map((r) => r.label).join(', ')
                                      : 'Select rules'}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
                                  <div className="flex flex-col gap-2">
                                    {RULE_OPTIONS.map((rule) => {
                                      const selected = field.value?.includes(rule.id);
                                      const disabled = !selected && (field.value?.length || 0) >= MAX_RULES;
                                      return (
                                        <label key={rule.id} className="flex items-center gap-2 cursor-pointer">
                                          <Checkbox
                                            checked={selected}
                                            disabled={disabled}
                                            onCheckedChange={(checked) => {
                                              let newValues: string[];

                                              if (checked) {
                                                newValues = [...(Array.isArray(field.value) ? field.value : []), rule.id];
                                              } else {
                                                newValues = Array.isArray(field.value)
                                                  ? field.value.filter((id) => id !== rule.id)
                                                  : [];
                                              }

                                              field.onChange(newValues);
                                            }}
                                          />
                                          {rule.label}
                                        </label>
                                      );
                                    })}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/*profile card*/}
              <div className={`col-span-1 md:col-span-5 order-1 md:order-2 rounded-2xl shadow-lg ${step !== 3 && "pt-2 border"}`}>
                <div className={"flex flex-col items-start justify-start gap-2 pb-2"}>
                  {step === 3 && (
                    <p className={"h-6 w-full flex bg-lavender-300 rounded-t-2xl "}></p>
                  )}
                  <div className={"flex flex-row gap-2 px-4"}>
                    {step === 3 && (
                      <p
                        className={"w-10 h-10 flex items-center justify-center border border-lavender-500 font-semibold text-white rounded-full"}>
                        <span
                          className={"w-9 h-9 flex items-center justify-center bg-lavender-500 font-semibold text-white rounded-full"}>
                          x/
                        </span>
                      </p>
                    )}
                    <div className={"flex flex-col items-start "}>
                      {getDisplayName()}
                      <p className={"flex flex-row gap-4 text-xs text-neutral-500"}>
                        <span>1 member</span>
                        <span>1 online</span>
                      </p>
                    </div>
                  </div>
                  <p className={"px-4 tex-sm flex text-neutral-500"}>
                    {getDisplayDescription()}
                  </p>
                  {step !== 1 && (
                    <p className={"w-full flex  items-end justify-end px-4 text-sm"}>
                      <TagCard _id={"purpose"} name={getPurposeDisplayName()}/>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className={"flex w-full items-center justify-between"}>
              <div className="flex justify-center space-x-2">
                {Array.from({length: TOTAL_STEPS}).map((_, i) => (
                  <div
                    key={i}
                    className={cn("h-2 w-2 rounded-full", i + 1 === step ? "bg-lavender-500" : "bg-muted")}
                  />
                ))}
              </div>
              <div className="flex space-x-4 justify-between mt-4">
                {step > 1 && (
                  <Button type='button' variant="outline" className={"rounded-full px-8"} onClick={prevStep}>
                    Back
                  </Button>
                )}
                {step < TOTAL_STEPS ? (
                  <Button
                    type="button"
                    className={"bg-lavender-500 hover:bg-lavender-600 px-8 rounded-full"}
                    onClick={nextStep}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className={"bg-lavender-500 hover:bg-lavender-600 rounded-full px-8"}
                    onClick={() => form.handleSubmit(handleFinalSubmit)()}
                  >
                    Create
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampfireModal;