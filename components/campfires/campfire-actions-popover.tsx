// components/campfires/CampfireActionsPopover.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Ellipsis,
  Share2,
  Copy,
  Heart,
  Volume2,
  VolumeX,
  Flag,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface CampfireActionsPopoverProps {
  campfire: {
    name: string;
    description?: string;
    slug: string;
    isMember?: boolean;
    isFavorite?: boolean;
  };
  onAddToFavorites?: () => void;
  onAddToCustomFeed?: () => void;
  onMuteToggle?: () => void;
  onReport?: () => void;
  className?: string;
  isProcessingFavorite?: boolean;
}

const CampfireActionsPopover: React.FC<CampfireActionsPopoverProps> = ({
  campfire,
  onAddToFavorites,
  onAddToCustomFeed,
  onMuteToggle,
  onReport,
  className = "",
  isProcessingFavorite = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // This should come from user preferences in real implementation

  const handleShare = async () => {
    setIsOpen(false); // Close popover
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: campfire.name,
          text: campfire.description || `Join the ${campfire.name} campfire community!`,
          url: window.location.href,
        });
        toast.success('Shared successfully!');
      } else {
        // Fallback to copy
        await handleCopyLink();
      }
    } catch (error) {
      // If share is cancelled or fails, fallback to copy
      if ((error as Error).name !== 'AbortError') {
        await handleCopyLink();
      }
    }
  };

  const handleCopyLink = async () => {
    setIsOpen(false); // Close popover
    
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Campfire link copied to clipboard!');
    } catch (_) {
      // Final fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Campfire link copied to clipboard!');
      } catch (_) {
        toast.error('Unable to copy link');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleAddToFavorites = () => {
    setIsOpen(false);
    if (onAddToFavorites) {
      onAddToFavorites();
    } else {
      toast.info('Add to favorites feature coming soon!');
    }
  };

  // const handleAddToCustomFeed = () => {
  //   setIsOpen(false);
  //   if (onAddToCustomFeed) {
  //     onAddToCustomFeed();
  //   } else {
  //     toast.info('Custom feed feature coming soon!');
  //   }
  // };

  const handleMuteToggle = () => {
    setIsOpen(false);
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (onMuteToggle) {
      onMuteToggle();
    } else {
      toast.info(newMutedState ? 'Campfire muted' : 'Campfire unmuted');
    }
  };

  const handleReport = () => {
    setIsOpen(false);
    if (onReport) {
      onReport();
    } else {
      toast.info('Report feature coming soon!');
    }
  };

  const handleOpenInNewTab = () => {
    setIsOpen(false);
    window.open(window.location.href, '_blank');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={`rounded-full border border-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors ${className}`}
          aria-label="More options"
        >
          {isProcessingFavorite ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Ellipsis size={14} />
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-56 p-0 bg-bg dark:bg-bg-dark" 
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <div className="py-2">
          {/* Share Actions */}
          <div className="px-2">
            <p className="text-xs font-medium text-muted-foreground px-2 py-1">
              Share
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2"
              onClick={handleShare}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share campfire
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2"
              onClick={handleCopyLink}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy link
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2"
              onClick={handleOpenInNewTab}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in new tab
            </Button>
          </div>

          <Separator className="my-2" />

          {/* Personalization Actions */}
          <div className="px-2">
            <p className="text-xs font-medium text-muted-foreground px-2 py-1">
              Personalize
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2"
              onClick={handleAddToFavorites}
            >
              {/* fill heart if favorite */}
              <Heart className={`mr-2 h-4 w-4 transition-all duration-200 ${campfire.isFavorite ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                : 'text-gray-400 hover:text-yellow-400'}`} />
              {campfire.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            </Button>
            {/* <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2"
              onClick={handleAddToCustomFeed}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to custom feed
            </Button> */}
          </div>

          {/* Member-only actions */}
          {campfire.isMember && (
            <>
              <Separator className="my-2" />
              <div className="px-2">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                  Settings
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-2"
                  onClick={handleMuteToggle}
                >
                  {isMuted ? (
                    <VolumeX className="mr-2 h-4 w-4" />
                  ) : (
                    <Volume2 className="mr-2 h-4 w-4" />
                  )}
                  {isMuted ? 'Unmute' : 'Mute'} Campfire
                </Button>
              </div>
            </>
          )}

          <Separator className="my-2" />

          {/* Report Action */}
          <div className="px-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20"
              onClick={handleReport}
            >
              <Flag className="mr-2 h-4 w-4" />
              Report campfire
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CampfireActionsPopover;