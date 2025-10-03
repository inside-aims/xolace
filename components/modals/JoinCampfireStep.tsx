import { Button } from '@/components/ui/button';
import {
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import OnboardingCampfireCard from '../cards/OnboardingCampfireCard';
import OnboardingCampfireCardSkeleton from '../shared/loaders/OnboardingCampfireCardSkeleton';
import { useRouter } from 'next/navigation';

interface Campfire {
  campfireId: string;
  name: string;
  slug: string;
  description: string;
  members: number;
  iconURL?: string;
  isMember: boolean;
}

interface JoinCampfiresStepProps {
  publicCampfires?: Campfire[];
  isLoadingCampfires: boolean;
  joiningCampfireId: string | null;
  hasJoinedCampfire: boolean;
  onJoinCampfire: (campfireId: string) => void;
  onBack: () => void;
  onFinish: () => void;
  isAnon: boolean | undefined;
}

export default function JoinCampfiresStep({
  publicCampfires,
  isLoadingCampfires,
  joiningCampfireId,
  hasJoinedCampfire,
  onJoinCampfire,
  onBack,
  onFinish,
  isAnon,
}: JoinCampfiresStepProps) {
  const router = useRouter();

  const handleExplore = () => {
    onFinish();
    router.push('/campfires/discover');
  };
  return (
    <>
      <AlertDialogHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8 text-gray-400 hover:text-gray-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <AlertDialogTitle className="flex-1 text-center text-2xl font-bold">
            Join Your First Campfires 🔥
          </AlertDialogTitle>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>
        <>
        <AlertDialogDescription className="text-center text-gray-500 dark:text-gray-300">
          Get started by joining campfires that match your interests.
        </AlertDialogDescription>
        {isAnon && (
          <AlertDialogDescription className="text-center text-gray-500 dark:text-gray-300">
           <span className="font-medium text-amber-400">NB:</span> Anonymous users can't join campfires.
          </AlertDialogDescription>
        )}
        </>
      </AlertDialogHeader>

      <div className="max-h-[400px] space-y-3 overflow-y-auto py-4">
        {isLoadingCampfires ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <OnboardingCampfireCardSkeleton key={i} />
            ))}
          </div>
        ) : publicCampfires && publicCampfires.length > 0 ? (
          publicCampfires.map(campfire => (
            <OnboardingCampfireCard
              key={campfire.campfireId}
              campfire={campfire}
              isJoining={joiningCampfireId === campfire.campfireId}
              onJoin={onJoinCampfire}
            />
          ))
        ) : (
          <div className="py-8 text-center text-gray-400">
            <p>No campfires available at the moment.</p>
            <p className="mt-2 text-sm">Check back later!</p>
          </div>
        )}
      </div>

      <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
        <Button
          onClick={onFinish}
          disabled={!hasJoinedCampfire || isAnon}
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {hasJoinedCampfire
            ? "I'm ready to share!"
            : 'Join at least one campfire to continue'}
        </Button>
        <Button
          onClick={handleExplore}
          variant="ghost"
          className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-400 dark:hover:text-gray-300"
        >
          Explore all campfires
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
      </AlertDialogFooter>
    </>
  );
}
