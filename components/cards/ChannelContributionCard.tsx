'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
import { KvngSheet } from '../shared/KvngSheet';
import FeedbackForm from '../forms/FeedbackForm';

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
        <DialogContent className="w-full max-w-[27rem] sm:max-w-md">
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
                Donate
              </h3>
              <p className="mb-2 text-gray-600 dark:text-gray-300">
                Help us keep Xolace running and improving.
              </p>
              <Button variant="outline">Make a Donation</Button>
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
                href="mailto:support@xolace.com"
                className="text-blue-500 flex items-center hover:underline"
              >
                <MailPlusIcon className="mr-2 h-5 w-5" />
                Email Us
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChannelContributionCard;
