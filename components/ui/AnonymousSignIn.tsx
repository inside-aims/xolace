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
import { toast } from 'sonner';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { generateRandomNumber } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Key, Shield, ShieldAlert, VenetianMask, XCircle } from 'lucide-react';

const AnonymousSignIn = () => {
  const supabase = getSupabaseBrowserClient();
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
      toast.error("Oops, looks like you couldn't get in right now, please try again 🤔");
      console.error('Error signing in anonymously:', error);
      return;
    }

    if (!data.user) {
      toast.error('There is no user data');
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
      toast.error('Masking you failed, why is that ? 🤔. Just try again I guess');
      console.error('Error signing in anonymously:', profileError);
      return;
    }

    if(profileUser){
      //toast.success(' 🥷 Masked up and ready to explore! 🎭!');
      // Redirect to the feed page or your desired page after successful sign-in
      router.push('/feed');
    }
   } catch (error) {
    toast.error("Masking you failed, why is that ? 🤔");
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
            className="bg-linear-to-b from-lavender-500/70 to-lavender-200/30 dark:from-lavender-700/70 dark:to-lavender-500/40 border border-lavender-500/10 dark:border-white/30 rounded-lg backdrop-blur-md text-black dark:text-white px-5 py-2 text-base transition duration-500 hover:from-lavender-300/80 hover:to-lavender-200/40 dark:hover:from-lavender-600/80 dark:hover:to-lavender-500/40 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? 'Masking up...' : 'Activate Ghost Mode 👻'}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-0 bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 w-full max-w-[95%] sm:max-w-md">
  <AlertDialogHeader>
    <div className="flex items-center gap-3">
      <div className="rounded-full bg-gray-700 p-2">
        <VenetianMask className="h-6 w-6 text-purple-400" /> 
      </div>
      <AlertDialogTitle className="text-left text-xl font-bold">
      Anonymous Sign-In 👻
      </AlertDialogTitle>
    </div>
    <AlertDialogDescription>
    Jump in, no strings attached. Signing in anonymously lets you:
    </AlertDialogDescription>
    </AlertDialogHeader>
    
    <div className="mt-4 space-y-3 text-gray-300 text-sm">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
        <span>Post, vote, and comment freely</span>
      </div>
      
      <div className="border-t border-gray-700 pt-3 ">
        <p className="mb-2 flex items-center gap-2 font-medium text-amber-300">
          <AlertTriangle className="h-4 w-4" />
          Important limitations:
        </p>
        <ul className="space-y-2 pl-1">
          <li className="flex items-start gap-2">
            <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-400/80" />
            <span>Account can&apos;t be deleted or recovered if lost</span>
          </li>
          <li className="flex items-start gap-2">
            <Key className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400/80" />
            <span>Browser data = your only key (clear it and it&apos;s gone)</span>
          </li>
          <li className="flex items-start gap-2">
          <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500/80" />
            <span>Anonymous access is temporary and non-transferable</span>
          </li>
        </ul>
      </div>
    </div>
  
  
  <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
    <AlertDialogCancel className="mt-0 font-bold border-none bg-ocean-600 dark:bg-ocean-600 text-gray-200 hover:bg-ocean-700/80 hover:text-gray-200">
      Sign-up Instead
    </AlertDialogCancel>
    <AlertDialogAction
      onClick={handleSignIn}
      className="bg-gradient-to-r from-lavender-600 to-rose-400  shadow-lg hover:from-lavender-700 hover:to-rose-500 text-gray-200"
    >
      <Shield className="mr-2 h-4 w-4" />
      Enter Ghost Mode
    </AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnonymousSignIn;
