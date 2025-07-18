'use client'
import React from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface SearchLoaderProps {
  title?: string
  description?: string
}

const SearchLoader = ({ title, description }: SearchLoaderProps) => {
  return (
    <AnimatePresence mode='popLayout'>
       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-8 h-8 border-2 border-[#6a71ea] border-t-transparent rounded-full"
              />
            </div>
            {title && <p className="text-gray-500 text-lg">{title}</p>}
            {description && <p className="text-gray-600 text-sm">{description}</p>}
          </div>
        </motion.div>
    </AnimatePresence>
  )
}

export default SearchLoader