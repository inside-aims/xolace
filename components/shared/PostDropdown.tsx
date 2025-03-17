'use client';

import { useState} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '../ui/use-toast';
import { useUserState } from '@/lib/store/user';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { Trash2, Telescope, Flag } from 'lucide-react';

type DropdownMenuProp = {
  comment?: boolean;
  postDetail?: boolean;
  postCard?: boolean;
  postId?: string;
  postCreatedBy?: string | number;
  commentId?: number;
  commentCreatedBy?: string | number;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostDropdown: React.FC<DropdownMenuProp> = ({
  comment,
  postDetail,
  postCard,
  postId,
  postCreatedBy,
  commentId,
  commentCreatedBy,
  onOpenChange,
}) => {
  const router = useRouter();
  const user = useUserState(state => state.user);

  const roles = useUserState((state) => state.roles);
  const isModerator = roles.includes('blue_team');
  
  const supabase = getSupabaseBrowserClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // open sheet
  const handleReportClick = () => {
    onOpenChange(true);
  };

  // check if user is author of the comment
  const isCommentAuthor = commentCreatedBy === user?.id;

  // check if user is the author of the post
  const isPostAuthor = postCreatedBy === user?.id;

  //  delete comment
  const onCommentDelete = async () => {
    setIsLoading(true);
    try {
      // await handleDelete({ comment, postCard, postId });
       await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
      toast({
        title: `Successfully Deleted Comment.💯 `,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error deleting comment:',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // delete post
  const onPostDelete = async () => {
    setIsLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (deleteError) {
        toast({
          title: 'Error deleting post',
          description: 'Oops! Something went wrong , please try again 👀 ',
        });
        return;
      }

      // display success toast
      toast({
        title: `Successfully Deleted Post.💯 `,
      });

      // navigate to feed page if its the details page
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      postDetail && router.replace('/feed');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error deleting post:',
      });
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {((isCommentAuthor || isModerator) && comment) && (
            <DropdownMenuItem
              className="text-red-400 hover:cursor-pointer"
              onClick={onCommentDelete}
            >
              <Trash2 />

              {isLoading
                ? 'Deleting...'
                : comment
                  ? 'Delete Comment'
                  : 'Delete Post'}
            </DropdownMenuItem>
          )}

          {/* delete action for post */}
          {((isPostAuthor || isModerator) && !comment) && (
            <DropdownMenuItem
              className="text-red-400 hover:cursor-pointer hover:text-red-500"
              onClick={onPostDelete}
            >
              <Trash2 size={'17px'} />
              <span>{isLoading ? 'Deleting...' : 'Delete Post'}</span>
            </DropdownMenuItem>
          )}

          {postCard && (
            <DropdownMenuItem className="hover:cursor-pointer">
              <Telescope size={16} strokeWidth={1.5} />
              <Link href={`post/${postId}`}>View</Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={handleReportClick}
          >
            <Flag size={16} strokeWidth={1.5} />
            <p className="">Report</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default PostDropdown;
