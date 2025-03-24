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
import { Button } from '@/components/ui/button';
import { useUserState } from '@/lib/store/user';
import { deleteUser } from '@/app/actions';
import { useToast } from '../ui/use-toast';

const DeleteUserAccountCard = () => {
  // get user data
  const user = useUserState(state => state.user);

  // destructure toast function
  const { toast } = useToast();

  const handleDeleteUser = async () => {
    if (!user) return;

    if (user.is_anonymous) {
      toast({
        title: 'Error deleting account',
        description: 'Anonymous users cannot delete accounts',
        variant: 'destructive',
      });
      return;
    }

    try {
      await deleteUser(user);
      toast({
        title: 'Account deleted',
        description: 'Your account has been successfully deleted.',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: 'Error deleting account',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full font-bold uppercase" disabled={user?.is_anonymous}>
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 font-semibold text-slate-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90"
              onClick={handleDeleteUser}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteUserAccountCard;
