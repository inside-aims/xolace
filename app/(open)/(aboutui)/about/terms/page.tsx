'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TermsPage = () => {
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

        <p className="text-center">Terms</p>
      </div>

      <div className="px-3 lg:px-10">
        <h1 className="mb-3 font-bold">Terms Of Use ⛓️</h1>
        <p className="mb-5">
          Welcome to Xolace! While our terms of use aren&apos;t the most
          exciting reading, we&apos;ve tried to keep ours clear and
          straightforward. Here&apos;s what you need to know about using our
          service.
        </p>

        <div className="mb-5">
          <h1 className="mb-3 font-bold">How Xolace Works ⛓️</h1>
          <p className="mb-2">
            Think of Xolace as your personal canvas for self-expression and
            connection. We empower you to share your thoughts, stories, and
            funny/sad moments—whether they&apos;re meant to last or vanish after
            24 hours. With features designed for both anonymity and
            authenticity, Xolace lets you choose your level of exposure while
            engaging with a vibrant, diverse community.
          </p>

          <p>
            Our platform offers you flexible posting options: create permanent
            content that builds your personal narrative or opt for
            time-sensitive posts that capture the moment without lingering. As
            you like, comment, and interact with others, Xolace continuously
            learns and adapts, ensuring a dynamic and evolving experience
            tailored to your unique voice. <br /> <br />
            Remember, while Xolace is here to help you express yourself and
            connect with others, it is a platform for sharing personal
            perspectives and peer to peer interactions—not a substitute for
            professional advice yet, although it is the team&apos;s dream to
            provide that professional help and advice to those in need. Note
            that we are not a personal chatting platform.
          </p>

          <p className="mb-5 mt-2">
            Always use your best judgment and review your content before sharing
            it with the community. We reserve the right to remove any content
            that does not comply with our terms.
          </p>
        </div>

        <div className="mb-5">
          <h1 className="mb-3 font-bold">Working Together ⛓️</h1>
          <p>To make Xolace great for everyone, we ask that you:</p>

          <ul className="mb-3 list-disc pl-8">
            <li>Share authentic, thoughtful content</li>
            <li>Keep your account secure</li>
            <li>Engage responsibly on the platform</li>
            <li>Respect community guidelines and local regulations</li>
          </ul>

          <p>
            Together, we can make Xolace a vibrant space for self-expression and
            connection!
          </p>
        </div>

        <h1 className="mb-3 font-bold">Important Notes ⛓️</h1>
        <p>
          We want to be upfront about what Xolace can and can&apos;t do.
          We&apos;re here to help you research and plan, but can&apos;t
          guarantee:
        </p>

        <ul className="mb-3 list-disc pl-8">
          <li>
            We aren&apos;t responsible for the permanence or disappearance of
            posts.
          </li>
          <li>
            We can&apos;t guarantee that every interaction will be perfect or
            conflict-free.
          </li>
          <li>
            We don&apos;t verify the accuracy of every shared opinion or piece
            of content, tho we try our best to .
          </li>
          <li>
            We&apos;re not a professional advice platform—think of us as your
            digital stage for expression, not as a definitive source for expert
            guidance yet.
          </li>
        </ul>

        <p>
          Use Xolace to share your voice and connect, but remember to exercise
          your own judgment and take responsibility for your content.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
