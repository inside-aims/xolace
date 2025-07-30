"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { HelpCircle, Grid3X3 } from "lucide-react";
import {Textarea} from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {OnboardingState} from "@/components/professionals/onboarding";
import {XolacePhoneNumberInput} from "@/components/shared/XolacePhoneNumberInput";
import {isValidPhoneNumber} from "libphonenumber-js";

// Step 1 Schema
const StepOneSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  title: z.string().min(2, "Title is required"),
  field: z.string().min(2, "Field is required"),
  experience: z.string().min(1, "Experience is required"),
});

// Step 2 Schema
const StepTwoSchema = z.object({
  languages: z.string().min(2),
  location: z.string().min(2),
  contact: z.string()
    .min(1)
    .refine((val) => isValidPhoneNumber(val), {
      message: 'Invalid phone number'
    }),
  preferredContact: z.string().min(2),
});

// Step 3 Schema
const StepThreeSchema = z.object({
  bio: z.string().min(10, {message: "Bio is must be at least 10 characters."}),
  avatar: z.string().url().optional(),
});

type StepOneType = z.infer<typeof StepOneSchema>;
type StepTwoType = z.infer<typeof StepTwoSchema>;
type StepThreeType = z.infer<typeof StepThreeSchema>;
type FullFormType = StepOneType & StepTwoType & StepThreeType;

//eslint-disable-next-line
const stepSchemas: ZodType<any>[] = [StepOneSchema, StepTwoSchema, StepThreeSchema];

type FieldDefinition = {
  name: keyof FullFormType;
  label: string;
  type: "input" | "select" | "file" | "textarea" | "phone";
  options?: { label: string; value: string }[];
};

const fieldsByStep: FieldDefinition[][] = [
  [
    { name: "fullName", label: "Full Name", type: "input" },
    { name: "title", label: "Professional Title", type: "input" },
    { name: "field", label: "Field of Expertise", type: "input" },
    {
      name: "experience",
      label: "Years of Experience",
      type: "select",
      options: [
        { label: "1 year", value: "1" },
        { label: "2 years", value: "2" },
        { label: "3 years", value: "3" },
        { label: "5+ years", value: "5" },
        { label: "10+ years", value: "10" },
      ],
    },
  ],
  [
    { name: "languages", label: "Languages Spoken", type: "input" },
    { name: "location", label: "Location", type: "input" },
    { name: "preferredContact", label: "Preferred Communication", type: "select",
      options: [
        { label: "Email", value: "email" },
        { label: "Phone Call", value: "phoneCall" },
        { label: "Direct Message", value: "directMessage" },
        { label: "Via video", value: "video" },
      ],
    },
    { name: "contact", label: "Contact Info (Optional)", type: "phone" },
  ],
  [
    { name: "avatar", label: "Profile Picture (Optional)", type: "file" },
    { name: "bio", label: "Short Bio", type: "textarea" },
  ],
];

interface StartingStateProps {
  setState: (state: OnboardingState) => void;
}

export default function StartingState({setState}: StartingStateProps ) {
  const [step, setStep] = useState(0);
  const [collectedData, setCollectedData] = useState<Partial<FullFormType>>({});

  const currentSchema = stepSchemas[step];

  const form = useForm<FullFormType>({
    resolver: zodResolver(currentSchema),
    defaultValues: collectedData as FullFormType,
    mode: "onTouched"
  });

  //eslint-disable-next-line
  const handleContinue: SubmitHandler<FullFormType> = (data) => {
    const updatedData = { ...collectedData, ...data };
    setCollectedData(updatedData);

    if (step < stepSchemas.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const handleFinalSubmit: SubmitHandler<FullFormType> = (data) => {
    const updatedData = { ...collectedData, ...data };
    setState("finished");
    console.log("Final data submitted:", updatedData);
  };


  const goBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  return (
    <div className="relative flex flex-col bg-white w-full min-h-screen overflow-x-hidden" style={{ margin: 0}}>
      <nav className="w-full border-b shadow-md border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center"></div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <HelpCircle className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Grid3X3 className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="text-xl md:text-3xl w-full px-4 md:px-8 mx-0 md:mx-[18%] max-w-2xl flex items-start justify-start">
          {step === 0 && (<span>Professional Identify</span>)}
          {step === 1 && (<span>Communication & Reachability</span>)}
          {step === 2 && (<span>Personal Touch & Bio</span>)}
        </div>
      </nav>

      <div className="flex flex-col items-start justify-center md:flex-1">
        <div className="w-full p-4 md:px-8 mx-0 md:mx-[18%] max-w-2xl flex items-start justify-start border-0 md:border">
          {/* Form Section */}
          <div className="w-full p-0 md:px-8 ">
            <h2 className="text-2xl font-semibold mb-4">Step {step + 1} of {stepSchemas.length}</h2>
            <Separator className="mb-6"/>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="flex flex-col gap-4 w-full">
                {fieldsByStep[step].map(({ name, label, type, options }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-left">{label}</FormLabel>
                        <FormControl>
                          <div>
                            {type === "input" && (
                              <Input
                                {...field}
                                value={field.value ?? ""}
                                placeholder={label}
                                className="px-2 h-10 w-full bg-slate-50 border border-slate-300"
                              />
                            )}
                            {type === "select" && (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="px-2 h-10 w-full bg-slate-50 border border-slate-300">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {options?.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            {type === "file" && (
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const url = URL.createObjectURL(file);
                                    field.onChange(url);
                                  }
                                }}
                                className="px-2 h-10 w-full bg-slate-50 border border-slate-300"
                              />
                            )}
                            {type === "textarea" && (
                              <Textarea
                                {...field}
                                placeholder={"Tell us a little about yourself"}
                                className="px-2 h-10 w-full bg-slate-50 border border-slate-300"
                              />
                            )}
                            {type === "phone" && (
                              <XolacePhoneNumberInput
                                control={form.control}
                                name={name}
                                placeholder="Enter your phone number"
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <div className="flex items-center justify-between mt-8">
                  {step > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-lg"
                      onClick={goBack}
                    >
                      Back
                    </Button>
                  ) : (
                    <div/>
                  )}
                    {step === stepSchemas.length - 1 ? (
                      <Button
                        type={"submit"}
                        className="bg-lavender-500 rounded-lg hover:bg-lavender-600">
                        Submit
                      </Button>
                    ) : (
                      <Button
                        onClick={form.handleSubmit(handleContinue)}
                        className="bg-lavender-500 rounded-lg hover:bg-lavender-600">
                        Continue
                      </Button>
                    )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}