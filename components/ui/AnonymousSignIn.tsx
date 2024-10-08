import React from "react";
import { useRouter } from "next/navigation";

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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "./use-toast";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";

const AnonymousSignIn = () => {
  const supabase = getSupabaseBrowserClient();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignIn = async () => {
    // Implement your anonymous sign-in logic here

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      toast({
        title: "Error signing in anonymously:",
        description: error.message,
      });
      console.error("Error signing in anonymously:", error);
      return;
    }

    console.log("Data -> ", data);

    toast({
      title: "��� Anonymous Sign-in Successful!",
      description: "You've been signed in anonymously.",
    });
    // Redirect to the feed page or your desired page after successful sign-in
    router.push("/feed");
  };

  return (
    <div className="mt-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="secondary" className="w-full font-bold uppercase">
            Sign In Anonymously
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>About Signing in Anonymously </AlertDialogTitle>
            <AlertDialogDescription>
              By signing in anonymously, you'll be able to:
              <p className="mb-2">
                {" "}
                ✅ Add posts, like, and comment just like any other user.
              </p>
              However, keep in mind:
              <p> 📛 You cannot delete posts after they’re created.</p>
              <p>
                📛 If you log out, clear your browser, or switch devices, you
                will lose access to your account.
              </p>
              <p> 📛 You cannot recover this account once lost.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignIn}
              className=" font-semibold bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90"
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
