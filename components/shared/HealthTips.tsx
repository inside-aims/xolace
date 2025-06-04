'use client';

import { Info, Cross, CircleArrowRight, MoveLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, {useEffect, useRef, useState} from 'react';
import { useRouter } from 'next/navigation';
import { useSidebar } from '../ui/sidebar';
import { useFeedHealthTips } from '@/hooks/healthTips/useHealthTipsData';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import Link from 'next/link';
import {AnimatePresence, motion} from "framer-motion";

interface HealthTipCardProps {
  id: number;
  title: string;
  author: string;
  author_avatar_url: string;
  content: string | string[];
  date: string;
  index?: number;
  total?: number;
  onHealthTipSelect?: (healthTipId: number) => void;
  sidebar?: boolean;
}

interface HealthTipDetailsProps {
  id: number;
  title: string;
  author_name: string;
  author_avatar_url: string;
  content: string;
  created_at: string;
}

// dummy health tips data
// const healthTips: HealthTipCardProps[] = [
//   {
//     id: '1',
//     title: 'Coping With Anxiety in Isolation',
//     author: 'Dr. Sarah Mensah',
//     content: [
//       'Anxiety during isolation is a common struggle that many individuals face. The lack of social interaction can heighten feelings of loneliness and uncertainty.',
//       'To manage this, acknowledge your emotions without judgment. It’s okay to feel overwhelmed — acceptance is the first step toward healing.',
//       'Establishing a daily routine can help regain a sense of control. Set fixed wake-up and sleep times, eat balanced meals, and schedule intentional breaks.',
//       'Stay mentally active. Read books, solve puzzles, or try learning a new skill — cognitive engagement boosts your mood and reduces rumination.',
//       'Don’t underestimate the value of movement. A short walk, stretching, or a quick dance session can release endorphins and reduce stress.',
//       'Digital connections matter. Schedule regular virtual catch-ups with family or join online support groups to avoid complete social withdrawal.',
//       'Incorporate grounding techniques — like focusing on your breath or naming five things you see — to calm your mind during anxiety spikes.',
//       'Lastly, speak kindly to yourself. You’re not failing for feeling anxious. Progress isn’t linear, and every effort counts.',
//     ],
//     date: '2025-05-20',
//   },
//   {
//     id: '2',
//     title: 'Daily Breathing Exercises for Calm',
//     author: 'Dr. Kwame Boateng',
//     content: [
//       'Breathing exercises are accessible tools to reset your body’s stress response, offering a natural path to calm and balance.',
//       'Start with diaphragmatic breathing. Lie down, place one hand on your chest and another on your belly. Breathe deeply and slowly so only your belly rises.',
//       'Practice this for 5–10 minutes daily. Over time, it can lower blood pressure and reduce chronic anxiety symptoms.',
//       'Box breathing is another effective method — inhale for 4 counts, hold for 4, exhale for 4, and pause for 4. Repeat this cycle for several minutes.',
//       'Use breathing as a mindfulness anchor. When your thoughts wander, gently return to the rhythm of your breath without judgment.',
//       'Breathwork isn’t only for mornings — it’s perfect before stressful meetings, during traffic, or when falling asleep.',
//       'Pair your breathing practice with calming music or ambient nature sounds to enhance the effect.',
//       'As you continue, note how your body responds. The more consistent your practice, the easier it becomes to enter a state of calm quickly.',
//     ],
//     date: '2025-12-18',
//   },
//   {
//     id: '3',
//     title: 'Benefits of Mindful Journaling',
//     author: 'Dr. Linda Owusu',
//     content: [
//       'Mindful journaling invites us to observe our inner world with curiosity and compassion, helping us process emotions and find clarity.',
//       'Start with simple prompts like “What emotions am I feeling right now?” or “What drained or energized me today?”',
//       'Journaling is most effective when done consistently. Set a timer for 10–15 minutes and allow your thoughts to spill without censorship.',
//       'Use it as a tool to track your personal growth, highlight recurring thought patterns, or identify emotional triggers.',
//       'It can serve as an emotional outlet, reducing the mental clutter that contributes to stress and anxiety.',
//       'Over time, you may notice more gratitude, resilience, and emotional intelligence emerging through your entries.',
//       'You don’t have to write daily. Even two or three times a week can offer benefits. Just be intentional when you do.',
//       'Finally, treat your journal as a safe space. There’s no right or wrong — only your authentic self, expressed freely.',
//       'Mindful journaling invites us to observe our inner world with curiosity and compassion, helping us process emotions and find clarity.',
//       'Start with simple prompts like “What emotions am I feeling right now?” or “What drained or energized me today?”',
//       'Journaling is most effective when done consistently. Set a timer for 10–15 minutes and allow your thoughts to spill without censorship.',
//       'Use it as a tool to track your personal growth, highlight recurring thought patterns, or identify emotional triggers.',
//       'It can serve as an emotional outlet, reducing the mental clutter that contributes to stress and anxiety.',
//       'Over time, you may notice more gratitude, resilience, and emotional intelligence emerging through your entries.',
//       'You don’t have to write daily. Even two or three times a week can offer benefits. Just be intentional when you do.',
//       'Finally, treat your journal as a safe space. There’s no right or wrong — only your authentic self, expressed freely.',
//     ],
//     date: '2025-10-17',
//   },
// ];

const placeholders = [
  "This June, speak up — your mind matters.",
  "Silent battles deserve a voice. Start here.",
  "Strong men share too. Break the silence.",
  "June is for healing — tell your story.",
  "Every man has a story. Yours matters.",
  "Mental health isn’t weakness. Let’s talk.",
  "Say it. Feel it. Heal it — right here.",
];


export default function HealthTips() {
  const {
    data: feedHealthTips,
    isPending: feedHealthTipsLoading,
    isError: feedHealthTipsError,
  } = useFeedHealthTips();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [healthTipDetails, setHealthTipDetails] =
    useState<HealthTipDetailsProps>();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const [awarenessTime, setAwarenessTime] = useState<boolean>(true);

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initiate animate when it's time
  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder(prev => (prev + 1) % placeholders.length);
    }, 3000);
  };

  // Hook for animate awareness time content
  useEffect(() => {
    startAnimation();
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible' && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else if (document.visibilityState === 'visible') {
        startAnimation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);


  // Helper for health tip click to read more
  const handleHealthClick = (healthTipId: number) => {
    const selectTip = feedHealthTips?.find(tip => tip.id === healthTipId);
    if (selectTip) {
      setHealthTipDetails(selectTip);
      setShowDetails(!showDetails);
    }
  };

  // Handle health tips route navigation
  const handleHealthTipsNavigation = () => {
    setOpenMobile(false);
    return router.push('/health-tips');
  };

  return (
    <>
      <div className={'flex w-full flex-col'}>
        <div
          className={`${!showDetails ? 'flex h-full w-full flex-col gap-4 md:px-4' : 'hidden'}`}
        >
          {/*Awareness time section*/}
          <div
            className={`${awarenessTime ? 'w-full flex-col p-1 border shadow-lg h-32 rounded-lg relative inline-flex overflow-hidden focus:outline-none' : 'hidden'}`}>
            <span
              className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#8794f2_50%,#E2CBFF_100%)]">
            </span>
            <span
              className="inline-flex h-full w-full items-center justify-center px-8 py-2 text-lg font-medium backdrop-blur-2xl dark:text-white bg-white dark:bg-black relative">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`placeholder-${currentPlaceholder}`}
                  initial={{y: 5, opacity: 0}}
                  animate={{y: 0, opacity: 1}}
                  exit={{y: -15, opacity: 0}}
                  transition={{duration: 1, ease: 'linear'}}
                  className="w-full truncate px-4 text-left text-sm font-normal text-neutral-500 sm:text-base dark:text-zinc-500"
                >
                  {placeholders[currentPlaceholder]}
                </motion.p>
              </AnimatePresence>
            </span>
          </div>

          {/*Xolace wellness section*/}
          <div
            className={`${awarenessTime ? 'hidden' : 'animate-in fade-in slide-in-from-bottom-3 flex flex-col items-start gap-2 rounded-xl border py-2 shadow-lg transition-shadow duration-500 ease-in-out hover:shadow-xl motion-reduce:animate-none md:py-4'}`}>
            <h4 className="flex w-full items-center justify-between px-2 text-neutral-500 md:px-4">
              <span className="hover:text-lavender-500 font-semibold transition-colors duration-200">
                Xolace Wellness Insights
              </span>
              <Cross
                size={18}
                className="cursor-pointer transition-transform duration-300 hover:rotate-90"
              />
            </h4>
            <div
              className="flex flex-col items-center gap-2 text-sm transition-transform duration-300 hover:scale-[1.01]">
              <p className="hover:text-lavender-500 flex ps-2 transition-colors duration-200 md:px-4">
                Practical health tips and trusted advice to help you thrive mind
                and body.
              </p>
              <p className="hover:text-lavender-500 ms-2 flex border-t py-1 transition-colors duration-200 md:ms-4 md:py-2">
                Backed by experts, tailored for your everyday wellbeing.
              </p>
              <div className="flex w-full items-center justify-center border-t py-2 md:hidden">
                <Button
                  className="bg-lavender-400 hover:bg-lavender-500 mx-8 w-full rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md"
                  onClick={() => handleHealthTipsNavigation()}
                >
                  View Health Tips
                </Button>
              </div>
            </div>
          </div>

          {/*Filtered health tips little info on desktop device only*/}
          <div className="animate-in fade-in hidden flex-col items-start gap-2 rounded-xl border py-2 shadow-lg duration-500 motion-reduce:animate-none md:flex md:gap-6 md:py-4">
            <h4 className="flex w-full items-center justify-between px-2 text-neutral-500 md:px-4">
              <span className="font-semibold">Health Tips</span>
              <Info size={22} />
            </h4>

            <div className="flex w-full flex-col gap-4 ps-2 md:gap-6 md:ps-4">
              {feedHealthTipsError && (
                <p className="text-carnation-500">Something went wrong</p>
              )}
              {feedHealthTipsLoading
                ? // Show 3 skeleton loaders while loading
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className={`hidden md:block animate-pulse`}
                    >
                      <div className="flex flex-row items-start gap-2 md:gap-4">
                        {/* Avatar skeleton */}
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex w-full flex-col items-start gap-2">
                          {/* Title skeleton */}
                          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                          {/* Author and date skeleton */}
                          <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                          {/* Button skeleton */}
                          <div className="h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          {/* Divider for non-last items */}
                          {index < 2 && (
                            <div className="hidden w-full border-b py-2 md:flex"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                : // Show actual health tips when loaded
                  feedHealthTips?.map((healthTip, index) => (
                    <div
                      key={healthTip.id}
                      className={`hidden md:block`}
                    >
                      <HealthTipCard
                        id={healthTip.id}
                        title={healthTip.title}
                        author={healthTip.author_name}
                        author_avatar_url={healthTip.author_avatar_url}
                        content={healthTip.content}
                        date={healthTip.created_at}
                        index={index}
                        total={feedHealthTips?.length}
                        onHealthTipSelect={() =>
                          handleHealthClick(healthTip.id)
                        }
                      />
                    </div>
                  ))}
            </div>
            <div className="flex w-full items-center justify-center border-t">
              <Button
                variant="link"
                className="text-lavender-400 hover:lavender-500 flex"
                onClick={() => handleHealthTipsNavigation()}
              >
                See More Tips
                <span className="text-lavender-400 hover:lavender-500 ml-1">
                  <CircleArrowRight size={16} />
                </span>
              </Button>
            </div>
          </div>

          <div className="flex-1 max-sm:hidden">
            <div className="flex h-full flex-col justify-end">
              <div className="flex flex-wrap justify-center gap-2 p-2 text-xs text-slate-600/60 dark:text-slate-400/60">
                <span>
                  <Link
                    className="hover:text-slate-200 hover:underline"
                    href=""
                  >
                    Xolace Rules
                  </Link>
                </span>
                <span>
                  <Link
                    className="hover:text-slate-200 hover:underline"
                    href=""
                  >
                    Privacy Policy
                  </Link>
                </span>
                <span>
                  <Link
                    className="hover:text-slate-200 hover:underline"
                    href=""
                  >
                    User Agreement
                  </Link>
                </span>
                <span>
                  <Link
                    className="hover:text-slate-200 hover:underline"
                    href=""
                  >
                    Xolace, Inc. © 2025. All rights reserved.
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/*health tips details on desktop */}
        <div
          className={`${showDetails ? 'hidden w-full flex-col items-start gap-4 px-4 py-2 md:flex' : 'hidden'}`}
        >
          <button
            className={
              'flex flex-row items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }
            onClick={() => setShowDetails(false)}
          >
            <MoveLeft size={20} />
          </button>
          <div className={'flex flex-col items-center'}>
            <HealthTipDetailsCard
              id={healthTipDetails?.id || 0}
              title={healthTipDetails?.title || ''}
              author={healthTipDetails?.author_name || ''}
              author_avatar_url={healthTipDetails?.author_avatar_url || ''}
              content={healthTipDetails?.content || ''}
              date={healthTipDetails?.created_at || ''}
              sidebar={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// Health tip card component
export function HealthTipCard({
  id,
  title,
  author,
  author_avatar_url,
  total,
  index,
  date,
  onHealthTipSelect,
}: HealthTipCardProps) {
  return (
    <div className="flex flex-row items-start gap-2 md:gap-4">
      <Avatar>
        <AvatarImage src={author_avatar_url || undefined} alt={author} />
        <AvatarFallback>{author.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex w-full flex-col items-start">
        <p className="pe-2 text-sm md:pe-4">{title}</p>
        <h3 className="mb-1 flex w-full items-center justify-between pe-2 text-sm text-neutral-500 md:pe-4">
          <span>
            {`${author}`} —{' '}
            {new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </h3>
        <button
          className="from-lavender-500/70 to-lavender-200/30 dark:from-lavender-700/70 dark:to-lavender-500/40 border-lavender-500/10 hover:from-lavender-300/80 hover:to-lavender-200/40 dark:hover:from-lavender-600/80 dark:hover:to-lavender-500/40 cursor-pointer rounded-full border bg-linear-to-b px-5 py-2 text-sm text-black backdrop-blur-md transition duration-500 dark:border-white/30 dark:text-white"
          onClick={() => onHealthTipSelect && onHealthTipSelect(id)}
        >
          See more
        </button>
        {index !== undefined && total !== undefined && index < total - 1 && (
          <p className="hidden w-full border-b py-2 md:flex"></p>
        )}
      </div>
    </div>
  );
}

// Health tip card component details page
export function HealthTipDetailsCard(props: HealthTipCardProps) {
  return (
    <div className={'flex w-full flex-col gap-4'} key={props?.id}>
      <div className={'flex w-full flex-col items-start'}>
        <h4 className={'text-2xl font-semibold'}>{props?.title}</h4>
        <p className={'mb-4 flex flex-row gap-2 text-sm text-neutral-400'}>
          <span>
            {`${props?.author}`} —{' '}
            {new Date(props?.date).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </p>
      </div>
      {props.sidebar && (
        <div className={'text-neutral-600'}>
          {Array.isArray(props.content) ? (
            props.content.map((para, idx) => (
              <p key={idx} className="mb-2">
                {para}
              </p>
            ))
          ) : (
            <p>{props.content}</p>
          )}
        </div>
      )}
    </div>
  );
}
