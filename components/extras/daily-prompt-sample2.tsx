"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Flame, Sparkles, Send, X } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Dummy data for prompts
const dummyPrompts = [
  {
    id: 1,
    text: "What's something you've always wanted to say but never did?",
    date: "Today",
    responses: 42,
  },
  {
    id: 2,
    text: "Describe a moment that changed how you see the world.",
    date: "Yesterday",
    responses: 38,
  },
  {
    id: 3,
    text: "What small joy made you smile this week?",
    date: "2 days ago",
    responses: 56,
  },
  {
    id: 4,
    text: "If you could give your younger self one piece of advice, what would it be?",
    date: "3 days ago",
    responses: 61,
  },
]

export default function DailyPrompt({ onNewPost }: { onNewPost?: (content: string) => void }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showResponseForm, setShowResponseForm] = useState(false)
  const [responseText, setResponseText] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentPrompt = dummyPrompts[0]
  const streakCount = 3

  const handleSubmitResponse = () => {
    if (responseText.trim()) {
      // If onNewPost callback is provided, call it with the response text
      if (onNewPost) {
        onNewPost(`${currentPrompt.text}\n\nMy response: ${responseText}`)
      }

      setResponseText("")
      setShowResponseForm(false)
    }
  }

  return (
    <div className="w-full mb-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-[#f0c4ff] to-[#a5f3fc] dark:from-[#2a0942] dark:to-[#164e63] relative daily-prompt-glow">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-medium text-purple-700 dark:text-purple-300">Daily Prompt</h3>
              </div>

              <div className="flex items-center gap-2 bg-white/30 dark:bg-black/30 px-3 py-1 rounded-full">
                <Flame className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium">Streak: {streakCount} days</span>
              </div>
            </div>

            <CardContent className="pt-0 pb-4">
              <div className="mb-4 bg-white/40 dark:bg-black/40 p-4 rounded-xl backdrop-blur-sm">
                <p className="text-xl font-medium leading-relaxed text-gray-800 dark:text-gray-100">
                  {currentPrompt.text}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowResponseForm(true)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Respond
                </Button>

                <Button
                  variant="outline"
                  className="bg-white/50 dark:bg-black/50 border-purple-300 dark:border-purple-800 hover:bg-white/70 dark:hover:bg-black/70"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>

              {/* Response form */}
              <AnimatePresence>
                {showResponseForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <div className="bg-white/50 dark:bg-black/50 p-4 rounded-xl backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Your Response</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowResponseForm(false)}
                          className="h-6 w-6"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <textarea
                        ref={textareaRef}
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Write your thoughts..."
                        className="w-full p-3 border rounded-md bg-white/70 dark:bg-black/70 dark:text-white border-purple-200 dark:border-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          onClick={handleSubmitResponse}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          disabled={!responseText.trim()}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Post Response
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expandable past prompts */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-3"
                  >
                    {dummyPrompts.slice(1).map((prompt) => (
                      <div key={prompt.id} className="p-3 bg-white/30 dark:bg-black/30 rounded-lg backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{prompt.date}</p>
                          <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full">
                            {prompt.responses} responses
                          </span>
                        </div>
                        <p className="font-medium">{prompt.text}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/20"
                        >
                          View Responses
                        </Button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>

            <CardFooter className="border-t border-purple-200/50 dark:border-purple-800/30 pt-3 pb-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="daily-prompt-toggle" className="text-sm font-medium">
                    Daily Prompt
                  </Label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    A quiet nudge each day to help you express yourself.
                  </p>
                </div>
                <Switch
                  id="daily-prompt-toggle"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
            </CardFooter>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
