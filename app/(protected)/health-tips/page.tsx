import HealthTipsWrapper from '@/components/shared/layoutUIs/HealthTipsWrapper';
import { BookOpen, CircleArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getHealthTips } from '@/queries/tips/getHealthTips.action';
import Link from 'next/link';
import { Preview } from '@/components/editor/Preview';
import { QueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import HealthTipsCard from '@/components/cards/HealthTipsCard';

export const metadata: Metadata = {
  title: 'Health Tips',
  description:
    'Discover daily health tips and expert-backed advice to boost your wellness, fitness, and mental health—trusted by millions worldwide.',
};

export default async function HealthTips() {
  const queryClient = new QueryClient();

  // Note we are now using fetchQuery()
  const healthTips = await queryClient.fetchQuery({
    queryKey: ['healthTips'],
    queryFn: getHealthTips,
  });

  const truncateText = (words: string | string[], limit = 150): string => {
    // Ensure words is treated as a string by joining if it's an array
    const text = Array.isArray(words) ? words.join(' ') : words;

    if (text.length <= limit) {
      return text;
    }
    return text.slice(0, limit) + '...';
  };

  return (
    <div className="h-[calc(100vh-var(--header-height))] overflow-auto px-2 md:px-4 pb-12">
      <div className='mb-5 md:px-2 mt-5'>
        <div className="group animate-in fade-in slide-in-from-left-5 relative mb-2 flex items-center gap-2 text-2xl font-semibold duration-700 md:text-4xl">
        <BookOpen className="w-8 h-8 text-emerald-500" />
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
       <p className="text-muted-foreground">Expert-backed articles and guides for your mental health journey</p>
      </div>


      <div className="grid w-full grid-cols-12 gap-6">
        <div
          className={
            'col-span-12 -mt-5 flex w-full flex-col items-start gap-4 px-0! pt-8 pb-12 max-md:pb-6 sm:container md:col-span-8'
          }
        >
          <div className={`flex w-full flex-col gap-4 md:gap-8`}>
            {healthTips.map(tip => (
              <HealthTipsCard
                key={tip.id}
                tip={tip}
                setSelectedTip={() => {}}
              />
            ))}
          </div>
        </div>
        <div className={'col-span-12 hidden h-full md:col-span-4 md:block'}>
          <Card className="sticky top-1 p-6 shadow-sm dark:border-gray-500/20 rounded-xl">
            <h2 className="text-foreground mb-4 font-bold">Popular Topics</h2>
            <div className="space-y-2">
              {[
                { title: 'Stress Management', count: 12 },
                { title: 'Sleep Better', count: 8 },
                { title: 'Anxiety Relief', count: 15 },
                { title: 'Mindfulness', count: 11 },
                { title: 'Work-Life Balance', count: 9 },
              ].map(topic => (
                <button
                  key={topic.title}
                  className="hover:bg-muted group w-full rounded-lg px-3 py-2 text-left transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-foreground text-sm transition-colors group-hover:text-emerald-600">
                      {topic.title}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {topic.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-border mt-6 border-t pt-6">
              <p className="text-muted-foreground mb-3 text-xs">
                Want to contribute tips?
              </p>
              <button className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">
                Suggest a Tip
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
