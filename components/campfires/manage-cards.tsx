'use client';

import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React, { useState } from 'react';
import Link from 'next/link';
import { UserCampfireFavoriteJoin } from '@/components/campfires/campfires.types';

interface ManageCampfireCardProps extends UserCampfireFavoriteJoin {
  onToggleFavorite: (campfireId: string, currentState: boolean) => void;
  onJoinCampfire?: (campfireId: string) => void;
  isTogglingFavorite?: boolean;
  isJoining?: boolean;
}

const ManageCampfireCard = ({
  campfireId,
  name,
  slug,
  description,
  iconURL,
  members,
  role,
  isFavorite = false,
  isJoined = false,
  onToggleFavorite,
  onJoinCampfire,
  isTogglingFavorite = false,
  isJoining = false,
}: ManageCampfireCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFavoriteClick = () => {
    if (isTogglingFavorite) return;

    setIsAnimating(true);
    onToggleFavorite(campfireId, isFavorite);

    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleJoinClick = () => {
    if (isJoining || !onJoinCampfire) return;
    onJoinCampfire(campfireId);
  };

  return (
    <div
      className="flex w-full flex-wrap items-start justify-between gap-4 md:gap-8"
      key={campfireId}
    >
      <div className="flex min-w-0 flex-1 gap-2">
        {iconURL ? (
          <Avatar>
            <AvatarImage
              className="h-8 w-8 rounded-full"
              src={iconURL || undefined}
              alt={name}
            />
            <AvatarFallback className="border-lavender-500 flex h-8 w-8 items-center justify-center rounded-full border font-semibold text-white">
              <span className="bg-lavender-500 flex h-7 w-7 items-center justify-center rounded-full font-semibold text-white">
                x/
              </span>
            </AvatarFallback>
          </Avatar>
        ) : (
          <p className="border-lavender-500 flex h-8 w-8 items-center justify-center rounded-full border font-semibold text-white">
            <span className="bg-lavender-500 flex h-7 w-7 items-center justify-center rounded-full font-semibold text-white">
              x/
            </span>
          </p>
        )}

        <div className="flex min-w-0 flex-col">
          <Link
            href={`/x/${slug}`}
            className="active:text-lavender-400 truncate font-semibold hover:underline active:underline"
          >
            {name}
          </Link>
          <p className="text-sm break-words text-gray-500 dark:text-neutral-300 truncate">
            {description}
          </p>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <button
          onClick={handleFavoriteClick}
          disabled={isTogglingFavorite}
          className={`transition-all duration-300 ${
            isAnimating ? 'scale-125' : 'scale-100'
          } ${
            isTogglingFavorite
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer hover:scale-110'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            className={`h-5 w-5 transition-all duration-200 ${
              isFavorite
                ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                : 'text-gray-400 hover:text-yellow-400'
            }`}
          />
        </button>

        {isJoined ? (
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-full border px-3 text-xs dark:border-neutral-300"
            disabled
          >
            Joined
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleJoinClick}
            disabled={isJoining}
            className="h-8 rounded-full px-3 text-xs"
          >
            {isJoining ? 'Joining...' : 'Join'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ManageCampfireCard;
