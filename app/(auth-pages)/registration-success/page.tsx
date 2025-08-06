'use client';
import { use } from 'react';
import { MessageCircle, Info, FileText } from 'lucide-react';
import SupportButton from '@/components/shared/support-button';
import OTPVerification, { OTPVerificationConfig } from '@/components/shared/otp-verification-component';
import { verifyOTPAction } from '@/app/actions';

const supportOptions = [
  {
    icon: MessageCircle,
    label: '@ xolace25@gmail.com',
  },
  {
    icon: Info,
    label: 'About us',
    href: '/about',
  },
  {
    icon: FileText,
    label: 'Change logs',
    href: '/updates',
  },
];

export default function RegistrationSuccessPage(props: {
  searchParams: Promise<{ email: string; id: string; nexturl: string }>;
}) {
  const searchParams = use(props.searchParams);
  const { email, id, nexturl } = searchParams;

  const otpConfig: OTPVerificationConfig = {
    type: 'signup',
    email,
    id,
    nextUrl: nexturl || '/feed',
    verifyAction: async ({ email, otp_code }: {email: string, otp_code: string}) => {
      return await verifyOTPAction({ email, otp_code });
    },
    resendAction: async ({ email, id, type }: {email: string, id?: string, type: 'signup' | 'recovery' | 'login'}) => {
      const response = await fetch('/api/v1/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, id, type }),
      });
      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to resend OTP' };
      }
      return { success: true, message: data.message };
    },
    onSuccess: (data?: {success: boolean, message: string}) => {
      // Additional success handling if needed
      console.log('Registration verification successful:', data);
    },
    onError: (error:string) => {
      // Additional error handling if needed
      console.error('Registration verification failed:', error);
    },
  };

  return (
    <div className="dark:bg-bg-dark bg-bg flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 p-4">
      <div className="bg-opacity-10 dark:bg-opacity-10 w-full max-w-md rounded-xl bg-white p-8 text-center shadow-2xl backdrop-blur-lg dark:bg-gray-800">
        <OTPVerification config={otpConfig} />
      </div>

      {/* Floating Support Button */}
      <SupportButton supportOptions={supportOptions} />
    </div>
  );
}