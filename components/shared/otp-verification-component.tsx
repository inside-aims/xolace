'use client';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  MailCheck,
  RotateCw,
  Shield,
  CheckCircle,
  AlertCircle,
  UserCheck,
  KeyRound,
  LogIn,
} from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { urlPath } from '@/utils/url-helpers';

export interface OTPVerificationConfig {
  type: 'signup' | 'recovery' | 'login';
  email: string;
  id?: string;
  nextUrl?: string;
  onSuccess?: (data?: {success: boolean, message: string}) => void;
  onError?: (error: string) => void;
  verifyAction: (params: { email: string; otp_code: string; id?: string; }) => Promise<{ success: boolean; message: string; }>;
  resendAction?: (params: { email: string; id?: string ; type: 'signup' | 'recovery' | 'login' }) => Promise<{ success: boolean; message: string }>;
}

interface OTPVerificationProps {
  config: OTPVerificationConfig;
  className?: string;
}

const typeConfigs = {
  signup: {
    icon: UserCheck,
    title: 'Welcome to Xolace!',
    subtitle: '"Sometimes the quietest voices have the loudest echoes." — Xolace',
    description: 'A new chapter begins. We\'ve sent a verification code to',
    primaryColor: 'text-ocean-600',
    iconColor: 'text-purple-400',
    successMessage: 'Account verified successfully! Redirecting...',
    ctaText: 'Back to Sign In',
    ctaHref: '/sign-in',
    resendText: 'Didn\'t receive the code?',
    allowResend: true,
    resendCooldown: 600, // 10 minutes
  },
  recovery: {
    icon: KeyRound,
    title: 'Reset Your Password',
    subtitle: 'Secure password reset verification',
    description: 'We\'ve sent a verification code to',
    primaryColor: 'text-amber-500',
    iconColor: 'text-amber-400',
    successMessage: 'Code verified! Redirecting to password reset...',
    ctaText: 'Back to Sign In',
    ctaHref: '/sign-in',
    resendText: 'Need a new code?',
    allowResend: true,
    resendCooldown: 300, // 5 minutes
  },
  login: {
    icon: LogIn,
    title: 'Secure Login',
    subtitle: 'Two-factor authentication',
    description: 'Enter the verification code sent to',
    primaryColor: 'text-blue-500',
    iconColor: 'text-blue-400',
    successMessage: 'Login verified! Welcome back...',
    ctaText: 'Try Different Method',
    ctaHref: '/sign-in',
    resendText: 'Didn\'t receive the code?',
    allowResend: true,
    resendCooldown: 180, // 3 minutes
  },
};

