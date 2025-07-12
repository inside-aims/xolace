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
import { HeartHandshake, Zap, Medal } from 'lucide-react';
import confetti from 'canvas-confetti';

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

    if (user && !user.is_anonymous) {
      // Update user profile in Supabase
      await supabase
        .from('profiles')
        .update({ has_seen_welcome: true })
        .eq('id', user.id);
    }

    // confetti animation
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
 
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

  // Prevent rendering the popup before the user state is fully loaded
  if (!isLoaded) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={() => {}}>
      <AlertDialogContent className="mx-auto max-w-[90%] rounded-xl border-gray-700 bg-gray-900 text-gray-100 md:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl font-bold">
          You&apos;re Early — and Essential! 🚀 
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-300">
          <span className='text-lavender-500'>Welcome to Xolace 🎉</span>, and thank you for being part of the few hundreds shaping Xolace&apos;s future.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
        <div className=" text-gray-300 flex items-start gap-2">
        <Medal className="mt-1 h-5 w-5 flex-shrink-0 text-ocean-400" />
       <p>
       <span className="font-medium text-purple-300">Early adopters like you</span> will define what this space becomes. 
       We can&apos;t wait to see what you&apos;ll share.
       </p>
      </div>
          <div className="mb-4 text-gray-300 flex items-start gap-2">
          <HeartHandshake className="mt-1 h-5 w-5 flex-shrink-0 text-pink-400" />
           <p> At <span className='text-ocean-400'>Xolace</span>, we believe someone out there needs your story just as much as you need to tell it. Share your journey and help us grow something meaningful together.</p>
          </div>
          <div className="rounded-lg border border-purple-900/50 bg-gray-800/50 p-3">
        <div className="flex items-center gap-2 text-sm text-purple-300">
          <Zap className="h-4 w-4" />
          <span>Early adopter perks coming soon</span>
        </div>
      </div>
        </div>
        <AlertDialogFooter>
          <Button
            onClick={handleDismiss}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
          >
            I&apos;m ready to share!
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
