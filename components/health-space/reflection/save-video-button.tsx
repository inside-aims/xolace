// components/SaveVideoButton.tsx

'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useSaveToVideoCollectionsMutation } from '@/hooks/videos/useSaveToVideoCollectionsMutation';
import { ShadowBtn } from '@/components/health-space/reflection/shadow-btn';
import { toast } from 'sonner';

interface SaveVideoButtonProps {
  userId?: string | null; // User ID can be optional for logged-out state
  videoId: string;
  createdBy: string | null; // The ID of the video's author
  isInitiallySaved: boolean;
}

export function SaveVideoButton({ userId, videoId, createdBy, isInitiallySaved }: SaveVideoButtonProps) {
  // We use local state for the immediate UI feedback, which is part of the optimistic update feel
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const { mutate, isPending } = useSaveToVideoCollectionsMutation();

  // Sync state if the initial prop changes
  useEffect(() => {
    setIsSaved(isInitiallySaved);
  }, [isInitiallySaved]);

  const handleClick = () => {
    if (!userId) {
      toast.error("Please login to save videos");
      return;
    }

    // Optimistically update the UI
    const currentlySaved = isSaved;
    setIsSaved(!currentlySaved);
    
    mutate({
      isCurrentlySaved: currentlySaved,
      userId,
      videoId,
      createdBy
    });
  };

  return (
    <ShadowBtn
        key={'save'}
        value={isSaved ? 'Saved' : 'Save'}
        onClick={handleClick}
        disabled={isPending}
        icon={
            <Bookmark className={`size-4 sm:size-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
        }
    />
  );
}