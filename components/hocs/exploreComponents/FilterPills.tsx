'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { motion } from 'motion/react';

import { formUrlQuery, removeKeyFromQuery } from '@/lib/url';
import { filters } from '@/constants';

const FilterPills: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParams = searchParams.get('filter');
  const [active, setActive] = useState(filterParams || '');

  const handleTypeClick = (filter: string) => {
    let newUrl = '';
    if (filter === active) {
      setActive('');
      newUrl = removeKeyFromQuery({
        params: searchParams.toString(),
        keysToRemove: ['filter'],
      });
    } else {
      setActive(filter);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: filter.toLowerCase(),
      });
    }

    router.push(newUrl, {
      scroll: false,
    });
  };
  return (
    <div className="space-y-4">
      {/* Filter pills container */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {filters.map((filter) => (
          <motion.button
            key={filter.name}
            className={`group relative flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
              active === filter.name
                ? "bg-gradient-to-r from-[#0536ff] to-[#6a71ea] text-white shadow-lg shadow-[#0536ff]/25"
                : "dark:bg-gray-900/50 dark:text-gray-300 dark:border dark:border-gray-700 dark:hover:border-[#6a71ea]/50 dark:hover:text-white dark:hover:bg-gray-800/50 border border-gray-700 hover:border-[#6a71ea]/50 hover:text-white hover:bg-gradient-to-r from-ocean-400 to-lavender-400"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTypeClick(filter.name)}
          >
            {/* Glow effect for active filter */}
            {active === filter.name && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#0536ff] to-[#6a71ea] rounded-full blur-lg opacity-30 -z-10" />
            )}

            {filter.icon}
            <span className="hidden sm:inline">{filter.label}</span>

            {/* Active indicator */}
            {/* {active === filter.name && <Sparkles className="w-3 h-3 animate-pulse" />} */}
          </motion.button>
        ))}
      </div>

      {/* Active filter description */}
      {active && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-sm text-gray-400">{filters.find((f) => f.name === active)?.description}</p>
        </motion.div>
      )}
    </div>
  );
};

export default FilterPills;
