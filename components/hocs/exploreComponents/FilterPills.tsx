'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { formUrlQuery, removeKeyFromQuery } from '@/lib/url';
import { filters } from '@/utils';

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
    <div className="mt-6 flex flex-wrap justify-center gap-3 w-full">
      {filters.map(filter => (
        <motion.button
          key={filter.name}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
            active === filter.name
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleTypeClick(filter.name)}
        >
          {filter.icon}
          {filter.label}
        </motion.button>
      ))}
    </div>
  );
};

export default FilterPills;
