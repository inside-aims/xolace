'use client'

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChannelPoliciesCard from "@/components/cards/ChannelPoliciesCard";
import ChannelQuestionsCard from "@/components/cards/ChannelQuestionsCard";
import ChannelContributionCard from "@/components/cards/ChannelContributionCard";
import ChannelAboutCard from "@/components/cards/ChannelAboutCard";
import ChannelUpdateCard from "@/components/cards/ChannelUpdateCard";
import { ImageOffIcon as MaskOffIcon, UserIcon, ShieldIcon, HelpCircleIcon, HeartIcon } from 'lucide-react';

const Channel = () => {
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { id: "about", icon: <MaskOffIcon />, component: <ChannelAboutCard /> },
    { id: "policies", icon: <ShieldIcon />, component: <ChannelPoliciesCard /> },
    { id: "questions", icon: <HelpCircleIcon />, component: <ChannelQuestionsCard /> },
    { id: "contribution", icon: <HeartIcon />, component: <ChannelContributionCard /> },
    { id: "updates", icon: <UserIcon />, component: <ChannelUpdateCard /> },
  ];

  return (
    <div className="  p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">Channel</h1>
        
        {/* Desktop view */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {tab.component}
            </motion.div>
          ))}
        </div>

        {/* Mobile view */}
        <div className="md:hidden">
          <div className="flex justify-around mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-sky-500 text-white"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {tab.icon}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tabs.find((tab) => tab.id === activeTab)?.component}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
};

export default Channel;
