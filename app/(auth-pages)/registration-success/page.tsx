"use client"

import { urlPath } from "@/utils/url-helpers";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegistrationSuccessPage({ searchParams }: { searchParams: { email: string } }) {
  const { email } = searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-bg-background flex items-center justify-center p-4">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full backdrop-blur-lg bg-white bg-opacity-10 p-8 rounded-xl shadow-2xl text-center"
    >
      <motion.svg
        className="w-24 h-24 mx-auto mb-6"
        viewBox="0 0 100 100"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
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

      <h1 className="text-3xl font-bold mb-4 dark:text-white text-black">Welcome to Xolace</h1>
      <p className="dark:text-gray-300 text-blackA11 mb-3">
        Your anonymous journey begins now. We've sent a secret key to {email}. 
        Activate your account and step into the realm of the unseen.
      </p>

      <p className="text-sm mb-6 dark:text-gray-500 text-gray-700">
        PS: If email takes unexpectedly long , dont worry our servers are just hot ♨️
      </p>

      <Link 
        href={urlPath("/sign-in")}
        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:scale-105"
      >
        Emerge from the Shadows
      </Link>
    </motion.div>
    </div>
  );
}
