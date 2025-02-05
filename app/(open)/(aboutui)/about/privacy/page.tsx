'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PrivacyPage = () => {
  const router = useRouter();
  return (
    <div className="relative pt-14">
      <div className="fixed top-0 flex h-10 w-full items-center justify-center bg-white dark:bg-black md:hidden">
        <div
          className="absolute left-4 hover:cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft />
        </div>

        <p className="text-center">Privacy</p>
      </div>

      <div className="px-3 lg:px-10">
        <h1 className="mb-3 font-bold">Privacy Policy</h1>
        <p className="mb-5">
          At Xolace, user privacy is our top priority. We are committed to
          protecting your personal information and ensuring anonymity for those
          who choose to remain unidentified
        </p>

        <div className="mb-5">
          <h1 className="mb-2 font-bold">
            Data Collection & How We Handle Data ⛓️
          </h1>
          <p className="mb-3">
            We keep data collection minimal and straightforward. Here&apos;s
            what we use to make Xolace work for you:
          </p>

          <ul className="mb-3 list-disc pl-8">
            <li>
              Anonymous Posting: If you sign in anonymously, no personally
              identifiable information (PII) is stored or linked to your posts.
            </li>
            <li>
              mail Sign-in: If you choose to sign in with an email, your
              credentials are securely stored and used solely for authentication
              purposes. Your identity remains private from other users.
            </li>
            <li>
              Data Encryption: All data transmitted through Xolace is encrypted
              to prevent unauthorized access.
            </li>
            <li>
              No Third-Party Sharing: We do not sell, share, or distribute user
              data to third parties.
            </li>
            <li>
              Cookies & Tracking: We may use cookies for site functionality but
              do not track user activity beyond Xolace.
            </li>
          </ul>

          <p className="mt-2">
            Whenever possible, we process and store your information locally in
            your browser or in a secure manner. Simple, private, and secure—just
            the way you like it on Xolace!
          </p>
        </div>

        <p className="mb-5">
          For further details, please review our full Privacy Policy on our
          <Link href="/policy" className='ml-2 hover:underline text-sky-400'>Policy page</Link>.
        </p>

      </div>
    </div>
  );
};

export default PrivacyPage;
