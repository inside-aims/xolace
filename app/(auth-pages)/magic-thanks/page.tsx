'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState, use } from 'react';

import { FORM_TYPES } from '@/constants';
import { urlPath } from '@/utils/url-helpers';

const MagicLinkSuccessPage = (props: {
  searchParams: Promise<{ type: string }>;
}) => {
  const searchParams = use(props.searchParams);
  const { type } = searchParams;
  const isPasswordRecovery = type === FORM_TYPES.PASSWORD_RECOVERY;

  // states
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="to-bg-background flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-xl bg-white bg-opacity-10 p-8 text-center shadow-2xl backdrop-blur-lg"
      >
        <motion.div
          className="relative mx-auto mb-6 h-24 w-24"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#6366F1"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="70 200"
            />
          </svg>
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            🪄
          </motion.div>
        </motion.div>

        <h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
          {isPasswordRecovery ? 'Password Reset' : 'Magic Link'} Conjured!
        </h1>
        <p className="mb-6 text-blackA11 dark:text-gray-300">
          {isPasswordRecovery
            ? 'A mystical link to reset your password has been dispatched to your inbox.'
            : 'A clandestine link for secure access has been whispered into the digital ether.'}
        </p>
        <p className="mb-6 text-sm text-gray-700 dark:text-gray-500">
          Check your email and follow the secret path within. The portal closes
          in {timeLeft} seconds...
        </p>

        <Link
          href={urlPath('/sign-in')}
          className="inline-block rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-indigo-700 hover:shadow-lg"
        >
          Return to Xolace
        </Link>
      </motion.div>
    </div>
  );
};

export default MagicLinkSuccessPage;
