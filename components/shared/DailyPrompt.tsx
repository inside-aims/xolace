/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Sparkles, CalendarDays } from 'lucide-react';
import { usePreferencesStore } from '@/lib/store/preferences-store';
import { motion } from 'motion/react';
import qs from 'query-string';
import { format, isToday } from 'date-fns';
import { useUserState } from '@/lib/store/user';
import { fetchUserStreakAction } from '@/app/actions';
import { TipsBanner } from './TipsBanner';
import { WordRotate } from '../magicui/word-rotate';
import { usePrompt } from '@/hooks/prompts/usePromptData';
import { tips } from '@/constants';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// interface DailyPromptData {
//   id: string;
//   prompt_text: string;
//   created_at: string;
//   active_on: string;
// }


const DotLottieReact = dynamic(
  () => import('@lottiefiles/dotlottie-react').then(mod => mod.DotLottieReact),
  {
    ssr: false,
    loading: () => <p className="bg-gray-300 dark:bg-gray-600 h-3 w-3 animate-pulse rounded-full"></p>,
  },
);

const DailyPrompt = () => {
  const { preferences } = usePreferencesStore();
  const router = useRouter();
  const user = useUserState(state => state.user);
  const { data: promptData, isLoading: isLoadingPrompt } = usePrompt();

  // const [expanded, setExpanded] = useState(false);
  const [isFlameRotating, setIsFlameRotating] = useState(false);
  const [isLoadingStreak, setIsLoadingStreak] = useState(true);
  const [streakData, setStreakData] = useState<
    | {
        current_streak: any;
        last_response_date: any;
      }
    | { current_streak: number }
    | null
  >(null);
  const [showUrgencyIndicator, setShowUrgencyIndicator] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingStreak(true);

      if (user?.id) {
        const streakResult = await fetchUserStreakAction(user.id);
        if (streakResult?.success && streakResult?.data) {
          setStreakData(streakResult.data);

          if (streakResult.data?.last_response_date) {
            const lastResponseDate = new Date(
              streakResult.data.last_response_date,
            );
            const now = new Date();
            const hoursLeft = 23 - now.getHours(); // Hours until midnight

            setShowUrgencyIndicator(
              !isToday(lastResponseDate) && hoursLeft <= 4 && hoursLeft > 0,
            );
          } else {
            // No previous response at all
            const hoursLeft = 23 - new Date().getHours();
            setShowUrgencyIndicator(hoursLeft <= 4 && hoursLeft > 0);
          }
        } else {
          // Handle case where streak fetch might fail but prompt succeeded
          console.error('Failed to fetch streak:', streakResult?.error);
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

    const queryParams = qs.stringify({
      prompt: promptData?.data?.prompt_text,
      prompt_id: promptData?.data?.id,
    });
    router.push(`/create-post?${queryParams}`);
  };

  const handleStreakHover = () => {
    setIsFlameRotating(true);
    setTimeout(() => setIsFlameRotating(false), 1000);
  };

  // Subtle pulse animation for the card
  useEffect(() => {
    const cardElement = document.getElementById('daily-prompt-card-container');
    if (cardElement) {
      const timer = setInterval(() => {
        cardElement.classList.add('pulse-animation');
        setTimeout(() => {
          cardElement.classList.remove('pulse-animation');
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
      <TipsBanner
        className="from-ocean-500 to-lavender-600 dark:from-ocean-700/90 dark:to-lavender-800/90 bg-gradient-to-br text-white shadow-xl md:left-[var(--sidebar-width)] md:w-[calc(100%-var(--sidebar-width))]"
        hideOnScroll
      >
        <WordRotate
          className="md:text-md text-sm lg:text-lg"
          words={tips}
          duration={5000}
        />
      </TipsBanner>
    );
  }

  if (isLoadingPrompt) {
    return (
      <Card className="to-lavender-700 dark:from-ocean-700/80 dark:to-lavender-800/80 relative overflow-hidden border-none bg-gradient-to-br from-purple-600 p-4 text-white shadow-xl md:mx-8">
        <div className="flex animate-pulse flex-col gap-4">
          <div className="h-6 w-1/3 rounded bg-white/20"></div>
          <div className="h-20 rounded bg-white/20"></div>
          <div className="h-10 rounded bg-white/20"></div>
        </div>
      </Card>
    );
  }

  if (!promptData?.data) {
    return (
      // <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-purple-600 to-lavender-700 dark:from-ocean-700/80 dark:to-lavender-800/80 relative text-white p-4">
      //   No prompt available for today.
      // </Card>
      <TipsBanner className="from-ocean-500 to-lavender-600 dark:from-ocean-700/90 dark:to-lavender-800/90 bg-gradient-to-br text-white shadow-xl md:left-[var(--sidebar-width)] md:w-[calc(100%-var(--sidebar-width))]">
        <WordRotate
          className="md:text-md text-sm lg:text-lg"
          words={['No prompt available for today.', 'Ooops !! Our bad 😅']}
          duration={5000}
        />
      </TipsBanner>
    );
  }

  return (
    <div
      className="mb-3 w-full sm:mb-4 md:px-8"
      id="daily-prompt-card-container"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'anticipate' }}
        className=""
      >
        <Card className="to-lavender-700 dark:from-ocean-700/80 dark:to-lavender-800/80 relative overflow-hidden border-none bg-gradient-to-br from-purple-600 text-white shadow-xl">
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-40 w-40 animate-pulse rounded-full bg-indigo-400/30 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-32 w-32 animate-pulse rounded-full bg-purple-400/30 blur-3xl delay-1000"></div>

          <div className="relative z-10 px-4 py-3">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-300 sm:h-6 sm:w-6" />
                <h3 className="text-md font-semibold sm:text-lg">
                  Prompt of the Day
                </h3>
              </div>

              <div className="flex items-center gap-1">

              <DotLottieReact
                  src="https://lottie.host/8586490e-8c75-47c6-afc2-c8f2a6f10682/hYjxZaYm6a.lottie"
                  loop
                  autoplay
                  style={{width: "30px", height: "30px"}}
                />
              <div
                className={`flex cursor-pointer items-center gap-1 rounded-full bg-white/10 px-2 py-1 transition-transform hover:scale-105 dark:bg-black/20 ${isFlameRotating ? 'rotate-animation' : ''}`}
                onMouseEnter={handleStreakHover}
                title={`${streakData?.current_streak} day streak! Keep it up!`}
              >
                {/* <Flame
                  className={`h-5 w-5 text-orange-400 ${isFlameRotating ? 'rotate-animation' : ''}`}
                />{' '} */}
               
                {showUrgencyIndicator && (
                  <span className="animate-bounce duration-700 ease-in-out">
                    ⏳
                  </span>
                )}
                {isLoadingStreak && user?.id ? (
                  <span className="text-sm font-medium">...</span>
                ) : (
                  <span className="text-sm font-medium">
                    {streakData?.current_streak}{' '}
                    {streakData?.current_streak <= 1 ? 'day' : 'days'}
                  </span>
                )}
              </div>
              </div>
            </div>
            <p className="mb-3 flex items-center text-xs text-purple-200 dark:text-purple-300">
              <CalendarDays className="mr-1.5 h-4 w-4 text-purple-300" />
              {format(
                new Date(promptData?.data?.active_on || new Date()),
                'MMMM d, yyyy',
              )}
            </p>

            <div className="relative my-3 flex min-h-[50px] items-center justify-center rounded-xl bg-white/5 p-3 backdrop-blur-sm dark:bg-black/10">
              <span className="absolute top-1 -left-2 font-serif text-6xl text-purple-400/50 select-none dark:text-purple-500/50">
                “
              </span>
              <p className="text-md px-4 text-center leading-snug font-medium sm:text-xl">
                {promptData?.data?.prompt_text}
              </p>
              <span className="absolute -right-2 bottom-0 font-serif text-6xl text-purple-400/50 select-none dark:text-purple-500/50">
                ”
              </span>
            </div>

            <Button
              onClick={handleRespond}
              className="mt-2 w-full rounded-lg bg-white py-3.5 text-base font-bold text-purple-700 shadow-md transition-all hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-lg"
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
