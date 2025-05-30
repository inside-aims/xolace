'use client'

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  { name: "Home", href: "hero-section" },
  { name: "Why Xolace", href: "why-xolace" },
  { name: "How It Works", href: "how-it-works" },
  { name: "Contact Us", href: "contact-us" },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [current, setCurrent] = useState<string>('hero-section')

  const scrollToAction = (sectionName: string) => {
    const section = document.getElementById(sectionName)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      setCurrent(sectionName)
      setIsOpen(false)
    }
  }

  //  Listen to scroll and update `current` based on visible section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrent(entry.target.id)
          }
        })
      },
      { threshold: 0.6 }
    )

    navigation.forEach(({ href }) => {
      const section = document.getElementById(href)
      if (section) {
        observer.observe(section)
      }
    })

    return () => {
      navigation.forEach(({ href }) => {
        const section = document.getElementById(href)
        if (section) {
          observer.unobserve(section)
        }
      })
    }
  }, [])

  return (
    <header className="px-0 md:px-[5%] fixed top-0 z-70 left-0 w-full bg-neutral-900 text-white shadow-lg">
      <div className="relative max-w-7xl mx-auto w-full py-3 md:py-4 flex items-center justify-end md:justify-center border-b border-neutral-800 rounded-none md:rounded-b-3xl bg-neutral-950">
        <p className="absolute left-4 text-lavender-500">Xolace.app</p>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10 font-semibold">
          {navigation.map((item) => (
            <a
              key={item.name}
              onClick={() => scrollToAction(item.href)}
              className={classNames(
                current === item.href
                  ? "text-lavender-500"
                  : "text-gray-300 hover:text-white transition",
                "uppercase cursor-pointer"
              )}
            >
              {item.name}
            </a>
          ))}
          <Link
            href={"/sign-up"}
            className="bg-ocean-400 text-white px-4 py-2 rounded-full hover:bg-ocean-500 transition-transform duration-300 ease-in-out hover:scale-110"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(true)}>
          <Menu className="w-6 h-6 text-white" />
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
                    onClick={() => scrollToAction(item.href)}
                    className={classNames(
                      current === item.href
                        ? "text-lavender-500"
                        : "text-white hover:text-gray-300",
                      "text-lg cursor-pointer"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
                <Link
                  href={"/sign-up"}
                  className="bg-ocean-400 hover:bg-lavender-800 text-center text-white px-4 py-2 rounded-full hover:bg-ocean-500 transition-transform duration-300 ease-in-out hover:scale-110"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
