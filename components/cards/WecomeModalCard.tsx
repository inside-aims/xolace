'use client';

import { useState, useEffect } from 'react';
import { useUserState } from '@/lib/store/user';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useUserCampfireCount } from '@/queries/users/useUserCampfireCount';
import { getLimitedPublicCampfires } from '@/queries/campfires/getLimitedPublicCampfies';
import { useJoinCampfireMutation } from '@/hooks/campfires/useJoinCampfireMutation';
import confetti from 'canvas-confetti';
import WelcomeStep from '@/components/modals/WelcomeStep';
import JoinCampfiresStep from '../modals/JoinCampfireStep';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';

export default function WelcomeModalCard() {
  const supabase = getSupabaseBrowserClient();
  const user = useUserState(state => state.user);
  const { data: campfireCount, isLoading } = useUserCampfireCount(user?.id);
  const { data: publicCampfires, isLoading: isLoadingCampfires } =
    getLimitedPublicCampfires(user?.id);
  const joinCampfireMutation = useJoinCampfireMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'join'>('welcome');
  const [joiningCampfireId, setJoiningCampfireId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!user || isLoading) return;
    setIsLoaded(true);

    const dismissed = localStorage.getItem('welcomePopupDismissed');

    if (user.is_anonymous) {
      if (!dismissed) {
        setIsOpen(true);
      }
    } else {
      if ((!dismissed && !user?.has_seen_welcome) || campfireCount === 0) {
        setIsOpen(true);
      }
    }
  }, [user, campfireCount, isLoading]);

  const hasJoinedCampfire = publicCampfires?.some(c => c.isMember) ?? false;

  const handleJoinCampfire = async (campfireId: string) => {
    setJoiningCampfireId(campfireId);
    try {
      await joinCampfireMutation.mutateAsync(campfireId);
    } finally {
      setJoiningCampfireId(null);
    }
  };

  const handleNext = () => {
    setCurrentStep('join');
  };

  const handleBack = () => {
    setCurrentStep('welcome');
  };

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  const handleFinish = async () => {
    if (!hasJoinedCampfire && !user?.is_anonymous) return;

    
    localStorage.setItem('welcomePopupDismissed', 'true');
    setIsOpen(false);

    if (user && !user.is_anonymous) {
      await supabase
        .from('profiles')
        .update({ has_seen_welcome: true })
        .eq('id', user.id);
    }

    triggerConfetti();
  };

  const handleOpenChange = (open: boolean) => {
    // Only allow closing if user has joined at least one campfire and is on join step
    if (!open && currentStep === 'join' && hasJoinedCampfire) {
      handleFinish();
    }
  };

  if (!isLoaded) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="mx-auto max-w-[90%] overflow-hidden !rounded-2xl border-none dark:bg-gray-800 dark:text-gray-100 md:max-w-[500px]">
        <div className="relative">
          <div
            className={`transition-all duration-500 ease-in-out ${
              currentStep === 'welcome'
                ? 'translate-x-0 opacity-100'
                : 'pointer-events-none absolute inset-0 -translate-x-full opacity-0'
            }`}
          >
            <WelcomeStep
              onNext={handleNext}
              onSkip={handleNext}
              isAnon={user?.is_anonymous}
              onFinish={handleFinish}
              hasJoinedCampfire={hasJoinedCampfire}
            />
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              currentStep === 'join'
                ? 'translate-x-0 opacity-100'
                : 'pointer-events-none absolute inset-0 translate-x-full opacity-0'
            }`}
          >
            <JoinCampfiresStep
              publicCampfires={publicCampfires}
              isLoadingCampfires={isLoadingCampfires}
              joiningCampfireId={joiningCampfireId}
              hasJoinedCampfire={hasJoinedCampfire}
              onJoinCampfire={handleJoinCampfire}
              onBack={handleBack}
              onFinish={handleFinish}
              isAnon={user?.is_anonymous}
            />
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
