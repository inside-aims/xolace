'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Heart, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { useState } from 'react';
import {colorConfig} from "@/styles/healthTipsStyles";
import Image from 'next/image';

export interface FeaturedHealthTipsProps {
  slug: string;
  title: string;
  description: string;
  badge_text: string;
  image_url: string;
  source_label: string;
  type: 'health-tip' | 'glimpse';
  theme_color?: 'pink' | 'yellow' | 'red' | 'green' | 'blue' | 'purple' | 'orange';
}

interface FeaturedHealthTipCardProps {
  healthTip: FeaturedHealthTipsProps;
  className?: string;
}

export function FeaturedHealthTipCard({healthTip, className = ''}: FeaturedHealthTipCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const themeColor = healthTip.theme_color || 'pink';
  const colors = colorConfig[themeColor];

  const handleNavigate = () => {
    router.push(`/${healthTip.type}/${healthTip.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`mb-5 group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl dark:bg-gray-900 border ${colors.border} ${className}`}
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <div className="relative h-48 overflow-hidden">
        {healthTip.image_url ? (
          <Image
            src={healthTip.image_url}
            alt={healthTip.title}
            width={48}
            height={48}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500">
            <Heart className="h-16 w-16 text-white" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Featured Badge - Floating */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 shadow-xl backdrop-blur-sm dark:bg-gray-900/95">
            <div className="relative">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="h-4 w-4 text-amber-500 opacity-75" />
              </div>
            </div>
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              FEATURED
            </span>
          </div>
        </div>

        {healthTip.type === 'glimpse' && (
          <div className="absolute top-4 right-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 shadow-xl">
              <Play className="h-5 w-5 text-white" fill="white" />
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold leading-tight text-white drop-shadow-lg">
            {healthTip.title}
          </h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col gap-3">
        {/* Badge Text with Icon */}
        {healthTip.badge_text && (
          <div className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${colors.badgeGradient}`}>
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className={`bg-gradient-to-r ${colors.textGradient} bg-clip-text text-sm font-semibold text-transparent`}>
              {healthTip.badge_text}
            </span>
          </div>
        )}

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {healthTip.description}
        </p>

        {/* Bottom Section*/}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-lavender-400 to-blue-500 text-xs font-bold text-white shadow-md">
              {healthTip.source_label.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {healthTip.source_label}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Health Expert
              </span>
            </div>
          </div>

          <Button
            onClick={handleNavigate}
            className={`group/btn relative overflow-hidden rounded-xl bg-gradient-to-r ${colors.buttonGradient} px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 ${colors.buttonShadow}`}
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <span className="relative z-10 flex items-center gap-2 text-sm">
              {healthTip.type === 'glimpse' ? 'Watch' : 'Read'}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </span>
            {/* Animated shimmer effect */}
            <div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                animation: 'shimmer 2s infinite',
              }}
            />
          </Button>
        </div>
      </div>

      <div className={`pointer-events-none absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-gradient-to-tl ${colors.decorativeGlow} to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100`} />

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </motion.div>
  );
}