'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/utils';
import { HelpCircleIcon } from 'lucide-react';

const ChannelQuestionsCard = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger className="w-full">
          <motion.div
            className="cursor-pointer rounded-lg bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-gray-800"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <HelpCircleIcon className="mb-4 h-12 w-12 text-purple-500 dark:text-purple-400" />
            <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
              Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Find answers to common queries
            </p>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="h-[60%] w-full max-w-[95%] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-6 text-2xl font-bold">
              <span>&#128220; </span>Frequently Asked Questions
            </DialogTitle>
            <DialogDescription className="hidden">
              Everything you need to know about Xolace
            </DialogDescription>
          </DialogHeader>
          <Accordion
            type="single"
            collapsible
            className="max-h-[90%] min-h-[90%] w-full overflow-auto px-2"
          >
            {faqs.map(faq => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChannelQuestionsCard;
