'use client';
import { use, useState, useEffect } from 'react';

import { urlPath } from '@/utils/url-helpers';
import { verifyOTPAction } from '@/app/actions';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  MailCheck,
  RotateCw,
  MessageCircle,
  Info,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import SupportButton from '@/components/shared/support-button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
  searchParams: Promise<{ email: string; id: string ; nexturl: string }>;
}) {
  const searchParams = use(props.searchParams);
  const { email, id, nexturl } = searchParams;
  const router = useRouter();

  const [countdown, setCountdown] = useState(3600); // 1 hour in seconds
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<{
    type: 'success' | 'error' | 'idle';
    message: string;
  }>({ type: 'idle', message: '' });
  const [resendStatus, setResendStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = async () => {
    if (!email) return;

    setIsLoading(true);
    setResendStatus(null);
    setVerificationStatus({ type: 'idle', message: '' });

    try {
      const response = await fetch('/api/v1/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, id }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }

      setResendStatus({
        type: 'success',
        message: 'New verification code sent successfully!',
      });

      // Reset the countdown to 1 hour
      setCountdown(3600);
      setOtpValue(''); // Clear current OTP

      // Start new countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setResendStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    if (!email || otp.length !== 6) return;

    setIsVerifying(true);
    setVerificationStatus({ type: 'idle', message: '' });

    try {
       const {success, message} = await verifyOTPAction({email, otp_code: otp});
       if (success) {
           toast.success(message);

           setVerificationStatus({
            type: 'success',
            message: 'Account verified successfully! Redirecting...',
          });
    
          // Redirect after successful verification
          setTimeout(() => {
            router.push(nexturl || '/feed');
          }, 2000);
       }else{
        toast.error(message);
       }
    } catch (error) {
      setVerificationStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Invalid verification code',
      });
      setOtpValue(''); // Clear OTP on error
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    if (value.length === 6) {
      handleVerifyOTP(value);
    }
  };

  const getStatusIcon = () => {
    if (verificationStatus.type === 'success') {
      return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
    if (verificationStatus.type === 'error') {
      return <AlertCircle className="h-5 w-5 text-red-400" />;
    }
    return <Shield className="h-5 w-5 text-purple-400" />;
  };

  return (
    <div className="dark:bg-bg-dark bg-bg flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-opacity-10 dark:bg-opacity-10 w-full max-w-md rounded-xl bg-white p-8 text-center shadow-2xl backdrop-blur-lg dark:bg-gray-800"
      >
        <div className="relative mx-auto mb-6 h-24 w-24">
          <motion.svg
            className="mx-auto mb-3 h-24 w-24"
            viewBox="0 0 100 100"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#8B5CF6"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <motion.path
              d="M30 50 L45 65 L70 40"
              stroke="#8B5CF6"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
          </motion.svg>
          <Shield
            className="animate-fade-in absolute inset-0 m-auto h-12 w-12 text-purple-400 opacity-0"
            style={{ animationDelay: '1.5s' }}
          />
        </div>

        <h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
          Welcome to <span className="text-ocean-600">Xolace</span>!
        </h1>
        <p className="mb-4 text-sm text-gray-400 italic">
          &quot;Sometimes the quietest voices have the loudest echoes.&quot; — Xolace
        </p>
        <p className="text-blackA11 mb-6 dark:text-gray-300">
          A new chapter begins. We&apos;ve sent a verification code to{' '}
          <span className="font-semibold text-indigo-500">{email}</span>.
        </p>

        {/* OTP Input Section */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
            {getStatusIcon()}
            <span>Enter your 6-digit verification code</span>
          </div>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="relative">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={handleOtpChange}
                disabled={isVerifying || verificationStatus.type === 'success'}
                className="otp-enhanced"
              >
                <InputOTPGroup className="gap-3">
                  <InputOTPSlot 
                    index={0} 
                    className="h-12 w-12 text-lg font-bold border-2 border-gray-600 bg-gray-900/80 text-white hover:border-purple-400 focus:border-purple-500 focus:bg-gray-800/90 transition-all duration-200 shadow-lg backdrop-blur-sm" 
                  />
                  <InputOTPSlot 
                    index={1} 
                    className="h-12 w-12 text-lg font-bold border-2 border-gray-600 bg-gray-900/80 text-white hover:border-purple-400 focus:border-purple-500 focus:bg-gray-800/90 transition-all duration-200 shadow-lg backdrop-blur-sm" 
                  />
                  <InputOTPSlot 
                    index={2} 
                    className="h-12 w-12 text-lg font-bold border-2 border-gray-600 bg-gray-900/80 text-white hover:border-purple-400 focus:border-purple-500 focus:bg-gray-800/90 transition-all duration-200 shadow-lg backdrop-blur-sm" 
                  />
                </InputOTPGroup>
                <InputOTPSeparator className="text-purple-400 mx-2" />
                <InputOTPGroup className="gap-3">
                  <InputOTPSlot 
                    index={3} 
                    className="h-12 w-12 text-lg font-bold border-2 border-gray-600 bg-gray-900/80 text-white hover:border-purple-400 focus:border-purple-500 focus:bg-gray-800/90 transition-all duration-200 shadow-lg backdrop-blur-sm" 
                  />
                  <InputOTPSlot 
                    index={4} 
                    className="h-12 w-12 text-lg font-bold border-2 border-gray-600 bg-gray-900/80 text-white hover:border-purple-400 focus:border-purple-500 focus:bg-gray-800/90 transition-all duration-200 shadow-lg backdrop-blur-sm" 
                  />
                  <InputOTPSlot 
                    index={5} 
                    className="h-12 w-12 text-lg font-bold border-2 border-gray-600 bg-gray-900/80 text-white hover:border-purple-400 focus:border-purple-500 focus:bg-gray-800/90 transition-all duration-200 shadow-lg backdrop-blur-sm" 
                  />
                </InputOTPGroup>
              </InputOTP>
              
              {/* Subtle glow effect when focused */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg opacity-0 transition-opacity duration-200 -z-10 blur-sm group-focus-within:opacity-100"></div>
            </div>
          </motion.div>

          {/* Code expiration timer */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all ${
              countdown > 300 
                ? 'bg-green-600/20 text-green-300' 
                : countdown > 60 
                  ? 'bg-yellow-600/20 text-yellow-300'
                  : 'bg-red-600/20 text-red-300 animate-pulse'
            }`}>
              <div className={`h-2 w-2 rounded-full ${
                countdown > 300 
                  ? 'bg-green-400' 
                  : countdown > 60 
                    ? 'bg-yellow-400'
                    : 'bg-red-400'
              }`}></div>
              <span className="font-mono">
                Code expires in {formatTime(countdown)}
              </span>
            </div>
          </div>

          {/* Verification Status */}
          {verificationStatus.type !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg border p-3 text-sm ${
                verificationStatus.type === 'success'
                  ? 'border-green-600/20 bg-green-600/10 text-green-400'
                  : 'border-red-600/20 bg-red-600/10 text-red-400'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {verificationStatus.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {verificationStatus.message}
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isVerifying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 text-sm text-purple-400"
            >
              <RotateCw className="h-4 w-4 animate-spin" />
              Verifying your code...
            </motion.div>
          )}
        </div>

        {/* Resend Section */}
        <div className="mb-6 rounded-lg border border-gray-600/50 bg-gray-800/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MailCheck className="h-4 w-4 text-purple-400" />
            <p className="text-sm text-gray-300">
              Didn&apos;t receive the code? Resend new code in 10 mins
            </p>
          </div>
          <button
            onClick={handleResend}
            disabled={isLoading || verificationStatus.type === 'success' || countdown > 3000}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              !isLoading && verificationStatus.type !== 'success' && countdown < 3000
                ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
                : 'cursor-not-allowed bg-gray-700 text-gray-500'
            }`}
          >
            {isLoading ? (
              <RotateCw className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCw className="h-4 w-4" />
            )}
            {isLoading ? 'Sending...' : countdown === 0 ? 'Code Expired' : 'Send New Code'}
          </button>

          {countdown === 0 && (
            <p className="mt-2 text-xs text-red-400">
              Your verification code has expired. Request a new one to continue.
            </p>
          )}

          {resendStatus && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-2 text-sm ${
                resendStatus.type === 'success'
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {resendStatus.message}
            </motion.p>
          )}
        </div>

        <p className="mb-6 text-sm text-gray-700 dark:text-gray-500">
          PS: If the code takes unexpectedly long, don&apos;t worry our servers are just
          hot <span className="inline-block animate-pulse">♨️</span>
        </p>

        <Link
          href={urlPath('/sign-in')}
          className="inline-block rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-indigo-700 hover:shadow-lg"
        >
          Back to Sign In
        </Link>
      </motion.div>

      {/* Floating Support Button */}
      <SupportButton supportOptions={supportOptions} />
    </div>
  );
}