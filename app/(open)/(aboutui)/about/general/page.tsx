'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const GeneralPage = () => {
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

        <p className="text-center">General</p>
      </div>

      <div className="px-3 lg:px-10">
        <h1 className="mb-3 text-lg font-bold">Summary 📜</h1>
        <p className="mb-5">
          Xolace is an anonymous web application designed to provide a safe and
          open space for users to share their thoughts, emotions, and personal
          experiences without fear of judgment. Whether you&apos;re looking for
          support, advice, or simply a place to vent/share your funny memories,
          Xolace allows you to express yourself freely. Users can choose to sign
          in with their email or remain completely anonymous, ensuring their
          identity stays protected in both cases.
        </p>

        <div className="mb-5" id="why">
          <h1 className="mb-3 text-lg font-bold">How Xolace was Born ❗❗</h1>
          <p>
            Our journey began with a personal problem some of the team members
            have had to face in their daily lives. We realized in ourselves that
            we kept our hardships , stress , problems (however embarrassing they
            may be) bottled in and not share them with others. Partly due to the
            judgemental nature of the society we find ourselves in ( most
            strongly in Africa). It just started out as an idea to help
            ourselves but soon as we started working on it , we realized that we
            were not the only ones in this kind of situation, millions of kids &
            teens out there are probably facing even worse problems than us and
            it would be a very useful solution, not just for us , but for
            everyone. And not just as a platform to connect , laugh and share
            but as a space where we can provide actual professional advice and
            support to those who need it with no hassle or excessive costs,
            that&apos;s our dream & mission.
          </p>
        </div>

        <div className="mb-5">
          <h1 className="mb-3 text-lg font-bold">Features ⛓️</h1>
          <p className="mb-3">
            Express yourself, connect with others, and stay in control of your
            content—all in one place. With Xolace, you can:
          </p>

          <div className="mb-3 pl-8">
            <p className="mb-1">
              ✅ Share your thoughts & ideas – Post freely and engage with a
              vibrant community
            </p>
            <p className="mb-1">
              ✅ Choose your post lifespan – Keep posts permanent or let them
              expire after 24 hours
            </p>
            <p className="mb-1">
              ✅ Engage with others – Vote, comment, and interact
            </p>
            <p className="mb-1">
              ✅ Stay anonymous (if you want!) – Post without revealing your
              identity, with certain limitations
            </p>
            <p className="mb-1">
              ✅ Report & moderate content – Help maintain a respectful and safe
              community
            </p>
            <p className="mb-1">
              ✅ Explore AI-powered creativity – Use Shikigami to craft
              compelling posts with ease 🤖.{' '}
              <span className="text-sm text-gray-500">soon</span>
            </p>
          </div>

          <p>Together, we can make Sail a fantastic resource for everyone!</p>
        </div>

        <h1 className="mb-3 font-bold" id="mission">
          Our Mission 💯❗
        </h1>
        <p className="mb-2">
          We built Xolace because we know what it’s like to keep struggles,
          thoughts, and emotions bottled up—especially in a society where
          judgment can make open expression difficult. What started as a simple
          idea to help ourselves quickly became something much bigger.
        </p>

        <p className="mb-2">
          We realized that millions of people, especially young adults and
          teens, face similar challenges—seeking a space to share, connect, and
          be heard without fear. Xolace is more than just a social platform;
          it’s a community where expression is free, support is accessible, and
          real conversations happen.
        </p>

        <p className="mb-5">
          Our mission is to create a space where everyone can share their
          experiences, engage with others, and even seek professional advice—all
          without barriers or excessive costs. Whether it’s for connection,
          laughter, or support, Xolace is here to make sure no one has to go
          through life’s challenges alone. 💙✨
        </p>
      </div>

      <div className="px-3 lg:px-10">
        <h1 className="mb-3 text-lg font-bold">
          How Xolace is Making a Difference 💙
        </h1>

        <p className="mb-5">
          <span className="mb-1 block font-bold">
            {' '}
            ✔️ A Safe Space for Expression
          </span>
          Welcome to Xolace! While terms and conditions aren’t the most exciting
          reading, we’ve tried to keep ours clear and straightforward. Here’s
          what you need to know about using our service.
        </p>

        <p className="mb-5">
          <span className="mb-1 block font-bold">
            {' '}
            ✔️ Beyond Just Social Media
          </span>
          Social platforms often focus on trends and highlights, leaving little
          room for real conversations. Xolace is different. It’s a place where
          deep, meaningful discussions can happen, without fear of being
          misunderstood or dismissed.
        </p>

        <p className="mb-5">
          <span className="mb-1 block font-bold">
            {' '}
            ✔️ Support Without Barriers
          </span>
          Many people struggle in silence, unsure where to turn. With Xolace,
          not only can you connect with a supportive community, but you can also
          access real help from professionals—all without unnecessary costs or
          complications
        </p>

        <p className="mb-5">
          <span className="mb-1 block font-bold">
            {' '}
            ✔️ The Impact of Social Media on Mental Well-being
          </span>
          Social media is meant to connect us, but too often, it amplifies
          loneliness, anxiety, and unrealistic expectations. Many young adults
          and teens feel the pressure to fit in, leading to silent struggles
          with mental health. <br /> <br />
          At Xolace, we believe in breaking that cycle. Instead of just
          highlighting the best moments, we encourage real conversations—whether
          it’s sharing thoughts, seeking advice, or simply finding a space where
          you feel understood. <br /> <br />
          Here, you don’t have to pretend. Xolace is where you can be yourself,
          connect with others who truly get it, and find support when you need
          it most. 💙
        </p>
      </div>
    </div>
  );
};

export default GeneralPage;
