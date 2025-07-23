'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import Link from 'next/link';
import heroSection from '../../public/assets/images/landing-page/hero-section-img.png';

export default function HeroSection() {
  return (
    <section
      id={'hero-section'}
      className="relative flex w-full items-center justify-center overflow-hidden rounded-b-4xl bg-neutral-900 px-6 py-12 text-white md:min-h-screen md:px-12"
    >
      {/* Main Content Container */}
      <div className="relative z-10 flex w-full max-w-7xl items-start justify-center">
        {/* Image */}
        <div className="relative h-[550px] w-[400px] -translate-x-16 md:ml-[-35%] md:w-[500px]">
          <Image
            src={heroSection}
            alt="Hero Image"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="absolute inset-0 z-10 flex w-full flex-col items-center justify-center gap-8 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full"
          >
            <h1 className="text-3xl leading-tight font-extrabold uppercase md:text-5xl">
              <span className="text-ocean-500 mr-2">CONNECTING</span>
              the world&apos;s🌍 experiences—{' '}
              <span className="text-lg">so no one struggles alone</span>.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
            className="w-full"
          >
            <p className="text-md mb-4 flex w-full flex-col items-center justify-center text-gray-300 md:mb-8 md:text-xl">
              {/* <span>Share your thoughts freely without judgment.</span>
              <span>Xolace is your safe space for expression.</span> */}
              A safe, supportive space where real people share, care, and
              grow—together with mental health professionals who are part of the
              conversation, not behind a wall.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          >
            <Link
              href={'sign-up'}
              className="bg-ocean-400 hover:bg-ocean-500 rounded-full px-6 py-3 font-semibold text-white shadow-lg transition-transform duration-300 ease-in-out hover:scale-110"
            >
              Join the Community
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Curved Slope Design */}
      {/*<div className={"hidden md:flex slope-overlay"}></div>*/}
    </section>
  );
}
