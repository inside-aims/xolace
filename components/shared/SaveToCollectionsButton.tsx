// components/SaveToCollectionButton.tsx

import { Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import { saveToCollectionAction , removeFromCollection} from '@/app/actions';
import { useToast } from '../ui/use-toast';

export default function SaveToCollectionsButton({ userId, postId, postCollections }: { userId: string; postId: string, postCollections: string[] }) {
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log(postCollections);
    const checkSavedStatus = async () => {
      const saved = postCollections.includes(postId);
      console.log(saved);
      setIsSaved(saved);
    };
    checkSavedStatus();
  }, [userId, postId, postCollections]);

  const handleClick = async () => {
    try {
      if (isSaved) {
        const {success,error} = await removeFromCollection(userId, postId);
        if(!success){
          toast({
            variant: 'destructive',
            title: error || 'Oops, something must have gone wrong 😵‍💫!',
          });
          return;
        }
      } else {
        const {success, error} = await saveToCollectionAction(userId, postId);
        if(!success){
          toast({
            variant: 'destructive',
            title: error || 'Oops, something must have gone wrong 😵‍💫!',
          });
          return;
        }

        toast({
          variant: 'default',
          title: 'Successfully saved to collection',
        });
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error updating collection:', error);
    }
  };

  return (
    <button
                onClick={handleClick}
                className="rounded-full p-2 transition-colors hover:bg-accent"
              >
                <Bookmark
                  className={`h-5 w-5 ${
                   isSaved ? "fill-primary text-primary" : "text-muted-foreground"
                  }`}
                />
              </button>
  );
}