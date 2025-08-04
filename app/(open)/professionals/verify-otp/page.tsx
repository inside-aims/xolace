"use client";

import React, {useEffect, useRef, useState, use} from "react";
import {OnboardingState} from "@/components/professionals/onboarding";
import {Controller, useForm} from "react-hook-form";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import {Button} from "@/components/ui/button";
import { verifyOTPAction } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


interface VerifyingStateProps {
  setState: (state: OnboardingState) => void;
}

interface OTPForm{
  otp_code: string;
}

export const VerifyOTP = ({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | undefined }>
  }) => {
  const email = use(searchParams).email
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(120);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<OTPForm>({
    defaultValues: { otp_code: "" },
  });

  useEffect(() => {
    startTimer();

    return () => {
      if(timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, []);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = () => {
    setTimeLeft(120);
    startTimer();
    return () => {
      if(timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  };

  const onFormSubmit = async (data: OTPForm) => {
    setSubmitting(true);
    console.log("data", data);
    if (!email) {
      toast.error("Email is required");
      return;
    }
    try {
        const {success, message} = await verifyOTPAction({email, otp_code: data.otp_code});
        if (success) {
            toast.success(message);
            router.push(`/change-password?from=professional-onboarding`);
        }
    } catch (error) {
        console.log("error", error);
    } finally {
      setSubmitting(false);
      reset();
    }
    
  };

  return (
   <main className="min-h-screen flex items-center justify-center">
     <div
      className="relative flex flex-col bg-white rounded-2xl w-full max-w-5xl h-[70vh] md:h-[60vh] overflow-hidden items-center justify-center p-8 gap-6 text-center dark:bg-gray-600 text-foreground ">

      <div className="flex flex-col items-center justify-center gap-4 border p-8">
        <div className={"flex flex-col items-center gap-4"}>
          <h2 className={"font-semibold text-2xl"}>Verify Your Account</h2>
          <p>Enter the OTP sent to your email to verify your account.</p>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
          <Controller
            name="otp_code"
            control={control}
            rules={{
              required: "OTP is required",
              minLength: {value: 6, message: "OTP must be 6 digits"},
              maxLength: {value: 6, message: "OTP must be 6 digits"}
            }}
            render={({field}) => (
              <InputOTP maxLength={6} className="w-full" {...field}>
                <InputOTPGroup className="w-full flex justify-between gap-2 md:gap-4">
                  {[0, 1, 2, 3, 4, 5].map(index => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="flex-1 h-12 w-12 min-w-0 border border-input"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />

          {errors.otp_code && (
            <p className="text-red-500 text-sm">{errors.otp_code.message}</p>
          )}

          <p className={cn(
            "text-sm font-medium flex justify-end",
            timeLeft <= 10 ? "text-red-500" : "text-green-600"
          )}>
            Time Remaining: {timeLeft}s
          </p>

          {timeLeft <= 0 ? (
            <Button
              type="button"
              onClick={handleResend}
              className="w-full bg-ocean-500 dark:bg-ocean-500 text-white font-semibold hover:text-white rounded-lg hover:bg-ocean-600 transition duration-300 ease-in-out hover:bg-ocean-600 dark:text-white hover:scale-102"
            >Resend OTP</Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-lavender-500 dark:bg-lavender-500 text-white font-semibold hover:text-white rounded-lg hover:bg-lavender-600 transition duration-300 ease-in-out hover:bg-lavender-600 dark:text-white hover:scale-102"
              disabled={watch("otp_code").length < 6}
            >Submit OTP</Button>
          )}
        </form>
      </div>
    </div>
   </main>
  );
};

export default VerifyOTP;
