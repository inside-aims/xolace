"use client";

import React from "react";
import { motion } from "framer-motion";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/constants";
import { HelpCircleIcon } from "lucide-react";

const ChannelQuestionsCard = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger className="w-full">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <HelpCircleIcon className="w-12 h-12 mb-4 text-purple-500 dark:text-purple-400" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
              Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Find answers to common queries
            </p>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="max-w-md w-full h-[60%]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-6">
              <span>&#128220; </span>Frequently Asked Questions
            </DialogTitle>
            <DialogDescription className="hidden">
              Everything you need to know about Xolace
            </DialogDescription>
          </DialogHeader>
          <Accordion
            type="single"
            collapsible
            className="w-full px-3 min-h-[90%] max-h-[90%] overflow-auto"
          >
            {faqs.map((faq) => (
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
