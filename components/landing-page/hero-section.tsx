'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative w-full bg-neutral-900 text-white px-6 md:px-12 py-12 md:min-h-screen flex items-center justify-center overflow-hidden rounded-b-4xl">
      {/* Main Content Container */}
      <div className="relative flex items-start justify-center w-full max-w-7xl z-10">
        {/* Image */}
        <div className="relative w-[400px] md:w-[500px] h-[550px] -translate-x-16 md:ml-[-35%]">
          <Image
            src="/assets/images/landing-page/hero-section-img.png"
            alt="Hero Image"
            fill
            className="object-contain"
          />
        </div>

        <div className="w-full absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              <span className="text-ocean-500 mr-2">ANONYMITY</span>
              MEETS EXPRESSION
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="w-full"
          >
            <p className="flex flex-col w-full items-center justify-center text-md md:text-xl text-gray-300 ">
              <span>Share your thoughts freely without judgment.</span>
              <span>Xolace is your safe space for expression.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            <button
              className="mt-8 bg-ocean-400 px-6 py-3 text-white rounded-full font-semibold hover:bg-ocean-500 transition-transform duration-300 ease-in-out hover:scale-110 shadow-lg"
            >
              Join the Community
            </button>
          </motion.div>
        </div>
      </div>

      {/* Curved Slope Design */}
      <div className={"hidden md:flex slope-overlay"}></div>
    </section>
  );
}