export default function OTPVerification({ config, className = '' }: OTPVerificationProps) {
  const router = useRouter();
  const typeConfig = typeConfigs[config.type];
  const IconComponent = typeConfig.icon;

  const [countdown, setCountdown] = useState(3600); // 1 hour expiration
  const [resendCountdown, setResendCountdown] = useState(300);
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
    // Main expiration timer
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

  useEffect(() => {
    // Resend cooldown timer
    if (resendCountdown > 0) {
      const timer = setInterval(() => {
        setResendCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendCountdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = async () => {
    if (!config.resendAction || !typeConfig.allowResend) return;

    setIsLoading(true);
    setResendStatus(null);
    setVerificationStatus({ type: 'idle', message: '' });

    try {
      const result = await config.resendAction({ 
        email: config.email, 
        id: config.id,
        type: config.type
      });

      if (result.success) {
        setResendStatus({
          type: 'success',
          message: result.message || 'New verification code sent successfully!',
        });

        // Reset timers
        setCountdown(3600);
        setResendCountdown(typeConfig.resendCooldown);
        setOtpValue('');
        
        toast.success('New verification code sent!');
      } else {
        throw new Error(result.message || 'Failed to resend code');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resend code';
      setResendStatus({
        type: 'error',
        message,
      });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    if (otp.length !== 6) return;

    setIsVerifying(true);
    setVerificationStatus({ type: 'idle', message: '' });

    try {
      const result = await config.verifyAction({
        email: config.email,
        otp_code: otp,
        id: config.id,
      });

      if (result.success) {
        setVerificationStatus({
          type: 'success',
          message: typeConfig.successMessage,
        });

        toast.success(typeConfig.successMessage);

        if (config.onSuccess) {
          config.onSuccess(result);
        }

        // Redirect after successful verification
        setTimeout(() => {
          if (config.nextUrl) {
            router.push(config.nextUrl);
          }
        }, 2000);
      } else {
        //throw new Error(result.message || 'Invalid verification code');
        toast.error(result.message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid verification code';
      setVerificationStatus({
        type: 'error',
        message,
      });
      setOtpValue('');
      toast.error(message);
      
      if (config.onError) {
        config.onError(message);
      }
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
    return <Shield className={`h-5 w-5 ${typeConfig.iconColor}`} />;
  };

  const canResend = typeConfig.allowResend && 
                   config.resendAction && 
                   resendCountdown === 0 && 
                   countdown > 0 && 
                   !isLoading && 
                   verificationStatus.type !== 'success';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
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
              stroke={config.type === 'signup' ? '#8B5CF6' : config.type === 'recovery' ? '#F59E0B' : '#3B82F6'}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <motion.path
              d="M30 50 L45 65 L70 40"
              stroke={config.type === 'signup' ? '#8B5CF6' : config.type === 'recovery' ? '#F59E0B' : '#3B82F6'}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
          </motion.svg>
          <IconComponent
            className={`animate-fade-in absolute inset-0 m-auto h-12 w-12 ${typeConfig.iconColor} opacity-0`}
            style={{ animationDelay: '1.5s' }}
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
          {config.type === 'signup' && (
            <>Welcome to <span className={typeConfig.primaryColor}>Xolace</span>!</>
          )}
          {config.type !== 'signup' && typeConfig.title}
        </h1>
        
        <p className="text-sm text-gray-400 italic">
          {typeConfig.subtitle}
        </p>
        
        <p className="text-blackA11 dark:text-gray-300">
          {typeConfig.description}{' '}
          <span className="font-semibold text-indigo-500">{config.email}</span>
          {config.type === 'signup' && '.'}
          {config.type === 'recovery' && '. Enter it below to proceed with password reset.'}
          {config.type === 'login' && '. Enter it below to complete your login.'}
        </p>
      </div>

      {/* OTP Input Section */}
      <div className="space-y-4">
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
            >
              <InputOTPGroup className="gap-3">
                <InputOTPSlot 
                  index={0} 
                  className="h-10 w-10 sm:h-12 sm:w-12 text-lg font-bold border-2 border-gray-600 bg-gray-900/80 text-white hover:border-purple-400 focus:border-purple-500 focus:bg-gray-800/90 transition-all duration-200 shadow-lg backdrop-blur-sm" 
                />
                <InputOTPSlot 
                  index={1} 
                  className="h-10 w-10 sm:h-12 sm:w-12 text-lg font-bold border-2 border-gray-600 bg-gray-900/80 text-white hover:border-purple-400 focus:border-purple-500 focus:bg-gray-800/90 transition-all duration-200 shadow-lg backdrop-blur-sm" 
                />
                <InputOTPSlot 
                  index={2} 
                  className="h-10 w-10 sm:h-12 sm:w-12 text-lg font-bold border-2 border-gray-600 bg-gray-900/80 text-white hover:border-purple-400 focus:border-purple-500 focus:bg-gray-800/90 transition-all duration-200 shadow-lg backdrop-blur-sm" 
                />
              </InputOTPGroup>
              <InputOTPSeparator className="text-purple-400 mx-2" />
              <InputOTPGroup className="gap-3">
                <InputOTPSlot 
                  index={3} 
                  className="h-10 w-10 sm:h-12 sm:w-12 text-lg font-bold border-2 border-gray-600 bg-gray-900/80 text-white hover:border-purple-400 focus:border-purple-500 focus:bg-gray-800/90 transition-all duration-200 shadow-lg backdrop-blur-sm" 
                />
                <InputOTPSlot 
                  index={4} 
                  className="h-10 w-10 sm:h-12 sm:w-12 text-lg font-bold border-2 border-gray-600 bg-gray-900/80 text-white hover:border-purple-400 focus:border-purple-500 focus:bg-gray-800/90 transition-all duration-200 shadow-lg backdrop-blur-sm" 
                />
                <InputOTPSlot 
                  index={5} 
                  className="h-10 w-10 sm:h-12 sm:w-12 text-lg font-bold border-2 border-gray-600 bg-gray-900/80 text-white hover:border-purple-400 focus:border-purple-500 focus:bg-gray-800/90 transition-all duration-200 shadow-lg backdrop-blur-sm" 
                />
              </InputOTPGroup>
            </InputOTP>
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
            <span className="font-mono text-xs sm:text-sm">
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
      {typeConfig.allowResend && config.resendAction && (
        <div className="rounded-lg border border-gray-600/50 bg-gray-800/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MailCheck className={`h-4 w-4 ${typeConfig.iconColor}`} />
            <p className="text-sm text-gray-300">
              {typeConfig.resendText}
              {resendCountdown > 0 && (
                <span className="ml-2 font-mono text-purple-300">
                  ({formatTime(resendCountdown)})
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              canResend
                ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
                : 'cursor-not-allowed bg-gray-700 text-gray-500'
            }`}
          >
            {isLoading ? (
              <RotateCw className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCw className="h-4 w-4" />
            )}
            {isLoading 
              ? 'Sending...' 
              : countdown === 0 
                ? 'Code Expired' 
                : resendCountdown > 0
                  ? 'Please Wait'
                  : 'Send New Code'}
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
      )}

      {/* Footer Actions */}
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-700 dark:text-gray-500">
          PS: If the code takes unexpectedly long, don&apos;t worry our servers are just
          hot <span className="inline-block animate-pulse">♨️</span>
        </p>

        <Link
          href={urlPath(typeConfig.ctaHref)}
          className="inline-block rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-indigo-700 hover:shadow-lg"
        >
          {typeConfig.ctaText}
        </Link>
      </div>
    </div>
  );
}