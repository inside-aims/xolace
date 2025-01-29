'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TermsPage = () => {
  const router = useRouter();
  return (
    <div className="relative px-3 pt-10 h-screen overflow-auto">
      <div className="fixed top-0 flex h-10 w-full items-center justify-center bg-black md:hidden">
        <div
          className="absolute left-4 hover:cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft />
        </div>

        <p className="text-center">Terms</p>
      </div>

      <div className="lg:px-10">
        <p className='mb-5'>
          Welcome to Sail! While terms and conditions aren’t the most exciting
          reading, we’ve tried to keep ours clear and straightforward. Here’s
          what you need to know about using our service.
        </p>

        <div className="mb-5">
          <h1 className="mb-3 font-bold">How Xolace Works</h1>
          <p>
            Think of Sail as your travel research buddy! We help you explore
            transportation options and make informed decisions about your
            journeys.
          </p>
        </div>

        <p className='mb-5'>
          While we work hard to provide helpful information, remember that we’re
          a research tool - final arrangements should be made directly with
          transportation providers.
        </p>

        <div className="mb-5">
          <h1 className="mb-3 font-bold">Working Together</h1>
          <p>To make Sail great for everyone, we ask that you:</p>

          <ul className='mb-3 list-disc pl-8'>
            <li>Share accurate information</li>
            <li>Keep your account secure</li>
            <li>Use the service thoughtfully</li>
            <li>Follow your local transportation rules</li>
          </ul>

          <p>Together, we can make Sail a fantastic resource for everyone!</p>
        </div>

        <h1 className='mb-3'>Important Notes</h1>
        <p>
          We want to be upfront about what Sail can and can’t do. We’re here to
          help you research and plan, but can’t guarantee:
        </p>

        <ul className='mb-3 list-disc pl-8'>
          <li>Specific transportation availability</li>
          <li>Price accuracy over time</li>
          <li>Service quality or timeliness</li>
          <li>Provider availability</li>
        </ul>

        <p>Think of us as a helpful guide rather than a booking service!</p>
      </div>
    </div>
  );
};

export default TermsPage;
