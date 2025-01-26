'use client';
import { use } from 'react';

import { urlPath } from '@/utils/url-helpers';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegistrationSuccessPage(props: {
  searchParams: Promise<{ email: string }>;
}) {
  const searchParams = use(props.searchParams);
  const { email } = searchParams;

  return (
    <div className="to-bg-background flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-xl bg-white bg-opacity-10 p-8 text-center shadow-2xl backdrop-blur-lg"
      >
        <motion.svg
          className="mx-auto mb-6 h-24 w-24"
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
        </motion.svg>

        <h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
          Welcome to Xolace
        </h1>
        <p className="mb-3 text-blackA11 dark:text-gray-300">
          Your anonymous journey begins now. We&apos;ve sent a secret key to {email}.
          Activate your account and step into the realm of the unseen.
        </p>

        <p className="mb-6 text-sm text-gray-700 dark:text-gray-500">
          PS: If email takes unexpectedly long , dont worry our servers are just
          hot ♨️
        </p>

        <Link
          href={urlPath('/sign-in')}
          className="inline-block rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-indigo-700 hover:shadow-lg"
        >
          Emerge from the Shadows
        </Link>
      </motion.div>
    </div>
  );
}
