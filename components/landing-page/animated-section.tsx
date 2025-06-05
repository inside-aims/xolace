'use client';
import { motion } from 'framer-motion';

export default function AnimatedSection({children, className}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: false, amount: 0.2 }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.section>
  );
}
