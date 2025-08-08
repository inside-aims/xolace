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

export default function PasswordResetOTPPage(props: {
  searchParams: Promise<{ email: string; token?: string }>;
}) {
  const searchParams = use(props.searchParams);
  const { email, token } = searchParams;

  const otpConfig: OTPVerificationConfig = {
    type: 'recovery',
    email,
    id: token,
    nextUrl: `/change-password?email=${encodeURIComponent(email)}&from=forgot-password&token=${token}`,
    verifyAction: async ({ email, otp_code }) => {
      return await verifyOTPAction({ 
        email, 
        otp_code, 
      });
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
    onError: (error) => {
      // console.error('Password reset verification failed:', error);
      // Could redirect back to forgot password page on certain errors
      if (error.includes('expired') || error.includes('invalid token')) {
        setTimeout(() => {
          window.location.href = '/forgot-password';
        }, 3000);
      }
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

// Example usage in forgot password flow:
// 1. User enters email on /forgot-password
// 2. System sends OTP and redirects to /verify-password-reset?email=user@email.com&token=temp_token
// 3. User verifies OTP on this page
// 4. On success, redirects to /reset-password?email=user@email.com&token=verified_token