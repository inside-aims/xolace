"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  HeartIcon,
  MailPlusIcon,
  HandCoins,
  MessageSquareReply,
  Contact,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { KvngSheet } from "../shared/KvngSheet";
import { MailPlus } from "lucide-react";
import FeedbackForm from "../forms/FeedbackForm";

const ChannelContributionCard = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger className="w-full">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <HeartIcon className="w-12 h-12 mb-4 text-red-500 dark:text-red-400" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
              Contribution
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Support our mission
            </p>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              🤝🏽 Support Xolace
            </DialogTitle>
            <DialogDescription className="hidden">
              Everything you need to know about Xolace
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <HandCoins size={18} strokeWidth={1.25} className="mr-2" />
                Donate
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Help us keep Xolace running and improving.
              </p>
              <Button variant="outline">Make a Donation</Button>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <MessageSquareReply
                  size={18}
                  strokeWidth={1.25}
                  className="mr-2"
                />
                Feedback
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
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
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Contact size={18} strokeWidth={1.25} className="mr-2" />
                Contact Us
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Get in touch with our team.
              </p>
              <a
                href="mailto:support@xolace.com"
                className="flex items-center text-blue-500 hover:underline"
              >
                <MailPlusIcon className="w-5 h-5 mr-2" />
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
