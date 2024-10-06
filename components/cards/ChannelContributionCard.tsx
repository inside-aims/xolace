"use client";

import React from "react";
import { motion } from "framer-motion";
import { GearIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ChannelContributionCard = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger className="w-full">
          <motion.div
            className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 mb-10"
            initial={{ y: 700 }}
            animate={{
              y: 0,
              transition: { duration: 0.5 },
            }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-200 dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg flex gap-5 p-5 items-center h-[10px] min-h-[100px] max-h-[120px] sm:h-auto">
              <div className=" h-7 w-7">
                {/* <FaQuestionCircle size={30} className="text-red-400" /> */}
                <GearIcon className="text-red-500  w-full h-full" />
              </div>
              <div className=" text-gray-900 dark:text-gray-100 flex flex-col items-start">
                <h1 className="text-lg font-bold uppercase">Contribution</h1>
                <p className="text-gray-500">
                  <span className=" max-sm:hidden">Want to sponser? ,</span>{" "}
                  Want to Donate ?
                </p>
              </div>
            </div>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="text-dark-2 dark:text-white w-[95%]">
          <DialogHeader>
            <DialogTitle>
              <p className=" text-2xl font-bold dark:text-gray-200 pb-2 text-center uppercase">
                <span>&#128220; </span>Contribution
              </p>
            </DialogTitle>
          </DialogHeader>
          <div>
            <p className=" text-lg text-gray-500 p-2">
              <span className="emoji">&#x1F4B0;</span> To sponser or donate to
              the Pycode team{" "}
            </p>
            <p className="p-2 dark:text-gray-300">
              <span className="emoji">&#x1F4F2;</span>Send to :{" "}
              <span>0558218741</span>
            </p>
          </div>

          <div className="py-2">
            <div className="font-bold uppercase text-lg dark:text-gray-200 py-2">
              <span>&#x1F468;&#x200D;&#x1F4BB; </span>
              Technical Support
            </div>
            <div className="px-2 mb-4">
              <p className="dark:text-gray-400 mb-2">
                <span className="emoji">&#x1F9A0;</span>Found a bug ?
              </p>
              <p className=" dark:text-gray-400">
                <span>&#x1F680;</span>Want to contribute to adding a new feature
                ?
              </p>
            </div>
            <div className=" flex justify-center items-center ">
              <a
                href="mailto:lead@xolace.online?subject=Regarding%20your%20app"
                target={"_blank"}
              >
                {/* <FaGoogle size={30} className="text-red-500" /> */}G
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChannelContributionCard;
