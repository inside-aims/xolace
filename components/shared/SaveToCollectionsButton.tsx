// components/SaveToCollectionButton.tsx

import { Bookmark } from 'lucide-react';
import { useState, useTransition, useEffect } from 'react';
import { saveToCollectionAction, removeFromCollection } from '@/app/actions';
import { useToast } from '../ui/use-toast';

export default function SaveToCollectionsButton({ userId, postId, postCollections }: { userId: string; postId: string, postCollections: { user_id: string}[] }) {
  const saved = postCollections?.some(collection => collection.user_id === userId) || false;
  const [isSaved, setIsSaved] = useState<boolean>(saved);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
useEffect(() => {
  setIsSaved(saved)
}, [saved]);

  const handleClick = async () => {
    if (!userId) {
      toast({
        variant: 'destructive',
        title: 'Please login to save posts',
      });
      return;
    }

    try {
      startTransition(async () => {
        if (isSaved) {
          const {success, error} = await removeFromCollection(userId, postId);
          if (!success) {
            toast({
              variant: 'destructive',
              title: error || 'Failed to remove from collection',
            });
            return;
          }
          setIsSaved(false);
        } else {
          const {success, error} = await saveToCollectionAction(userId, postId);
          if (!success) {
            toast({
              variant: 'destructive',
              title: error || 'Failed to save to collection',
            });
            return;
          }
          setIsSaved(true);
          toast({
            variant: 'default',
            title: 'Successfully saved to collection',
          });
        }
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An unexpected error occurred',
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="rounded-full p-2 transition-colors hover:bg-accent disabled:opacity-50"
    >
      <Bookmark
        className={`h-5 w-5 ${
          isSaved ? "fill-primary text-primary" : "text-muted-foreground"
        }`}
      />
    </button>
  );
}