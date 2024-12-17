import React from 'react';
import { motion } from 'framer-motion';

interface FilterPillsProps {
  filters: { name: string; label: string; icon: React.ReactNode }[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({ filters, activeFilter, setActiveFilter }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {filters.map((filter) => (
        <motion.button
          key={filter.name}
          className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
            activeFilter === filter.name
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveFilter(filter.name)}
        >
          {filter.icon}
          {filter.label}
        </motion.button>
      ))}
    </div>
  );
};

export default FilterPills;

