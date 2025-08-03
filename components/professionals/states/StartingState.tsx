"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { HelpCircle, Grid3X3 } from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox"

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
import {fieldsByStep} from "@/components/professionals/states/index";
import { onBoardingFlowAction } from "@/app/actions";
import { toast } from "sonner";

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
  email: z.string().min(1, "Enter a valid email").email("Email is required"),
  bio: z.string().min(10, {message: "Bio is must be at least 10 characters."}),
  avatar: z.string().optional(),
});

// Step 4 Schema
const StepFourSchema = z.object({
  confirmAccuracy: z.boolean().refine((val) => val === true, { message: "You must confirm the information." }),
  understandReview: z.boolean().refine((val) => val === true, { message: "You must acknowledge data review." }),
  agreeTerms: z.boolean().refine((val) => val === true, { message: "You must agree to the terms." }),
  consentProcessing: z.boolean().refine((val) => val === true, { message: "You must consent to processing." }),
});

const FullFormSchema = StepOneSchema.merge(StepTwoSchema)
  .merge(StepThreeSchema)
  .merge(StepFourSchema);


// type StepOneType = z.infer<typeof StepOneSchema>;
// type StepTwoType = z.infer<typeof StepTwoSchema>;
// type StepThreeType = z.infer<typeof StepThreeSchema>;
// type StepFourType = z.infer<typeof StepFourSchema>;
export type FullFormType = z.infer<typeof FullFormSchema>;

//eslint-disable-next-line
const stepSchemas: ZodType<any>[] = [StepOneSchema, StepTwoSchema, StepThreeSchema, StepFourSchema];

export type FieldDefinition = {
  name: keyof FullFormType;
  label: string;
  type: "input" | "select" | "file" | "textarea" | "phone" | "checkbox";
  options?: { label: string; value: string }[];
  placeholder: string;
};

interface StartingStateProps {
  setState: (state: OnboardingState) => void;
}

export default function StartingState({setState}: StartingStateProps ) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [collectedData, setCollectedData] = useState<Partial<FullFormType>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FullFormType>({
    resolver: zodResolver(FullFormSchema),
    defaultValues: {
      // It's good practice to define all keys here
      fullName: '',
      title: '',
      field: '',
      experience: '',
      languages: '',
      location: '',
      contact: '',
      preferredContact: '',
      email: '',
      bio: '',
      avatar: '',
      confirmAccuracy: false,
      understandReview: false,
      agreeTerms: false,
      consentProcessing: false,
    },
    mode: "onTouched"
  });

  //eslint-disable-next-line
  const handleContinue = async () => {
    // const updatedData = { ...collectedData, ...data };
    // setCollectedData(updatedData);

    const fieldsToValidate = fieldsByStep[step].map(f => f.name);

    // Trigger validation for only those fields. It returns a boolean.
    const isValid = await form.trigger(fieldsToValidate as (keyof FullFormType)[]);

    if (isValid) {
      if (step < stepSchemas.length - 1) {
        setStep((prev) => prev + 1);
      }
    }
  };

  const handleFinalSubmit: SubmitHandler<FullFormType> = async (data) => {
    const updatedData = { ...collectedData, ...data };
    console.log("Final data submitted:", updatedData);
    
    setIsSubmitting(true);
    const toastId = toast.loading('Submitting your information...');

    try {
      const result = await onBoardingFlowAction(updatedData, selectedFile);
      if (result.success) {
        toast.success(result.message, { id: toastId , duration: 5000});
        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        } else {
          router.push(`/professionals/verify-otp?email=${updatedData.email}`);
        }
      } else {
        toast.error(result.message || 'An unknown error occurred.', { id: toastId });
      }
    } catch (error) {
      toast.error('Failed to submit form. Please try again.', { id: toastId });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const goBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  return (
    <div className="relative flex flex-col bg-white dark:bg-bg-dark bg-bg text-foreground w-full min-h-screen overflow-x-hidden" style={{ margin: 0}}>
      <nav className="w-full border-b border-gray-200 bg-white dark:bg-bg-dark">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center"></div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors dark:hover:bg-gray-800">
              <HelpCircle className="w-6 h-6 text-gray-600 dark:text-gray-100" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Grid3X3 className="w-6 h-6 text-gray-600 dark:text-gray-100" />
            </button>
          </div>
        </div>
        <div className="text-xl md:text-3xl w-full px-4 md:px-8 mx-0 md:mx-[18%] max-w-2xl flex items-start justify-start">
          {step === 0 && (<span>Professional Identify</span>)}
          {step === 1 && (<span>Communication & Reachability</span>)}
          {step === 2 && (<span>Personal Touch & Bio</span>)}
          {step === 3 && (<span>Consent & Agreement</span>)}
        </div>
      </nav>

      <div className="flex flex-col items-start justify-center md:flex-1">
        <div className="w-full p-4 md:px-8 mx-0 md:mx-[18%] max-w-2xl flex items-start justify-start border-0 md:border border-gray-200">
          {/* Form Section */}
          <div className="w-full p-0 md:px-8 ">
            <h2 className="text-2xl font-semibold mb-4">Step {step + 1} of {stepSchemas.length}</h2>
            <Separator className="mb-6"/>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="flex flex-col gap-4 w-full">
                {fieldsByStep[step].map(({ name, label, type, options, placeholder }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        {type !== 'checkbox' && (
                          <FormLabel className="text-left">{label}</FormLabel>
                        )}
                        <FormControl>
                          <div>
                            {type === "input" && (
                              <Input
                                {...field}
                                value={typeof field.value === "string" ? field.value : ""}
                                placeholder={placeholder}
                                className="px-2 h-10 w-full bg-slate-50 border border-slate-300"
                              />
                            )}
                            {type === "select" && (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={typeof field.value === "string" ? field.value : ""}
                              >
                                <SelectTrigger className="px-2 h-10 w-full bg-slate-50 border border-slate-300">
                                  <SelectValue placeholder={placeholder} />
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
                                placeholder={placeholder}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setSelectedFile(file);
                                    const fileName = `${Date.now()}_${file.name}`;
                                    console.log("file name ", fileName)
                                    field.onChange(fileName);
                                  }
                                }}
                                className="px-2 h-10 w-full bg-slate-50 border border-slate-300"
                              />
                            )}
                            {type === "textarea" && (
                              <Textarea
                                {...field}
                                value={typeof field.value === "string" ? field.value : ""}
                                placeholder={placeholder}
                                className="px-2 h-10 w-full bg-slate-50 border border-slate-300"
                              />
                            )}
                            {type === "phone" && (
                              <XolacePhoneNumberInput
                                control={form.control}
                                name={name}
                                placeholder={placeholder}
                              />
                            )}
                            {type === "checkbox" && (
                              <div className="flex items-start space-x-2 mt-2">
                                <Checkbox
                                  checked={!!field.value}
                                  onCheckedChange={(checked) => field.onChange(checked === true)}
                                  className="mt-1 h-4 w-4 border-gray-300 rounded"
                                />
                                <label className="text-left">{label}</label>
                              </div>
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
                      className="rounded-lg dark:text-white"
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
                        className="bg-lavender-500 rounded-lg hover:bg-lavender-600 dark:text-white">
                        Submit
                      </Button>
                    ) : (
                      <Button
                      type="button" // Important: change to "button"
                      onClick={handleContinue}
                        className="bg-lavender-500 rounded-lg hover:bg-lavender-600 dark:text-white">
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