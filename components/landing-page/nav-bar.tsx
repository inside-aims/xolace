'use client'

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: "Home", href: "#", current: true },
  { name: "Why Xolace", href: "#why-xolace", current: false },
  { name: "How It Works", href: "#how-it-works", current: false },
  { name: "Contact Us", href: "#contact", current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="px-0 md:px-[5%] fixed top-0 z-70 left-0 w-full bg-neutral-900 text-white shadow-lg">
      <div
        className="relative max-w-7xl mx-auto w-full py-3 md:py-4 flex items-center justify-end md:justify-center border-b border-neutral-800 rounded-none md:rounded-b-3xl bg-neutral-950">
        <p className={"absolute left-4 text-lavender-500 "}>
          Xolace.app
        </p>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10 font-semibold">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? "text-white"
                  : "text-gray-300 hover:text-white transition",
                "uppercase"
              )}
            >
              {item.name}
            </a>
          ))}
          <Link
            href={'/sign-in'}
            className="bg-ocean-400 text-white px-4 py-2 rounded-full hover:bg-ocean-500 transition-transform duration-300 ease-in-out hover:scale-110"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="w-6 h-6 text-white"/>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-opacity-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed top-0 left-0 w-full bg-gray-900 p-6 shadow-lg z-50"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold"></span>
                <button onClick={() => setIsOpen(false)} className="text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-8 flex flex-col space-y-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-white text-lg hover:text-gray-300"
                  >
                    {item.name}
                  </a>
                ))}
                <a
                  href="#"
                  className="bg-ocean-400 hover:bg-lavender-800 text-center text-white px-4 py-2 rounded-full hover:bg-ocean-500 transition-transform duration-300 ease-in-out hover:scale-110"
                >
                  Get Started
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
