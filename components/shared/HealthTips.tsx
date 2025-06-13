'use client';

import { Info, Cross, CircleArrowRight} from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSidebar } from '../ui/sidebar';
import { useFeedHealthTips } from '@/hooks/healthTips/useHealthTipsData';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import Link from 'next/link';
import Chat from "@/components/chatbot-ai/Chat";

interface HealthTipCardProps {
  id: number;
  slug?: string;
  title: string;
  author: string;
  author_avatar_url: string;
  content: string | string[];
  date: string;
  index?: number;
  total?: number;
  onHealthTipSelect?: (healthTipSlug: string) => void;
  sidebar?: boolean;
}

// interface HealthTipDetailsProps {
//   id: number;
//   title: string;
//   author_name: string;
//   author_avatar_url: string;
//   content: string;
//   created_at: string;
// }


export default function HealthTips() {
  const {
    data: feedHealthTips,
    isPending: feedHealthTipsLoading,
    isError: feedHealthTipsError,
  } = useFeedHealthTips();
  //const [showDetails, setShowDetails] = useState<boolean>(false);
  // const [healthTipDetails, setHealthTipDetails] =
  //   useState<HealthTipDetailsProps>();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  // Helper for health tip click to read more
  const handleHealthClick = (healthTipSlug: string) => {
    // const selectTip = feedHealthTips?.find(tip => tip.id === healthTipId);
    // if (selectTip) {
    //   setHealthTipDetails(selectTip);
    //   setShowDetails(!showDetails);
    // }
    router.push(`/health-tips/${healthTipSlug}`);
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
          className={`flex h-full w-full flex-col gap-4 md:px-4`}
        >
          {/*Xolace wellness section*/}
          <div className="animate-in fade-in slide-in-from-bottom-3 flex flex-col items-start gap-2 rounded-xl border py-2 shadow-lg transition-shadow duration-500 ease-in-out hover:shadow-xl motion-reduce:animate-none md:py-4">
            <h4 className="flex w-full items-center justify-between px-2 text-neutral-500 md:px-4">
              <span className="hover:text-lavender-500 font-semibold transition-colors duration-200">
                Xolace Wellness Insights
              </span>
              <Cross
                size={18}
                className="cursor-pointer transition-transform duration-300 hover:rotate-90"
              />
            </h4>
            <div className="flex flex-col items-center gap-2 text-sm transition-transform duration-300 hover:scale-[1.01]">
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
          <Chat/>
          <div className="animate-in fade-in hidden flex-col items-start gap-2 rounded-xl border py-2 shadow-lg duration-500 motion-reduce:animate-none  md:gap-6 md:py-4">
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
                        slug={healthTip.slug}
                        title={healthTip.title}
                        author={healthTip.author_name}
                        author_avatar_url={healthTip.author_avatar_url}
                        content={healthTip.content}
                        date={healthTip.created_at}
                        index={index}
                        total={feedHealthTips?.length}
                        onHealthTipSelect={() =>
                          handleHealthClick(healthTip.slug)
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
                    href="#"
                  >
                    Xolace Rules
                  </Link>
                </span>
                <span>
                  <Link
                    className="hover:text-slate-200 hover:underline"
                    href="/policy"
                  >
                    Privacy Policy
                  </Link>
                </span>
                <span>
                  <Link
                    className="hover:text-slate-200 hover:underline"
                    href="/policy"
                  >
                    User Agreement
                  </Link>
                </span>
                <span>
                  <Link
                    className="hover:text-slate-200 hover:underline"
                    href="#"
                  >
                    Xolace, Inc. © 2025. All rights reserved.
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/*health tips details on desktop */}
        {/* <div
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
        </div> */}
      </div>
    </>
  );
}

// Health tip card component
export function HealthTipCard({
  slug,
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
          onClick={() => (onHealthTipSelect && slug) && onHealthTipSelect(slug)}
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
