'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Flame, Sparkles, Send, X } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Dummy data for prompts
const dummyPrompts = [
  {
    id: 1,
    text: "What's something you've always wanted to say but never did?",
    date: 'Today',
    responses: 42,
  },
  {
    id: 2,
    text: 'Describe a moment that changed how you see the world.',
    date: 'Yesterday',
    responses: 38,
  },
  {
    id: 3,
    text: 'What small joy made you smile this week?',
    date: '2 days ago',
    responses: 56,
  },
  {
    id: 4,
    text: 'If you could give your younger self one piece of advice, what would it be?',
    date: '3 days ago',
    responses: 61,
  },
];

export default function DailyPrompt({
  onNewPost,
}: {
  onNewPost?: (content: string) => void;
}) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentPrompt = dummyPrompts[0];
  const streakCount = 3;

  const handleSubmitResponse = () => {
    if (responseText.trim()) {
      // If onNewPost callback is provided, call it with the response text
      if (onNewPost) {
        onNewPost(`${currentPrompt.text}\n\nMy response: ${responseText}`);
      }

      setResponseText('');
      setShowResponseForm(false);
    }
  };

  return (
    <div className="mb-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="daily-prompt-glow relative overflow-hidden border-none bg-gradient-to-br from-[#f0c4ff] to-[#a5f3fc] shadow-lg dark:from-[#2a0942] dark:to-[#164e63]">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-medium text-purple-700 dark:text-purple-300">
                  Daily Prompt
                </h3>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-white/30 px-3 py-1 dark:bg-black/30">
                <Flame className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium">
                  Streak: {streakCount} days
                </span>
              </div>
            </div>

            <CardContent className="pt-0 pb-4">
              <div className="mb-4 rounded-xl bg-white/40 p-4 backdrop-blur-sm dark:bg-black/40">
                <p className="text-xl leading-relaxed font-medium text-gray-800 dark:text-gray-100">
                  {currentPrompt.text}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowResponseForm(true)}
                  className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
                >
                  Respond
                </Button>

                <Button
                  variant="outline"
                  className="border-purple-300 bg-white/50 hover:bg-white/70 dark:border-purple-800 dark:bg-black/50 dark:hover:bg-black/70"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {/* Response form */}
              <AnimatePresence>
                {showResponseForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <div className="rounded-xl bg-white/50 p-4 backdrop-blur-sm dark:bg-black/50">
                      <div className="mb-2 flex items-center justify-between">
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
                        onChange={e => setResponseText(e.target.value)}
                        placeholder="Write your thoughts..."
                        className="min-h-[100px] w-full rounded-md border border-purple-200 bg-white/70 p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-purple-900 dark:bg-black/70 dark:text-white"
                      />
                      <div className="mt-2 flex justify-end">
                        <Button
                          onClick={handleSubmitResponse}
                          className="bg-purple-600 text-white hover:bg-purple-700"
                          disabled={!responseText.trim()}
                        >
                          <Send className="mr-2 h-4 w-4" />
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
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-3"
                  >
                    {dummyPrompts.slice(1).map(prompt => (
                      <div
                        key={prompt.id}
                        className="rounded-lg bg-white/30 p-3 backdrop-blur-sm dark:bg-black/30"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {prompt.date}
                          </p>
                          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                            {prompt.responses} responses
                          </span>
                        </div>
                        <p className="font-medium">{prompt.text}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-purple-600 hover:bg-purple-100 hover:text-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20"
                        >
                          View Responses
                        </Button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>

            <CardFooter className="border-t border-purple-200/50 pt-3 pb-3 dark:border-purple-800/30">
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <Label
                    htmlFor="daily-prompt-toggle"
                    className="text-sm font-medium"
                  >
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
  );
}
