import HealthTipsWrapper from '@/components/shared/layoutUIs/HealthTipsWrapper';
import { CircleArrowRight } from 'lucide-react';
import React from 'react';
import { getHealthTips } from '@/queries/tips/getHealthTips.action';
import Link from 'next/link';
import { Preview } from '@/components/editor/Preview';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

export default async function HealthTips() {

  const queryClient = new QueryClient()

  // Note we are now using fetchQuery()
  const healthTips = await queryClient.fetchQuery({
    queryKey: ['healthTips'],
    queryFn: getHealthTips,
  })

  const truncateText = (words: string | string[], limit = 150): string => {
    // Ensure words is treated as a string by joining if it's an array
    const text = Array.isArray(words) ? words.join(' ') : words;

    if (text.length <= limit) {
      return text;
    }
    return text.slice(0, limit) + '...';
  };

  return (
    <HealthTipsWrapper>
      <div
        className={'-mt-5 flex w-full flex-col items-start gap-4 max-md:pb-6'}
      >
        <div className="group animate-in fade-in slide-in-from-left-5 relative mb-2 flex items-center gap-2 px-4 text-3xl font-semibold duration-700 md:text-4xl">
          <span className="from-lavender-400 via-lavender-500 to-lavender-600 bg-gradient-to-r bg-clip-text text-transparent">
            Xolace
          </span>
          <span className="relative inline-flex items-center">
            Wellness
            <div className="bg-lavender-400/30 absolute -bottom-2 left-0 h-1 w-full origin-left scale-x-0 transform rounded-full transition-transform duration-500 group-hover:scale-x-100"></div>
          </span>
          <span className="relative inline-flex items-center">
            Insight
            <div className="bg-lavender-400/20 absolute top-1/2 -right-6 h-4 w-4 -translate-y-1/2 animate-pulse rounded-full"></div>
          </span>
        </div>
        <div className={`flex w-full flex-col gap-4 px-4 md:gap-8`}>
          {healthTips.map(tip => (
            <div
              className={'flex w-full flex-col items-start gap-2'}
              key={tip?.id}
            >
              <div className={'flex flex-col gap-1'}>
                <h3 className={'text-xl font-semibold md:text-xl'}>
                  {tip.title}
                </h3>
                <div className={'flex flex-row gap-2 text-sm text-neutral-500'}>
                  by
                  <span className={'text-lavender-500'}>{tip.author_name}</span>
                  <span>{new Date(tip?.created_at).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}</span>
                </div>
              </div>

              <div className={''}>
                {/* {truncateText(tip.content)} */}
                {typeof truncateText(tip.content) === 'string' && (
                  <Preview
                    content={truncateText(tip.content)}
                    className="max-sm:pb-0"
                  />
                )}
              </div>
              <Link
                href={`/health-tips/${tip.id}`}
                className={
                  'text-lavender-400 hover:text-lavender-600 hover:lavender-500 mb-4 flex items-center text-sm hover:cursor-pointer hover:underline'
                }
              >
                Read more
                <span className={'text-lavender-400 hover:lavender-500 ml-1'}>
                  <CircleArrowRight size={16} />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </HealthTipsWrapper>
  );
}
