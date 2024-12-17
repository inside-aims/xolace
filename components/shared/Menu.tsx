"use client";

import React, { Dispatch, SetStateAction } from "react";
import { navLinks } from "@/constants";
import ResponsiveNavLink from "./ResponsiveNavLinks";
import { motion } from "framer-motion";
import { useUserState } from "@/lib/store/user";
import { usePathname } from "next/navigation";

export function Menu({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const path = usePathname();
  console.log(path);
  const user = useUserState((state) => state.user);
  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <motion.div
      initial={{
        scale: 0,
        opacity: 0,
        x: "-50%",
        y: "-50%",
      }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        ease: "easeInOut",
        duration: 0.5,
      }}
      className="w-[70vw] flex flex-col items-center justify-center gap-5 fixed bg-gray-900/90 dark:bg-gray-200 rounded-xl backdrop-blur-md left-[50%] top-[50%] z-30 py-12"
    >
      <div className="flex flex-col justify-center items-center gap-5 dark:text-dark-3 text-white">
        <div className="font-medium text-base dark:text-gray-800 text-gray-200">
          <span>&#128526; </span>
          {user?.username}
        </div>
        {navLinks.map((link) => (
          <ResponsiveNavLink
          active={link.route === path}
            onclick={handleClick}
            key={link.route}
            href={link.route}
            className=""
          >
            {link.label}
          </ResponsiveNavLink>
        ))}
      </div>
    </motion.div>
  );
}

// <li className="font-medium text-base dark:text-gray-800 text-gray-200">
//                 <span>&#128526; </span>
//                 name
//         </li>
//         <li className="text-background font-bold text-2xl transform origin-left">
//           Portfolio
//         </li>
//         <li className="text-background font-bold text-2xl transform origin-left">
//           About
//         </li>
//         <li className="text-background font-bold text-2xl transform origin-left">
//           Contact
//         </li>
//         <li className="text-background font-bold text-2xl transform origin-left">
//           Search
//         </li>
//   menu fixed top-0 left-0 bottom-0 w-400 bg-blue transform -translate-x-full
