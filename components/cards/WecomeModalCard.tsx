'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUserState } from '@/lib/store/user';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

export default function WelcomeModalCard() {
  // initialize supabase client
  const supabase = getSupabaseBrowserClient();

  // get user profile data
  const user = useUserState(state => state.user);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) return; // Ensure user is loaded before proceeding
    setIsLoaded(true);

    const dismissed = localStorage.getItem('welcomePopupDismissed');

    if (user.is_anonymous) {
      if (!dismissed) {
        setIsOpen(true);
      }
    } else {
      if (!dismissed && !user?.has_seen_welcome) {
        setIsOpen(true);
      }
    }
  }, [user]);

  const handleDismiss = async () => {
    localStorage.setItem('welcomePopupDismissed', 'true');
    setIsOpen(false);

    if (!user?.is_anonymous) {
      // Update user profile in Supabase
      await supabase
        .from('profiles')
        .update({ has_seen_welcome: true })
        .eq('id', user?.id);
    }
  };

  // Prevent rendering the popup before the user state is fully loaded
  if (!isLoaded) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={() => {}}>
      <AlertDialogContent className="mx-auto max-w-[90%] rounded-xl border-gray-700 bg-gray-900 text-gray-100 md:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl font-bold">
            Welcome to Xolace! 🎉
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-300">
            We&apos;re excited to have you as an early adopter.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <p className="mb-4 text-gray-300">
            Xolace is your gateway to anonymous interactions and discussions.
            Explore freely, share your thoughts, and connect with others in a
            secure environment.
          </p>
        </div>
        <AlertDialogFooter>
          <Button
            onClick={handleDismiss}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Got it, let&apos;s go!
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
