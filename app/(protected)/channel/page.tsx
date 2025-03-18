'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChannelPoliciesCard from '@/components/cards/ChannelPoliciesCard';
import ChannelQuestionsCard from '@/components/cards/ChannelQuestionsCard';
import ChannelContributionCard from '@/components/cards/ChannelContributionCard';
import ChannelAboutCard from '@/components/cards/ChannelAboutCard';
import ChannelUpdateCard from '@/components/cards/ChannelUpdateCard';
import {
  ImageOffIcon as MaskOffIcon,
  UserIcon,
  ShieldIcon,
  HelpCircleIcon,
  HeartIcon,
} from 'lucide-react';

const Channel = () => {
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', icon: <MaskOffIcon />, component: <ChannelAboutCard /> },
    {
      id: 'policies',
      icon: <ShieldIcon />,
      component: <ChannelPoliciesCard />,
    },
    {
      id: 'questions',
      icon: <HelpCircleIcon />,
      component: <ChannelQuestionsCard />,
    },
    {
      id: 'contribution',
      icon: <HeartIcon />,
      component: <ChannelContributionCard />,
    },
    { id: 'updates', icon: <UserIcon />, component: <ChannelUpdateCard /> },
  ];

  return (
    <div className=" w-full p-5 md:p-8">
      <div>
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-800 dark:text-gray-100">
          Channel
        </h1>

        {/* Desktop view */}
        <div className="hidden grid-cols-1 gap-6 md:grid md:grid-cols-2 lg:grid-cols-2">
          {tabs.map(tab => (
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
          <div className="mb-4 flex justify-around rounded-lg bg-white p-2 shadow-md dark:bg-gray-800">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md p-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-sky-500 text-white'
                    : 'text-gray-600 dark:text-gray-300'
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
              {tabs.find(tab => tab.id === activeTab)?.component}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Channel;
