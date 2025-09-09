'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import {
  HeartIcon,
  MailPlusIcon,
  HandCoins,
  MessageSquareReply,
  Contact,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';

import WhatsApp from '../icons/IconWhatsApp';
import LightInstagram from '../icons/IconLightInstagram';
import DarkInstagram from '../icons/IconDarkInstagram';
import LightXformerlyTwitter from '../icons/IconLightX';
import DarkXformerlyTwitter from '../icons/IconDarkX';
//import { KvngSheet } from '../shared/KvngSheet';
//import FeedbackForm from '../forms/FeedbackForm';

const KvngSheet = dynamic(
  () => import('../shared/KvngSheet').then(mod => mod.KvngSheet),
  {
    ssr: false,
  },
);

const FeedbackForm = dynamic(() => import('../forms/FeedbackForm'), {
  ssr: false,
});

const ChannelContributionCard = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger className="w-full">
          <motion.div
            className="cursor-pointer rounded-lg bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-gray-800"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <HeartIcon className="mb-4 h-12 w-12 text-red-500 dark:text-red-400" />
            <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
              Contribution
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Support our mission
            </p>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[95%] sm:max-w-md border-none rounded-2xl!">
          <DialogHeader>
            <DialogTitle className="mb-4 text-2xl font-bold">
              🤝🏽 Support Xolace
            </DialogTitle>
            <DialogDescription className="hidden">
              Everything you need to know about Xolace
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 flex items-center text-lg font-semibold">
                <HandCoins size={18} strokeWidth={1.25} className="mr-2" />
                Donate To Xolace Foundation
              </h3>
              <p className="mb-2 text-gray-600 dark:text-gray-300">
                Help us keep Xolace running and improving.
              </p>
              <Button disabled variant="outline">Make a Donation (coming soon)</Button>
            </div>
            <div>
              <h3 className="mb-2 flex items-center text-lg font-semibold">
                <MessageSquareReply
                  size={18}
                  strokeWidth={1.25}
                  className="mr-2"
                />
                Feedback
              </h3>
              <p className="mb-2 text-gray-600 dark:text-gray-300">
                Share your thoughts and ideas with us.
              </p>
              <KvngSheet
                title="Feedback"
                description="Provide your valuable feedback to the team"
              >
                <FeedbackForm />
              </KvngSheet>
            </div>
            <div>
              <h3 className="mb-2 flex items-center text-lg font-semibold">
                <Contact size={18} strokeWidth={1.25} className="mr-2" />
                Contact Us
              </h3>
              <p className="mb-2 text-gray-600 dark:text-gray-300">
                Get in touch with our team.
              </p>
              <a
                href="mailto:xolace25@gmail.com"
                className="flex items-center text-blue-500 hover:underline"
              >
                <MailPlusIcon className="mr-2 h-5 w-5" />
                Email Us
              </a>
            </div>

            <div>
              <p className='mb-2 text-lg font-semibold'>Media Outlets</p>
             <div className='flex items-center gap-4'>
             <Link href="https://wa.me/2348166666666">
                <WhatsApp className='h-8 w-8'/>
              </Link>
              <Link className='dark:hidden' href="https://www.instagram.com/xolaceinc/">
                <LightInstagram className='h-7 w-7'/>
              </Link>
              <Link className='hidden dark:block' href="https://www.instagram.com/xolaceinc/">
                <DarkInstagram className='h-7 w-7'/>
              </Link>
              <Link className='dark:hidden' href="https://x.com/xolaceinc">
                <LightXformerlyTwitter className='h-6 w-6'/>
              </Link>
              <Link className='hidden dark:block' href="https://x.com/xolaceinc">
                <DarkXformerlyTwitter className='h-6 w-6'/>
              </Link>
             </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChannelContributionCard;
