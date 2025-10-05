"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { HelpCircle, X} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface SupportOptionProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href?: string;
}

export default function SupportButton({
    supportOptions,
}: {
    supportOptions: SupportOptionProps[];
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    if (isOpen) {
      setIsOpen(false)
      return
    }

    setIsFlipping(true)
    setTimeout(() => {
      setIsOpen(true)
      setIsFlipping(false)
    }, 300)
  }

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Support Menu Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-16 right-0 mb-2"
          >
            <Card className="w-64 shadow-xl border-0 bg-white">
              <CardContent className="p-0">
                <div className="space-y-1 py-2">
                  {supportOptions.map((option, index) => {
                    const IconComponent = option.icon

                    // if href is avaliable then wrap button with Link
                    return option.href ?  
                    (
                        <Link href={option.href}  key={option.label}>
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors group"
                        onClick={() => {
                          setIsOpen(false)
                        }}
                      >
                        <IconComponent className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                        <span className="font-medium text-gray-700 group-hover:text-gray-900">{option.label}</span>
                      </motion.button>
                        </Link>
                    )
                    : (
                        <motion.button
                          key={option.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors group"
                          onClick={() => {
                            setIsOpen(false)
                          }}
                        >
                          <IconComponent className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                          <span className="font-medium text-gray-700 group-hover:text-gray-900">{option.label}</span>
                        </motion.button>
                      )
                  })}
                </div>
                <div className="border-t px-4 py-3">
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="secondary"
                    size="sm"
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white rounded-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    CLOSE
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Support Button */}
      <motion.div
        animate={{
          rotateY: isFlipping ? 180 : 0,
          scale: isFlipping ? 0.8 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <Button
          ref={buttonRef}
          onClick={handleClick}
          disabled={isFlipping}
          className={`
            h-12 px-4 rounded-full shadow-lg transition-all duration-200
            ${isOpen ? "bg-gray-400 hover:bg-gray-500 text-gray-600" : "bg-ocean-500 hover:bg-ocean-600 text-white"}
            ${isFlipping ? "opacity-50 cursor-not-allowed" : ""}
            md:px-6
          `}
        >
          <motion.div className="flex items-center gap-2" animate={{ opacity: isFlipping ? 0.5 : 1 }}>
            {isOpen ? <X className="h-5 w-5" /> : <HelpCircle className="h-5 w-5" />}
            <span className="hidden md:inline font-medium">{isOpen ? "Close" : "Support"}</span>
          </motion.div>
        </Button>
      </motion.div>
    </div>
  )
}
