'use client';
import { use, useState, useEffect } from 'react';

import { urlPath } from '@/utils/url-helpers';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MailCheck, RotateCw, MessageCircle, Info } from 'lucide-react';
import SupportButton from '@/components/shared/support-button';

const supportOptions = [
    {
        icon: MessageCircle,
        label: "@ xolace25@gmail.com",
    },
    {
        icon: Info,
        label: "About us",
        href: "/about",
    }
]

export default function RegistrationSuccessPage(props: {
  searchParams: Promise<{ email: string; id: string }>;
}) {
  const searchParams = use(props.searchParams);
  const { email, id } = searchParams;

  const [countdown, setCountdown] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResend = async () => {
    if (!email) return;
    
    setIsLoading(true);
    setResendStatus(null);
    
    try {
      const response = await fetch('/api/v1/auth/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, id }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend email');
      }
      
      setResendStatus({
        type: 'success',
        message: 'Verification email resent successfully!'
      });
      
      // Reset the countdown
      setCanResend(false);
      setCountdown(120);
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      setResendStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
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
              stroke="#4CAF50"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <motion.path
              d="M30 50 L45 65 L70 40"
              stroke="#4CAF50"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
            {/* User silhouette inside the circle */}
            {/* <circle cx="50" cy="40" r="6" fill="#4CAF50" />
          <path
            d="M40 60 Q50 50 60 60"
            fill="none"
            stroke="#4CAF50"
            strokeWidth="5"
            strokeLinecap="round"
          /> */}
          </motion.svg>
          <MailCheck
            className="animate-fade-in absolute inset-0 m-auto h-12 w-12 text-green-400 opacity-0"
            style={{ animationDelay: '1.5s' }}
          />
        </div>

        <h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
          Welcome to <span className="text-ocean-600">Xolace</span>!
        </h1>
        <p className="mb-4 text-sm text-gray-400 italic">
          “Sometimes the quietest voices have the loudest echoes.” — Xolace
        </p>
        <p className="text-blackA11 mb-3 dark:text-gray-300">
          A new chapter begins. We&apos;ve sent a secret key to{' '}
          <span className="font-semibold text-indigo-500">{email}</span>. Check
          your inbox to activate your space in this community of untold stories
          and healing.
        </p>

        <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
          <p className="text-sm text-gray-400 dark:text-gray-300">
            {canResend ? (
              'Ready to resend?'
            ) : (
              <>
                Resend available in{' '}
                <span className="text-purple-300">{countdown}s</span>
              </>
            )}
          </p>
          <button
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className={`mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              canResend && !isLoading
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <RotateCw className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCw
                className={`h-4 w-4 ${canResend && 'animate-spin-once'}`}
              />
            )}
            {isLoading ? 'Sending...' : 'Resend Email'}
          </button>

          {resendStatus && (
            <p className={`mt-2 text-sm ${
              resendStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {resendStatus.message}
            </p>
          )}
        </div>

        <p className="mb-6 text-sm text-gray-700 dark:text-gray-500">
          PS: If email takes unexpectedly long , dont worry our servers are just
          hot <span className="inline-block animate-pulse">♨️</span>
        </p>

        <Link
          href={urlPath('/sign-in')}
          className="inline-block rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-indigo-700 hover:shadow-lg"
        >
          Emerge from the Shadows
        </Link>
      </motion.div>

       {/* Floating Support Button */}
      <SupportButton supportOptions={supportOptions}/>
    </div>
  );
}
