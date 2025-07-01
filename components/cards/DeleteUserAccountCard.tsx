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
import {toast} from 'sonner'

const DeleteUserAccountCard = () => {
  // get user data
  const user = useUserState(state => state.user);

  const handleDeleteUser = async () => {
    if (!user) return;

    if (user.is_anonymous) {
      toast.error('Anonymous users cannot delete accounts');
      return;
    }

    try {
      await deleteUser(user);
      toast.success('Account deleted successfully');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className='w-full'>
      <AlertDialog>
        <AlertDialogTrigger className='w-full' asChild>
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
