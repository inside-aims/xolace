'use client';

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React from "react";
import Link from 'next/link';

interface CommunityCardProps {
  campfireId: string;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  isFavorite?: boolean;
  onAddToFavorite: () => void;
}

const ManageCampfireCard = ({campfireId,name, slug, description, iconUrl, isFavorite = false, onAddToFavorite}: CommunityCardProps) => {
  return (
    <div className="w-full flex items-start justify-between gap-4 md:gap-8 flex-wrap" key={campfireId}>
      <div className="flex gap-2 min-w-0 flex-1">
        {iconUrl ? (
          <Avatar>
            <AvatarImage
              className="h-8 w-8 rounded-full"
              src={iconUrl || undefined}
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

        <div className="flex flex-col min-w-0">
          <Link href={`/x/${slug}`} className="font-semibold hover:underline truncate">
            {name}
          </Link>
          <p className="text-sm text-gray-500 dark:text-neutral-300 break-words">
            {description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Star className={`w-5 h-5 cursor-pointer ${
            isFavorite
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-400"
          }`}
              onClick={onAddToFavorite}
        />
        <Button size="sm" variant="outline" className="rounded-full px-4 text-sm border dark:border-neutral-300">
          Joined
        </Button>
      </div>
    </div>

  );
};

export default ManageCampfireCard;
