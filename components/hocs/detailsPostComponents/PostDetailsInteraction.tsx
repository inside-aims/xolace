'use client';

import React, { useMemo } from 'react';
import { useUserState } from '@/lib/store/user';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CommentSchema } from '@/validation';
import { useCommentMutation } from '@/hooks/posts/useCommentMutation';
import { DetailPost, Comment } from '@/types/global';
import { Send } from 'lucide-react';
import PostMetrics from '@/components/shared/PostMetrics';
import SaveToCollectionsButton from '@/components/shared/SaveToCollectionsButton';
import { useCommentSubscription } from '@/hooks/posts/useCommentSubscription';
import { DefaultLoader } from '@/components/shared/loaders/DefaultLoader';
import CommentChart from "@/components/cards/CommentChart";
import { useCommentThread } from '@/hooks/posts/use-comment-thread';
import { findCommentById } from '@/utils/helpers/getCommentById';

// import View from '@/components/hocs/detailsPostComponents/View';
const View = dynamic(() => import('../../hocs/detailsPostComponents/View'), {
  ssr: false,
});




const PostDetailsInteraction = ({ post }: { post: DetailPost }) => {
  // get user data
  const user = useUserState(state => state.user);
 // 1. Fetch the entire nested thread using our custom hook
 const { data: flatComments, isLoading , isFetching , isError} = useCommentThread(post.id);
 console.log("flat comments ",flatComments)

  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  // 3. Memoize the conversion from a flat list to a nested tree structure
  // const nestedComments = useMemo(() => {
  //   return flatComments ? nestComments(flatComments) : [];
  // }, [flatComments]);

  // states
  const [comments, setComments] = useState<Comment[]>(post?.comments || []);

  // TODO: Will probably fetch comments from the database in the future instead of using from post object

  // Use the comment mutation hook
  const { mutate: createComment, isPending: isCreatingComment } =
    useCommentMutation(post);

  //   counter for comment fields
  const counter: number = 300;

  // form validator
  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      comment: '',
    },
  });

  // get for changes in the comment field
  const { watch } = form;
  const comment = watch('comment');

  // submit comment form
  async function onSubmit(data: z.infer<typeof CommentSchema>) {
    const { comment } = data;

    if (!user?.id) {
      toast.error('Authentication Required', {
        description: 'Please log in to post a comment.',
      });
      return;
    }

    let parentId: number | undefined = undefined;
    let parentAuthorId: string | undefined = undefined;
    let depth = 0;

    // If we are replying, find the parent to determine the correct depth
    if (replyingTo && flatComments) {
        parentId = Number(replyingTo);
        const parentComment = findCommentById(flatComments, parentId);
        console.log("parent comment ",parentComment)
        console.log("depth ",depth)
        if (parentComment) {
            depth = parentComment.depth + 1;
            parentAuthorId = parentComment.created_by;
            console.log("depth in if",depth)
        }
    }

    createComment(
      {
        postId: post.id,
        commentText: comment,
        postCreatedBy: post.created_by ?? '',
        parentId,
        depth,
        parentAuthorId,
      },
      {
        onSuccess: () => {
          toast.success('Thanks for sharing your thoughts! 😆');
          form.reset();
        },
        onError: error => {
          toast.error('Failed to create comment', {
            description: error.message || 'Something went wrong.',
          });
        },
      },
    );
  }

  // real time updates
  useCommentSubscription({
    onInsert: newComment => {
      setComments(prev => [...prev, newComment]);
    },
    onUpdate: updatedComment => {
      setComments(prev =>
        prev.map(comment =>
          comment.id === updatedComment.id ? updatedComment : comment,
        ),
      );
    },
    onDelete: deletedId => {
      setComments(prev => prev.filter(comment => comment.id !== deletedId));
    },
  });

  const handleReply = (authorName: string, commentId: number) => {
    const mention = `@${authorName.replace(/\s+/g, '').toLowerCase()} `;
    form.setValue('comment', mention);
    setReplyingTo(commentId);
     const textarea = document.querySelector('textarea[name="comment"]') as HTMLTextAreaElement;
     if (textarea) {
      textarea.focus();
      setTimeout(() => {
        textarea.setSelectionRange(mention.length, mention.length);
          }, 0);
     }
   };

   // wrap in a useCallback
   const handleToggleExpanded = React.useCallback((commentId: number) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  }, [setExpandedComments]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // useEffect((): any => {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const listener = (payload: any) => {
  //     const eventType = payload.eventType;
  //     console.log(eventType)
  //     if (eventType === 'INSERT') {
  //       setComments((prevComments: Comment[]) => [
  //         ...prevComments,
  //         payload.new,
  //       ]);
  //       console.log("insert")
  //     } else if (eventType === 'DELETE') {
  //       setComments((prevComments: Comment[]) =>
  //         prevComments.filter(
  //           (comment: Comment) => comment.id !== payload.old.id,
  //         ),
  //       );
  //       console.log("delete")
  //     } else if (eventType === 'UPDATE') {
  //       setComments((prevComments: Comment[]) =>
  //         prevComments.map((comment: Comment) =>
  //           comment.id === payload.new.id ? payload.new : comment,
  //         ),
  //       );
  //       console.log("update")
  //     }
  //   };

  //   const subscription = supabase
  //     .channel('my-channel')
  //     .on(
  //       'postgres_changes',
  //       {
  //         event: '*',
  //         schema: 'public',
  //         table: 'comments',
  //         // filter: `ticket=eq.${ticket}`,
  //       },
  //       listener,
  //     )
  //     .subscribe();

  //   return () => subscription.unsubscribe();
  // }, [supabase]);

  return (
    <div className="w-full px-13 max-md:hidden">
      <div className="relative">
        <div className="mt-1 mb-10 px-2 ">
          {user ? (
            <div className="flex items-center gap-5">
              <PostMetrics
                post={post}
                userId={user?.id || ''}
                votes={post.votes}
                section="details"
                commentLength={comments.length}
              />

              <div className="flex items-center justify-center gap-2">
                {post?.expires_in_24hr && (
                  <div
                    className={`flex h-6 w-8 items-center justify-center rounded-full bg-zinc-400 dark:bg-zinc-700`}
                    id="mood-btn"
                  >
                  <span className="animate-bounce duration-700 ease-in-out">
                    {' '}
                    ⏳
                  </span>
                  </div>
                )}

                <div id="collection-btn">
                  <SaveToCollectionsButton
                    userId={user?.id || ''}
                    createdBy={post.created_by ?? ''}
                    postId={post.id}
                    postCollections={post.collections}
                  />
                </div>
              </div>

              <View
                id={post.id}
                createdBy={post.created_by ?? ''}
                viewsCount={post.views[0].count || 0}
                content={post.content}
              />


            </div>
          ) : (
            <div className="flex animate-pulse items-center gap-5">
              <div className="flex items-center gap-1">
                <div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-7 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          )}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <FormField
              control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Join the conversation"
                    className="no-focus! dark:hover:border-muted-dark-hover focus-visible:border-input mb-5 min-h-12 resize-none rounded-lg focus-visible:ring-0 w-full"
                    {...field}
                    cols={8}
                    rows={8}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row-reverse items-center justify-between">
            <Button
              size={'sm'}
              disabled={comment.length > 300 || false || isCreatingComment}
              type="submit"
              className="btn-depth active:btn-depth-active hover:btn-depth-hover max-w-20 min-w-12 rounded-full text-white"
            >
              {isCreatingComment ? (
                <div className="flex items-center justify-center gap-x-2">
                  {' '}
                  <DefaultLoader size={20} />
                </div>
              ) : (
                <Send size={20} strokeWidth={1.75} absoluteStrokeWidth />
              )}
            </Button>
            <p
              className={`border text-slate-900/90 dark:text-white ${
                counter - comment.length < 0
                  ? 'border-red-500 bg-red-400'
                  : 'border-blue bg-blue'
              } flex h-9 max-h-9 min-h-9 w-9 max-w-9 min-w-9 items-center justify-center rounded-full p-3 shadow-sm`}
            >
              {counter - comment.length}
            </p>
          </div>
        </form>
      </Form>
    </div>

      <div className="mt-8">
        {/*{comments*/}
        {/*  .map((comment: Comment) => (*/}
        {/*    <CommentCard*/}
        {/*      key={comment.id}*/}
        {/*      comment={comment}*/}
        {/*      className="border-none bg-transparent! p-0!"*/}
        {/*      headerClassName="p-0!"*/}
        {/*      contentClassName="pl-9 pb-0"*/}
        {/*    />*/}
        {/*  ))*/}
        {/*  .reverse()}*/}
        {/*<CommentThread comments={SampleComments}/>*/}
        {isLoading && isFetching && <p>Loading comments...</p>}
        {isError && <p>Error loading comments. Please reload page</p>}
        {!isLoading && flatComments && flatComments.length > 0 && (
          <CommentChart
            comments={flatComments}
            onReply={handleReply}
            replyingTo={replyingTo}
            expandedComments={expandedComments}
            onToggleExpanded={handleToggleExpanded}
          />
        )}
        {comments.length == 0 && (
          <div className="flex flex-col items-center justify-center space-y-4 py-5 text-center">
            <div className="relative">
              <div className="animate-bounce">💭</div>
              <div className="animate-bounce-delayed absolute top-0 -right-4">
                💭
              </div>
              <div className="animate-bounce-slow absolute top-2 -left-4">
                💭
              </div>
            </div>
            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
              Be the First to share your Experience!
            </h3>
            <p className="max-w-sm text-sm text-gray-600 dark:text-gray-400">
              Start the conversation and share your thoughts. Your perspective
              matters!
            </p>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              <span className="inline-block transform transition-transform hover:scale-110">
                👆 Just type above to join the discussion
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailsInteraction;
