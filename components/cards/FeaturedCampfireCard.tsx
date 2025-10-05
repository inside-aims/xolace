'use client';

import { useRouter } from 'next/navigation';
import { Users, Flame, TrendingUp, ArrowRightSquare } from 'lucide-react';
import { FeaturedCampfire } from '@/queries/posts/useGetFeaturedCampfire';
import { motion } from 'motion/react';
import { Button } from '../ui/button';

interface FeaturedCampfireCardProps {
  campfire: FeaturedCampfire;
  className?: string;
}

export function FeaturedCampfireCard({
  campfire,
  className = '',
}: FeaturedCampfireCardProps) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/x/${campfire.slug}`);
  };

  //   const handleJoin = async (e: React.MouseEvent) => {
  //     e.stopPropagation();
  //     setIsJoining(true);

  //     // TODO: Implement join logic
  //     // await joinCampfire(campfire.id);

  //     setTimeout(() => {
  //       setIsJoining(false);
  //       router.push(`/campfire/${campfire.slug}`);
  //     }, 500);
  //   };

  const formatMemberCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`group relative overflow-hidden rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-50/50 to-orange-50/50 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/50 dark:from-amber-950/20 dark:to-orange-950/20 ${className}`}
    >
      {/* Featured Badge */}
      <div className="absolute top-3 right-3 z-10">
        <div className="flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
          <Flame className="h-3 w-3" />
          <span>Featured Campfire</span>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative p-6">
        {/* Icon or Banner */}
        <div className="mb-4 flex items-start gap-4">
          <div className="flex-shrink-0">
            {campfire.icon_url ? (
              <img
                src={campfire.icon_url}
                alt={campfire.name}
                className="h-16 w-16 rounded-xl object-cover ring-2 ring-amber-500/30"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 ring-2 ring-amber-500/30">
                <Flame className="h-8 w-8 text-white" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-foreground mb-1 line-clamp-1 text-xl font-bold transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">
              {campfire.name}
            </h3>

            {/* Stats */}
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span className="font-medium">
                  {formatMemberCount(campfire.member_count)} members
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  Trending
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {campfire.description && (
          <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
            {campfire.description}
          </p>
        )}

        {/* CTA Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleNavigate}
            className="w-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Connect <ArrowRightSquare className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Decorative Element */}
        <div className="pointer-events-none absolute right-0 bottom-0 h-32 w-32 rounded-tl-full bg-gradient-to-tl from-amber-500/10 to-transparent" />
      </div>
    </motion.div>
  );
}
