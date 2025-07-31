'use client';

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
import { useUserState } from '@/lib/store/user';
import { Trash2, Telescope, Flag, Pin } from 'lucide-react';
import { usePostMutations } from '@/hooks/posts/usePostMutation';
import { usePinComment } from '@/hooks/posts/usePinComment';

type DropdownMenuProp = {
  comment?: boolean;
  content?: string;
  postDetail?: boolean;
  postCard?: boolean;
  postId?: string;
  postCreatedBy?: string;
  commentId?: number;
  commentCreatedBy?: string | number;
  commentPinnedStatus?: string;
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
  content,
  commentPinnedStatus,
}) => {
  const router = useRouter();
  const user = useUserState(state => state.user);

  const roles = useUserState(state => state.roles);
  const isModerator = roles.includes('blue_team');
  const isHealthProfessional =
    roles.includes('help_professional') && user?.id === commentCreatedBy;
  const canAuthorPin = user?.id === postCreatedBy;

  // Use the new hook
  const { deletePost, isDeletingPost, deleteComment, isDeletingComment } =
    usePostMutations();
  const { mutate: pinComment } = usePinComment(postId);

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
    if (commentId) {
      deleteComment({
        commentId,
        postId,
        postCreatedBy,
        content,
        userId: user?.id,
      });
    }
  };

  // delete post
  const onPostDelete = async () => {
    if (postId) {
      deletePost({ postId, postCreatedBy, content });
      // navigate to feed page if its the details page
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      postDetail && router.replace('/feed');
    }
  };

  const isLoading = isDeletingPost || isDeletingComment; // Combine loading states

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
        <DropdownMenuContent align="end" className="bg-bg dark:bg-bg-dark">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {canAuthorPin && commentId && (
            <DropdownMenuItem
              onClick={() => pinComment({ commentId, pinLevel: 'author' })}
            >
              <Pin />
              {commentPinnedStatus === 'author'
                ? 'Unpin Comment'
                : 'Pin as Author'}
            </DropdownMenuItem>
          )}

          {isHealthProfessional && commentId && (
            <DropdownMenuItem
              onClick={() =>
                pinComment({ commentId, pinLevel: 'professional' })
              }
            >
              <Pin />
              {commentPinnedStatus === 'professional'
                ? 'Unpin as Professional'
                : 'Pin as Professional'}
            </DropdownMenuItem>
          )}

          {(isCommentAuthor || isModerator) && comment && (
            <DropdownMenuItem
              className="text-red-400 hover:cursor-pointer"
              onClick={onCommentDelete}
              disabled={isLoading} // Disable while loading
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
          {(isPostAuthor || isModerator) && !comment && (
            <DropdownMenuItem
              className="text-red-400 hover:cursor-pointer hover:text-red-500"
              onClick={onPostDelete}
              disabled={isLoading} // Disable while loading
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
