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

const ChannelQuestionsCard = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger className="w-full items-start border-none">
          <motion.div
            className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 mb-10 "
            initial={{ y: 600 }}
            animate={{
              y: 0,
              transition: { duration: 0.5 },
            }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-200 dark:bg-gray-800 overflow-hidden shadow-md rounded-lg flex gap-5 p-5 items-center h-[10px] min-h-[100px] max-h-[120px] sm:h-auto">
              <div className="h-7 w-7">
                {/* <FaQuestionCircle size={30} className="text-red-400" /> */}
                <QuestionMarkCircledIcon className="dark:text-red-500 text-blue w-full h-full" />
              </div>
              <div className=" text-gray-900 dark:text-gray-100 flex flex-col items-start">
                <h1 className="text-lg font-bold uppercase">Questions</h1>
                <p className="text-gray-500">Ask, FAQs</p>
              </div>
            </div>
          </motion.div>
        </DialogTrigger>
        <DialogContent className=" text-dark-2 dark:text-white w-[95%] h-[60%]">
          <DialogHeader>
            <DialogTitle>
              <p className=" text-2xl font-bold dark:text-gray-200 pb-2">
                <span>&#128220; </span>Frequently Asked Questions
              </p>
            </DialogTitle>
          </DialogHeader>
          <p className=" text-lg text-gray-500 px-2">
            Find the right question for you
          </p>

          <Accordion
            type="single"
            collapsible
            className="w-full px-3  min-h-[90%] max-h-[90%] overflow-auto"
          >
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* <div className=" flex justify-center items-center gap-5  py-3 px-2">
              <Link
                target="_blank"
                to="https://github.com/PyCode-Camp"
                className=" h-[2rem] w-8"
              >
                <GithubIcon />
              </Link>
              <Link
                target="_blank"
                to="https://twitter.com/py_camp1"
                className=" h-[2rem] w-8"
              >
                <TwitterIcon />
              </Link>
              <Link
                target="_blank"
                to="https://www.linkedin.com/company/pycode-camp/"
                className=" h-[2rem] w-8"
              >
                <LinkedInIcon />
              </Link>
            </div> */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChannelQuestionsCard;
