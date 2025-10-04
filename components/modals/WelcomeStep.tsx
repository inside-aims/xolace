import { Button } from '@/components/ui/button';
import {
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { HeartHandshake, Zap, Medal, ChevronRight } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
  isAnon: boolean | undefined;
  onFinish: () => void;
  hasJoinedCampfire: boolean;
}

export default function WelcomeStep({ onNext, onSkip, isAnon, onFinish, hasJoinedCampfire }: WelcomeStepProps) {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-center text-2xl font-bold">
          You&apos;re Early and Essential! 🚀
        </AlertDialogTitle>
        <AlertDialogDescription className="text-center text-gray-500 dark:text-gray-300">
          <span className="text-lavender-500">Welcome to Xolace 🎉</span>, and
          thank you for being part of the few hundreds shaping Xolace&apos;s
          future.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="py-4">
        <div className="flex items-start gap-2 dark:text-gray-300">
          <Medal className="text-ocean-400 mt-1 h-5 w-5 flex-shrink-0" />
          <p>
            <span className="font-medium text-purple-400 dark:text-purple-300">
              Early adopters like you
            </span>{' '}
            will define what this space becomes. We can&apos;t wait to see
            what you&apos;ll share.
          </p>
        </div>
        <div className="mb-4 flex items-start gap-2 dark:text-gray-300">
          <HeartHandshake className="mt-1 h-5 w-5 flex-shrink-0 text-pink-400" />
          <p>
            At <span className="text-ocean-500 dark:text-ocean-300">Xolace</span>, we believe
            someone out there needs your story just as much as you need to
            tell it. Share your journey and help us grow something meaningful
            together.
          </p>
        </div>
        <div className="rounded-lg border  bg-gray-200 p-3 dark:border-purple-500 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 text-sm text-purple-400 dark:text-purple-300">
            <Zap className="h-4 w-4" />
            <span>Early adopter perks coming soon</span>
          </div>
        </div>
      </div>
      <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
        <Button
          onClick={onNext}
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        <Button
          onClick={isAnon || hasJoinedCampfire ? onFinish : onSkip}
          variant="ghost"
          className={`w-full ${isAnon || hasJoinedCampfire ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'}`}
        >
         {isAnon || hasJoinedCampfire ? 'Close' : 'Skip to join campfires'}
        </Button>
      </AlertDialogFooter>
    </>
  );
}