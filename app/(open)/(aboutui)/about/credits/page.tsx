'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CreditsPage = () => {
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

        <p className="text-center">Credits</p>
      </div>

      <div className="px-3 lg:px-10">
        <h1 className="mb-3 font-bold">Our Team 🧑‍🔬</h1>
        <p className="mb-5">
          Xolace is brought to you by a passionate team of developers,
          designers, community builders, and creative thinkers. We&apos;re
          dedicated to crafting a platform where every voice finds its space—a
          digital canvas for genuine self-expression and meaningful connection.
          From late-night coding marathons to design brainstorming sessions,
          we&apos;re all in, working together to make Xolace a vibrant,
          inclusive community for everyone.
        </p>

        <div className="mb-5">
          <h1 className="mb-3 font-bold">Tech behind Xolace ⛓️</h1>
          <p className="mb-2">
            We&apos;ve built Xolace using cutting-edge technology to create a
            seamless and engaging experience(though we can&apos;t disclose all
            the magic behind it):
          </p>

          <ul className="mb-3 list-disc pl-8">
            <li>Next.js for a dynamic, high-performance interface</li>
            <li>PostgreSQL for secure, scalable data management</li>
            <li>TypeScript for robust and maintainable code</li>
            <li>
              AI & Real-Time Updates to keep your feed fresh and interactive
            </li>
          </ul>

          <p className="mb-2">
            We&apos;re constantly evolving and integrating new innovations to
            make Xolace even better!
          </p>
        </div>

        <div className="mb-5">
          <h1 className="mb-3 font-bold">Open Source Love ❤️</h1>
          <p className="mb-2">
            We&apos;re proud to build Xolace on the shoulders of giants! Xolace
            leverages these amazing open-source technologies to create a
            seamless and engaging social experience:
          </p>

          <ul className="mb-3 list-disc pl-8">
            <li>
              Next.js (MIT License) – For a fast, scalable, and dynamic web
              experience
            </li>
            <li>
              PostgreSQL (PostgreSQL License) – For secure, scalable data
              management
            </li>
            <li>
              Lucide Icons (MIT License) – Clean and stylish icons for a modern
              UI
            </li>
            <li>And other trade secrets 🤫</li>
          </ul>

          <p className="mb-2">
            A huge shoutout to the incredible developers behind these tools—your
            contributions make platforms like Xolace possible. Open-source FTW!
            🚀
          </p>
        </div>

        <div className="mb-5">
          <h1 className="mb-3 font-bold">Licensing 💳</h1>
          <p className="mb-2">
            Xolace respects all software licenses and ensures compliance with
            open-source and proprietary agreements. Any third-party assets used
            are properly credited.
          </p>

          <p className='mb-2'>
            If you believe any content on Xolace infringes on copyright or
            licensing terms, please reach out to us for resolution.
          </p>
        </div>

        <h1 className="mb-3 font-bold">Service Trade ⛓️</h1>
        <p className="mb-5">
          The communities and conversations on Xolace are powered by incredible
          users! While Xolace provides the platform, the content, discussions,
          and interactions belong to their respective creators. We simply help
          connect voices, ideas, and stories in a meaningful way. A big thanks
          to our amazing users for making Xolace a vibrant and engaging space
          for everyone! 🚀✨
        </p>

        <h1 className="mb-3 font-bold">Thank You!</h1>
        <p className="mb-2">
          A huge thanks to everyone who has helped make Xolace better:
        </p>
        <ul className="mb-5 list-disc pl-8">
          <li>
            Our amazing users for sharing their thoughts, stories, and
            creativity
          </li>
          <li>
            The open-source community for providing the incredible tools that
            power Xolace
          </li>
          <li>
            Early adopters who believed in our vision and helped shape the
            platform
          </li>
          <li>
            Everyone who&apos;s given feedback, suggestions, and reported
            bugs—your input makes Xolace stronger every day
          </li>
        </ul>

        <p>
          Xolace is what it is because of you, and we couldn&apos;t do it
          without this incredible community. Thank you for being part of the
          journey! 🚀💙
        </p>
      </div>
    </div>
  );
};

export default CreditsPage;
