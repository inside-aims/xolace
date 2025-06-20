/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; 
import { ArrowRight, Flame, Sparkles, CalendarDays } from "lucide-react";
import { usePreferencesStore } from "@/lib/store/preferences-store";
import { motion } from "framer-motion";
import qs from 'query-string';
import { format, isToday } from "date-fns";
import { useUserState } from "@/lib/store/user";
import { fetchUserStreakAction } from "@/app/actions";
import { TipsBanner } from "./TipsBanner";
import { WordRotate } from "../magicui/word-rotate";
import { tips } from "@/constants";
import { usePrompt } from "@/hooks/prompts/usePromptData";

// interface DailyPromptData {
//   id: string;
//   prompt_text: string;
//   created_at: string;
//   active_on: string;
// }

const DailyPrompt = () => {
  const { preferences } = usePreferencesStore();
  const router = useRouter();
  const user = useUserState(state => state.user);
  const { data: promptData, isLoading: isLoadingPrompt } = usePrompt();
  
  // const [expanded, setExpanded] = useState(false);
  const [isFlameRotating, setIsFlameRotating] = useState(false);
  const [ isLoadingStreak, setIsLoadingStreak ] = useState(true);
  const [streakData, setStreakData] = useState<{
    current_streak: any;
    last_response_date: any;
  } | { current_streak: number; } | null>(null);
  const [showUrgencyIndicator, setShowUrgencyIndicator] = useState(false);


  useEffect(() => {
    const loadData = async () => {
      setIsLoadingStreak(true);

      if (user?.id) {
        const streakResult = await fetchUserStreakAction(user.id);
        if (streakResult?.success && streakResult?.data) {
          setStreakData(streakResult.data);

          if (streakResult.data?.last_response_date) {
            const lastResponseDate = new Date(streakResult.data.last_response_date);
            const now = new Date();
            const hoursLeft = 23 - now.getHours(); // Hours until midnight
            
            setShowUrgencyIndicator(
              !isToday(lastResponseDate) && 
              hoursLeft <= 4 && 
              hoursLeft > 0
            );
          } else {
            // No previous response at all
            const hoursLeft = 23 - new Date().getHours();
            setShowUrgencyIndicator(hoursLeft <= 4 && hoursLeft > 0);
          }
        } else {
          // Handle case where streak fetch might fail but prompt succeeded
          console.error("Failed to fetch streak:", streakResult?.error);
          setStreakData({ current_streak: 0, last_response_date: null }); 
        }
        setIsLoadingStreak(false);
      } else {
        setIsLoadingStreak(false);
        setStreakData({ current_streak: 0, last_response_date: null }); 
      }
      
    };

    loadData();
  }, [user?.id]);

 // const toggleExpanded = () => setExpanded(!expanded);

  const handleRespond = () => {
    if (!promptData) return;
    
    const queryParams = qs.stringify({ prompt: promptData?.data?.prompt_text,
        prompt_id: promptData?.data?.id
     });
    router.push(`/create-post?${queryParams}`);
  };

  const handleStreakHover = () => {
    setIsFlameRotating(true);
    setTimeout(() => setIsFlameRotating(false), 1000);
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

  if (!isLoadingPrompt && !preferences?.daily_prompt_enabled) {
    return (
      // <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-purple-600 to-lavender-700 dark:from-ocean-700/80 dark:to-lavender-800/80 relative text-white p-4 mb-1">
      //   Toggle on Daily Prompt to get started or well continue with streaks🔥!
      // </Card>
      <TipsBanner className="shadow-xl bg-gradient-to-br from-ocean-500 to-lavender-600 dark:from-ocean-700/90 dark:to-lavender-800/90 md:left-[var(--sidebar-width)] md:w-[calc(100%-var(--sidebar-width))] text-white" hideOnScroll>
        <WordRotate className="text-sm md:text-md lg:text-lg" words={tips} duration={5000} />
     </TipsBanner>
    );
  }

  if (isLoadingPrompt) {
    return (
      <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-purple-600 to-lavender-700 dark:from-ocean-700/80 dark:to-lavender-800/80 relative text-white p-4 md:mx-8">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="h-20 bg-white/20 rounded"></div>
          <div className="h-10 bg-white/20 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!promptData?.data) {
    return (
      // <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-purple-600 to-lavender-700 dark:from-ocean-700/80 dark:to-lavender-800/80 relative text-white p-4">
      //   No prompt available for today.
      // </Card>
      <TipsBanner className="shadow-xl bg-gradient-to-br from-ocean-500 to-lavender-600 dark:from-ocean-700/90 dark:to-lavender-800/90 text-white md:left-[var(--sidebar-width)] md:w-[calc(100%-var(--sidebar-width))]">
        <WordRotate className="text-sm md:text-md lg:text-lg" words={["No prompt available for today.", "Ooops !! Our bad 😅"]} duration={5000} />
     </TipsBanner>
    );
  }

  return (
    <div className="w-full mb-3 sm:mb-4 md:px-8" id="daily-prompt-card-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "anticipate" }}
        className="float-animation"
      >
        <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-purple-600 to-lavender-700 dark:from-ocean-700/80 dark:to-lavender-800/80 relative text-white">
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-400/30 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/30 rounded-full -ml-16 -mb-16 blur-3xl animate-pulse delay-1000"></div>

          <div className="relative z-10 py-3 px-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-amber-300" />
                <h3 className="text-md sm:text-lg font-semibold">Prompt of the Day</h3>
              </div>
              <div
                className="flex items-center gap-1 bg-white/10 dark:bg-black/20 px-3 py-1.5 rounded-full cursor-pointer hover:scale-105 transition-transform"
                onMouseEnter={handleStreakHover}
                title={`${streakData?.current_streak} day streak! Keep it up!`}
              >
                <Flame className={`h-5 w-5 text-orange-400 ${isFlameRotating ? 'rotate-animation' : ''}`} /> {showUrgencyIndicator && <span className="animate-bounce duration-700 ease-in-out">⏳</span>}
                {
                    isLoadingStreak && user?.id ? (
                        <span className="text-sm font-medium">...</span>
                    ):(
                        <span className="text-sm font-medium">{streakData?.current_streak} {streakData?.current_streak <= 1? "day" : "days"}</span>
                    )
                }
              </div>
            </div>
            <p className="text-xs text-purple-200 dark:text-purple-300 mb-3 flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5 text-purple-300"/>
              {format(new Date(promptData?.data?.active_on || new Date()), 'MMMM d, yyyy')}
            </p>

            <div className="relative my-3 p-3 bg-white/5 dark:bg-black/10 rounded-xl backdrop-blur-sm min-h-[50px] flex items-center justify-center">
              <span className="absolute -left-2 top-1 text-6xl text-purple-400/50 dark:text-purple-500/50 font-serif select-none">“</span>
              <p className="text-md sm:text-xl font-medium leading-snug text-center px-4">
                {promptData?.data?.prompt_text}
              </p>
              <span className="absolute -right-2 bottom-0 text-6xl text-purple-400/50 dark:text-purple-500/50 font-serif select-none">”</span>
            </div>

            <Button
              onClick={handleRespond}
              className="w-full bg-white hover:bg-gray-100 text-purple-700 font-bold py-3.5 rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 mt-2 text-base"
            >
              Share Your Thoughts <ArrowRight className="ml-2.5 h-5 w-5" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DailyPrompt;