// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { RocketIcon } from '@radix-ui/react-icons';
// import Link from 'next/link';
import React from 'react';
// import XolaceBetaBadge from '@/components/shared/XolaceBetaBadge';
// import xolaceImage from "../public/assets/images/xolace-1.png"
import WhyXolaceSection from "@/components/landing-page/why-xolace";
import HowItWorksSection from "@/components/landing-page/how-it-works";
import ReadyToSpeakSection from "@/components/landing-page/ready-to-speak";
import HeroSection from "@/components/landing-page/hero-section";
import {NavBar} from "@/components/landing-page/nav-bar";

export default async function Index() {
  return (
    <>
      <main className={"flex items-start justify-start w-full overflow-x-hidden min-h-screen mx-0"}>
        <div className="flex items-start justify-start w-full flex-col ">
          <NavBar/>
          <HeroSection/>
          <WhyXolaceSection/>
          <HowItWorksSection/>
          <ReadyToSpeakSection/>
        </div>
      </main>
    </>
  );
}


