'use client';

import React, { useState } from 'react';
import {useForm} from 'react-hook-form';
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
import Image from "next/image";

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
  const [wordCount, setWordCount] = useState<number>(0);

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
    const payload = {
      name: `x/${data.name}`,
      description: data.description,
      purpose: data.purpose,
      visibility: data.visibility,
      rules: data.rules,
      icon_url: data.icon_url,
      banner_url: data.banner_url,
    }
    console.log("Submitted data", payload);
    form.reset();
    setStep(1);
    onOpenChange(false);
  };

  const nextStep = async () => {
    const currentStepFields = campfireFieldsByStep[step - 1];
    const fieldsToValidate = currentStepFields.map((f) => f.name);

    const isValid = await form.trigger(fieldsToValidate as (keyof FullFormType)[]);

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

  const getIconUrl = (): string | null => {
    const url = form.watch('icon_url');
    return url && url.trim() ? url : null;
  };

  const getBannerUrl = (): string | null => {
    const url = form.watch('banner_url');
    return url && url.trim() ? url : null;
  };


  const  truncateText =(text: string, maxLength = 20) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="w-full max-w-[95vw] sm:max-w-[650px]"
      >
        <DialogHeader>
          <DialogTitle>{stepTitles[step - 1]}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          {/* REMOVE onSubmit from the form element - this is the key fix */}
          <div className="w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-8 items-start">
              <div className="col-span-1 md:col-span-7 order-2 md:order-1 space-y-4">
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
                            {type === "input" && (
                              <Input
                                className='border-border rounded-xl border-2 border-dashed bg-transparent dark:bg-input/30'
                                placeholder={placeholder}
                                {...field}
                                onChange={(e) => {
                                  const noSpaces = e.target.value.replace(/\s+/g, '');
                                  const pascalCase = noSpaces
                                    .replace(/(^\w|[A-Z]|\b\w)/g, (char) => char.toUpperCase())
                                    .replace(/[^a-zA-Z0-9]/g, '');
                                  field.onChange(pascalCase);
                                }}
                              />)}

                            {type === "textarea" && name === "description" ? (
                              <>
                                <Textarea
                                  placeholder={placeholder}
                                  value={field.value}
                                  className={`border-border rounded-xl border-2 border-dashed bg-transparent text-base leading-relaxed transition-all duration-200 focus:border-purple-400 focus:ring-0 focus-visible:ring-0`}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const words = value.trim().split(/\s+/).filter(Boolean);

                                    if (words.length <= MAX_WORDS) {
                                      field.onChange(e);
                                      setWordCount(words.length);
                                    } else {
                                      const truncated = words.slice(0, MAX_WORDS).join(" ");
                                      field.onChange(truncated);
                                      setWordCount(MAX_WORDS);
                                    }
                                  }}
                                />
                              </>
                            ) : type === "textarea" ? (
                              <Textarea
                                placeholder={placeholder}
                                {...field}
                                className={`border-border rounded-xl border-2 border-dashed bg-transparent text-base leading-relaxed transition-all duration-200 focus:border-purple-400 focus:ring-0 focus-visible:ring-0`}
                              />
                            ) : null}

                            {type === "select" && options && (
                              <Select
                                onValueChange={field.onChange}
                                value={typeof field.value === "string" ? field.value : ""}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={placeholder}/>
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
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-start items-start p-2 text-left whitespace-normal h-auto min-h-[2.5rem]"
                                  >
                                    <div className="w-full whitespace-normal break-words text-left">
                                      {field.value?.length
                                        ? RULE_OPTIONS.filter((r) => field.value?.includes(r.id)).map((r) => r.label).join(', ')
                                        : 'Select rules'}
                                    </div>
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
                            {type === "file" && (
                              <Input
                                type="file"
                                accept="image/*"
                                placeholder={placeholder}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const previewUrl = URL.createObjectURL(file);
                                    field.onChange(previewUrl);
                                  }
                                }}
                                className="px-2 h-10 w-full bg-slate-50 border border-slate-300"
                              />
                            )}
                          </div>
                        </FormControl>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-destructive flex-1">
                            <FormMessage/>
                          </div>
                          {type === "textarea" && name === "description" && (
                            <p className="text-xs text-muted-foreground text-right ">
                              {wordCount} / {MAX_WORDS} words
                            </p>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/*profile card*/}
              <div
                className={`col-span-1 md:col-span-5 order-1 md:order-2 rounded-2xl shadow-lg ${step !== 3 && "pt-2 border"}`}>
                <div className={"flex flex-col items-start justify-start gap-2 pb-2"}>
                  {step === 3 && (
                    getBannerUrl() ? (
                      <div
                        className="h-8 w-full rounded-t-2xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${getBannerUrl()})` }}
                      />
                    ) : (
                      <div className="h-8 w-full flex bg-lavender-300 rounded-t-2xl" />
                    )
                  )}
                  <div className={"flex flex-row gap-2 px-4"}>
                    {step === 3 && (
                      getIconUrl() ? (
                        <Image
                          src={getIconUrl()!}
                          height={20}
                          width={20}
                          alt="CampfiresList icon"
                          className="w-10 h-10 rounded-full border border-lavender-500 object-cover"
                        />
                      ) : (
                        <p className="w-10 h-10 flex items-center justify-center border border-lavender-500 font-semibold text-white rounded-full">
                          <span className="w-9 h-9 flex items-center justify-center bg-lavender-500 font-semibold text-white rounded-full">
                            x/
                          </span>
                        </p>
                      )
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
                    {truncateText(getDisplayDescription())}
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
              <div className="flex items-center justify-center space-x-2">
                {Array.from({length: TOTAL_STEPS}).map((_, i) => (
                  <div
                    key={i}
                    className={cn("h-2 w-2 rounded-full", i + 1 === step ? "bg-lavender-500" : "bg-muted")}
                  />
                ))}
              </div>
              <div className="flex space-x-4 items-center justify-between mt-4">
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