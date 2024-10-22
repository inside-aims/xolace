"use client";

import React from "react";
import { motion } from "framer-motion";
import { DrawingPinFilledIcon } from "@radix-ui/react-icons";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ChannelAboutCard = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger className="w-full border-none">
          <motion.div
            className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 mb-10"
            initial={{ y: 800 }}
            animate={{
              y: 0,
              transition: { duration: 0.5 },
            }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-200 dark:bg-gray-800 overflow-hidden shadow-md rounded-lg flex gap-5  items-center h-[10px] min-h-[100px] max-h-[120px] sm:h-auto">
              <div className="h-7 w-7">
                {/* <FaExclamationCircle size={30} className="text-red-500" /> */}
                <DrawingPinFilledIcon className="text-blue dark:text-red-500 w-full h-full" />
              </div>
              <div className=" text-gray-900 dark:text-gray-100 flex flex-col justify-start items-start ">
                <h1 className="text-lg font-bold uppercase">
                  About Xolace | Beta
                </h1>
                <p className="text-gray-500">Find out more about xolace</p>
              </div>
            </div>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="overflow-y-scroll h-[60vh] w-[95%] text-dark-2 dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-center mb-3">
              <p className=" text-2xl font-semibold uppercase dark:text-white text-black mb-2">
                Xolace | Beta
              </p>
              <p className=" text-xl capitalize font font-semibold dark:text-gray-400 text-slate-900/80">
                Introducing Xolace: Where Stories Unfold in Shadows{" "}
                <span>&#x1F512;</span>
                <span>&#x1F311;</span>
              </p>
            </DialogTitle>
          </DialogHeader>
          <div className=" dark:text-slate-300 text-gray-900/90">
            <p className=" pb-3">
              Step into a realm where anonymity begets raw honesty and boundless
              freedom. Welcome to Xolace, the captivating new platform that
              embraces the human experience in all its shades of light and dark{" "}
              <span>&#x1F30C;</span>. Here, you can unburden your soul, sharing
              your deepest secrets, personal struggles, or humorous tales
              without fear of judgment or exposure <span>&#x1F4AC;</span>.
            </p>
            <p>
              Each story finds solace in the collective whispers of fellow
              users, hidden behind the veil of anonymity <span>&#x1F3AD;</span>.
              Xolace cultivates a safe space, inviting you to express yourself
              authentically and connect with a community that understands and
              supports you <span>&#x1F49C;</span>. Embark on a journey of
              self-discovery, where tales unfold, emotions intertwine, and the
              human spirit finds solace in shared experiences. Join Xolace today
              and let your stories illuminate the shadows.
              <span>&#x1F512;</span>
            </p>
            <p className="py-3">
              <span className=" font-bold text-black">NB: </span> In this early
              phase of Xolace, we welcome you to a world of sharing and
              connection. As we navigate through limited functionalities, we
              kindly ask for your patience. Your valuable feedback will be our
              guiding light, illuminating the path towards an enhanced
              experience <span>&#x270F;&#xFE0F;&#x200D;&#x1F4F0;</span>.
              Together, lets shape the future of Xolace and create a space where
              stories thrive.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChannelAboutCard;
