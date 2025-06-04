'use client';

import Image from "next/image";
import Link from 'next/link'
import readyToSpeak from "../../public/assets/images/landing-page/ready-to-speak-img.webp"

export default function ReadyToSpeakSection() {
  return (
    <section
      id={"ready-to-speak"}
      className="relative w-full bg-neutral-900 text-white z-20 px-6 -mt-[5%] md:px-12 py-12 md:min-h-screen flex items-center justify-center overflow-hidden ">
      {/* Main Content Container */}
      <div className="relative flex items-center justify-center w-full max-w-7xl z-10">
        {/* Image */}
        <div className="relative w-[400px] md:w-[500px] h-[550px]">
          <Image
            src={readyToSpeak}
            alt="Hero Image"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="w-full absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4 gap-8">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            READY TO SPEAK YOUR MIND ?
          </h1>
          <p className="mb-4 md:mb-8 flex text-md md:text-lg w-full items-center justify-center text-gray-300 ">
            Start your journey with Xolace and discover social experiencing on your terms.
          </p>
          <Link
            href={"sign-up"}
            className="bg-ocean-400 px-6 py-3 text-white rounded-full font-semibold hover:bg-ocean-500 transition-transform duration-300 ease-in-out hover:scale-110 shadow-lg"
          >
            Start Sharing
          </Link>
        </div>
      </div>
    </section>
  )
}