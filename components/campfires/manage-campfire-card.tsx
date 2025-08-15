// components/campfires/manage-campfire-card.tsx
'use client';

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OnboardingTooltip } from "../shared/onboarding-tooltip";
import React, { useState } from "react";
import Link from 'next/link';
import { UserCampfireFavoriteJoin } from "@/components/campfires/campfires.types";

interface ManageCampfireCardProps extends UserCampfireFavoriteJoin {
  onToggleFavorite: (campfireId: string, currentState: boolean) => void;
  onJoinCampfire?: (campfireId: string) => void;
  isTogglingFavorite?: boolean;
  isJoining?: boolean;
}

const ManageCampfireCard: React.FC<ManageCampfireCardProps> = ({
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
}) => {
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

  const getRoleBadgeColor = (role?: string) => {
    if (!role) return '';
    
    switch (role) {
      case 'creator':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'moderator':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatMemberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="w-full flex items-start justify-between gap-4 md:gap-8 flex-wrap p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex gap-3 min-w-0 flex-1">
        {iconURL ? (
          <Avatar className="flex-shrink-0">
            <AvatarImage
              className="h-10 w-10 rounded-full"
              src={iconURL}
              alt={name}
            />
            <AvatarFallback className="border-lavender-500 flex h-10 w-10 items-center justify-center rounded-full border font-semibold text-white">
              <span className="bg-lavender-500 flex h-9 w-9 items-center justify-center rounded-full font-semibold text-white text-sm">
                x/
              </span>
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="border-lavender-500 flex h-10 w-10 items-center justify-center rounded-full border font-semibold text-white flex-shrink-0">
            <span className="bg-lavender-500 flex h-9 w-9 items-center justify-center rounded-full font-semibold text-white text-sm">
              x/
            </span>
          </div>
        )}

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Link 
              href={`/x/${slug}`} 
              className="font-semibold hover:underline truncate text-lg"
            >
              {name}
            </Link>
            {role && (
              <span 
                className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(role)}`}
              >
                {role}
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-neutral-300 break-words mb-2 line-clamp-2">
            {description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>{formatMemberCount(members)} members</span>
            {!isJoined && (
              <span className="text-orange-600 dark:text-orange-400 font-medium">
                Not joined
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <OnboardingTooltip
          id="favorite-star"
          content={{
            title: "Add to Favorites",
            description: "Click the star to quickly access your favorite campfires!"
          }}
          position="top"
        >
          <button
            onClick={handleFavoriteClick}
            disabled={isTogglingFavorite}
            className={`transition-all duration-300 ${
              isAnimating ? 'scale-125' : 'scale-100'
            } ${
              isTogglingFavorite ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star 
              className={`w-5 h-5 transition-all duration-200 ${
                isFavorite
                  ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                  : "text-gray-400 hover:text-yellow-400"
              }`}
            />
          </button>
        </OnboardingTooltip>

        {isJoined ? (
          <Button 
            size="sm" 
            variant="outline" 
            className="rounded-full px-4 text-sm border dark:border-neutral-300"
            disabled
          >
            Joined
          </Button>
        ) : (
          <Button 
            size="sm" 
            onClick={handleJoinClick}
            disabled={isJoining}
            className="rounded-full px-4 text-sm"
          >
            {isJoining ? 'Joining...' : 'Join'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ManageCampfireCard;