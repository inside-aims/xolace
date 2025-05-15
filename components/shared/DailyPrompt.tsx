"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card"; 
import { ArrowRight, Flame, ChevronDown, ChevronUp, Sparkles, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { usePreferencesStore } from "@/lib/store/preferences-store";
import { motion, AnimatePresence } from "framer-motion";
import qs from 'query-string';

// Dummy data for the daily prompt
const CURRENT_PROMPT = {
  id: "prompt123",
  text: "What's a goal you're secretly working towards?",
  // Use a dynamic date for "Today" or a fixed one for consistency in dummy data
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
};

const DUMMY_PAST_PROMPTS = [
  { id: "p1", text: "Describe a moment that changed how you see the world.", date: "Yesterday" },
  { id: "p2", text: "What small joy made you smile this week?", date: "2 days ago" },
  { id: "p3", text: "If you could give your younger self one piece of advice, what would it be?", date: "3 days ago" },
];

const streakCount = 5; // Dummy streak

 const DailyPrompt = () => {
    const {preferences} = usePreferencesStore()
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [isFlameRotating, setIsFlameRotating] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const handleRespond = () => {
    // const url = formUrlQuery({
    //   params: typeof window !== 'undefined' ? window.location.search : '',
    //   key: "prompt",
    //   value: CURRENT_PROMPT.text,
    // });

    const queryParams = qs.stringify({ prompt: CURRENT_PROMPT.text });
    // Navigate to create-post page with the prompt text as a query parameter
    router.push(`/create-post?${queryParams}`);
  };

  const handleStreakHover = () => {
    setIsFlameRotating(true);
    setTimeout(() => setIsFlameRotating(false), 1000); // Animation duration
  };

  
  // Subtle pulse animation for the card
  useEffect(() => {
    const cardElement = document.getElementById("daily-prompt-card-container");
    if (cardElement) {
        const timer = setInterval(() => {
            cardElement.classList.add("pulse-animation");
            setTimeout(() => {
                cardElement.classList.remove("pulse-animation");
            }, 2000);
        }, 10000); 
        return () => clearInterval(timer);
    }
  }, []);


  return (
    <div className="w-full my-3 sm:my-5" id="daily-prompt-card-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "anticipate" }}
        className="float-animation" // Apply float animation here
      >
        {
            preferences?.daily_prompt_enabled ? (
                <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-purple-600 to-lavender-700 dark:from-ocean-700/80 dark:to-lavender-800/80 relative text-white">
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-400/30 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/30 rounded-full -ml-16 -mb-16 blur-3xl animate-pulse delay-1000"></div>

          <div className="relative z-10 py-3 px-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Sparkles className=" h-4 w-4 sm:h-6 sm:w-6 text-amber-300" />
                <h3 className="text-md sm:text-lg font-semibold">Prompt of the Day</h3>
              </div>
              <div
                className="flex items-center gap-2 bg-white/10 dark:bg-black/20 px-3 py-1.5 rounded-full cursor-pointer hover:scale-105 transition-transform"
                onMouseEnter={handleStreakHover}
                title={`${streakCount} day streak! Keep it up!`}
              >
                <Flame className={`h-5 w-5 text-orange-400 ${isFlameRotating ? 'rotate-animation' : ''}`} />
                <span className="text-sm font-medium">{streakCount} days</span>
              </div>
            </div>
            <p className="text-xs text-purple-200 dark:text-purple-300 mb-3 flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5 text-purple-300"/> {CURRENT_PROMPT.date}
            </p>

            <div className="relative my-3 p-3 bg-white/5 dark:bg-black/10 rounded-xl backdrop-blur-sm min-h-[50px] flex items-center justify-center">
              <span className="absolute -left-2 top-1 text-6xl text-purple-400/50 dark:text-purple-500/50 font-serif select-none">“</span>
              <p className=" text-md sm:text-xl font-medium leading-snug text-center px-4">
                {CURRENT_PROMPT.text}
              </p>
              <span className="absolute -right-2 bottom-0 text-6xl text-purple-400/50 dark:text-purple-500/50 font-serif select-none">”</span>
            </div>

            <Button
              onClick={handleRespond}
              className="w-full bg-white hover:bg-gray-100 text-purple-700 font-bold py-3.5 rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 mt-2 text-base"
            >
              Share Your Thoughts <ArrowRight className="ml-2.5 h-5 w-5" />
            </Button>

            <div className="mt-4 pt-2 border-t border-white/10 dark:border-black/20">
              {/* <div className="flex items-center justify-between mb-1">
                <Label htmlFor="notifications-toggle" className="text-sm font-medium flex items-center">
                  Daily Prompt Notifications
                </Label>
                <Switch
                  id="notifications-toggle"
                  checked={notificationsEnabled}
                  onCheckedChange={handleNotificationToggle}
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-white/20 dark:data-[state=unchecked]:bg-black/30"
                />
              </div>
               <p className="text-xs text-purple-200 dark:text-purple-300 mb-2">
                A quiet nudge each day to help you express yourself.
              </p> */}

              <Button
                variant="ghost"
                onClick={toggleExpanded}
                className="w-full text-purple-200 hover:text-white hover:bg-white/5 dark:hover:bg-black/10 flex items-center justify-center py-2 rounded-md"
              >
                {expanded ? "Hide Past Prompts" : "Show Past Prompts"}
                {expanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="px-6 pb-6 pt-2 space-y-3"
              >
                <h4 className="text-md font-semibold mb-2">Past Prompts</h4>
                {DUMMY_PAST_PROMPTS.map((prompt) => (
                  <div key={prompt.id} className="p-3.5 bg-white/5 dark:bg-black/10 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <p className="text-xs text-purple-200 dark:text-purple-300 mb-1">{prompt.date}</p>
                    <p className="font-medium text-sm">{prompt.text}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
                </Card>
            ):(
                <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-purple-600 to-lavender-700 dark:from-ocean-700/80 dark:to-lavender-800/80 relative text-white">
                    Toggle on Daily Prompt to get started or well continue with streaks!
                </Card>
            )
        }
      </motion.div>
    </div>
  );
};

export default DailyPrompt