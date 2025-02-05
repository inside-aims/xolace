import React, {useState} from 'react';
import { useRouter } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
//import { Button } from '@/components/ui/button';
import { useToast } from './use-toast';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { generateRandomNumber } from '@/lib/utils';

const AnonymousSignIn = () => {
  const supabase = getSupabaseBrowserClient();
  const { toast } = useToast();
  const router = useRouter();
  const is_anonymous_user: boolean = true;

  // states
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    // Implement your anonymous sign-in logic here

   try {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      toast({
        title: 'Error signing in anonymously:',
        description: "Oops, looks like you couldn't get in right now, please try again 🤔",
      });
      console.error('Error signing in anonymously:', error);
      return;
    }

    if (!data.user) {
      toast({
        title: 'Error signing in anonymously:',
        description: 'There is no user data',
      });
      console.error('Error signing in anonymously:', error);
      return;
    }

    // extract user
    const AnonUser = data.user;

    //
    const { data: profileUser, error: profileError } = await supabase
      .from('profiles')
      .insert({
        username: `Anonymous${generateRandomNumber({ min: 1, max: 10000 })}`,
        supabase_user: AnonUser.id,
        avatar_url: `https://avatar.iran.liara.run/public/${generateRandomNumber({ min: 1, max: 100 })}`,
        is_anonymous: is_anonymous_user,
      })
      .select()
      .single();

    if(profileError){
      toast({
        title: 'Error signing in anonymously:',
        description: 'Masking you failed, why is that ? 🤔. Just try again I guess',
      });
      console.error('Error signing in anonymously:', profileError);
      return;
    }

    if(profileUser){
      toast({
        title: ' 🥷 Masked up and ready to explore! 🎭!',
        description: "You've been signed in anonymously.",
      });
      // Redirect to the feed page or your desired page after successful sign-in
      router.push('/feed');
    }
   } catch (error) {
    toast({
      title: 'Error signing in anonymously:',
      description: "Masking you failed, why is that ? 🤔",
    });
    console.error('Error signing in anonymously:', error);
   }
   finally {
    setIsLoading(false);
   }
  };

  return (
    <div className="mt-4 lg:mt-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            className="bg-gradient-to-b from-gray-500/70 to-gray-200/30 dark:from-black/70 dark:to-gray-600/40 border border-black/10 dark:border-white/30 rounded-lg backdrop-blur-md text-black dark:text-white px-5 py-2 text-base transition duration-500 hover:from-gray-300/80 hover:to-gray-200/40 dark:hover:from-gray-600/80 dark:hover:to-black/40"
            disabled={isLoading}
          >
            {isLoading ? 'Masking up...' : 'Activate Ghost Mode 👻'}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>About Signing in Anonymously </AlertDialogTitle>
            <AlertDialogDescription>
              By signing in anonymously, you&apos;ll be able to:
              <span className="mb-2 block">
                {' '}
                ✅ Add posts, like, and comment just like any other user.
              </span>
              However, keep in mind:
              <span className="block"> 📛 You cannot delete posts after they’re created.</span>
              <span className="block">
                📛 If you log out, clear your browser, or switch devices, you
                will lose access to your account            </span>
              <span className="block"> 📛 You cannot recover this account once lost.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignIn}
              className="bg-red-500 font-semibold text-slate-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90"
            >
              SignIn Anonymously
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnonymousSignIn;
