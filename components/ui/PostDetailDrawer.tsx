'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import clsx from 'clsx';
import { Textarea } from './textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import CommentCard from '../cards/CommentCard';

import PostMetrics from '../shared/PostMetrics';
import { toast } from 'sonner';
import Loader from '../shared/loaders/Loader';
import { CommentSchema } from '@/validation';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useUserState } from '@/lib/store/user';
import { Send } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Comment, DetailPost } from '@/types/global';
import { useCommentMutation } from '@/hooks/posts/useCommentMutation';
import { useCommentSubscription } from '@/hooks/posts/useCommentSubscription';

type Type = string | string[] | undefined;

const PostDetailDrawer = ({ post, type }: { post: DetailPost; type: Type }) => {
  // get user data
  const user = useUserState(state => state.user);
  // initialize supabase client
  const supabase = getSupabaseBrowserClient();

  const router = useRouter();

  // states
  const [comments, setComments] = useState<Comment[]>(post?.comments || []);

  // TODO: Will probably fetch comments from the database in the future instead of using from post object

  // Use the comment mutation hook
  const { mutate: createComment, isPending: isCreatingComment } =
    useCommentMutation(post);

  //   counter for comment fields
  const counter: number = 300;

  // Define different snap points based on `type`
  const defaultSnapPoints = ['180px', '355px', 1];
  const expandedSnapPoints = [1]; // Fully expanded snap point

  // set the initial snap points
  const [snapPoints, setSnapPoints] = useState(
    type ? expandedSnapPoints : defaultSnapPoints,
  );
  const [snap, setSnap] = useState<number | string | null>(type ? 1 : '180px');

  useEffect(() => {
    if (type) {
      // Initially set the snap points to the expanded state
      setSnapPoints(expandedSnapPoints);
      setSnap(1); // Fully expanded

      // Revert back to the default snap points after a delay
      const timer = setTimeout(() => {
        setSnapPoints(defaultSnapPoints);
      }, 1000); // Adjust the timeout as needed

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

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

    createComment(
      {
        postId: post.id,
        commentText: comment,
        postCreatedBy: post.created_by,
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
    onInsert: (newComment) => {
      setComments(prev => [...prev, newComment]);
    },
    onUpdate: (updatedComment) => {
      setComments(prev =>
        prev.map(comment =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );
    },
    onDelete: (deletedId) => {
      setComments(prev => prev.filter(comment => comment.id !== deletedId));
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // useEffect((): any => {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const listener = (payload: any) => {
  //     const eventType = payload.eventType;

  //     if (eventType === 'INSERT') {
  //       setComments((prevComments: Comment[]) => [
  //         ...prevComments,
  //         payload.new,
  //       ]);
  //       console.log("updated")
  //     } else if (eventType === 'DELETE') {
  //       setComments((prevComments: Comment[]) =>
  //         prevComments.filter(
  //           (comment: Comment) => comment.id !== payload.old.id,
  //         ),
  //       );
  //       console.log("deleted")
  //     } else if (eventType === 'UPDATE') {
  //       setComments((prevComments: Comment[]) =>
  //         prevComments.map((comment: Comment) =>
  //           comment.id === payload.new.id ? payload.new : comment,
  //         ),
  //       );
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
    <>
      <Drawer
        open
        snapPoints={snapPoints}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        modal={false}
        repositionInputs={false}
      >
        <DrawerContent
          aria-describedby={undefined}
          className="h-full max-h-[97%] sm:hidden! dark:bg-bg-dark"
        >
          <VisuallyHidden>
            <DrawerTitle>Post Detail Drawer</DrawerTitle>
          </VisuallyHidden>
          <DrawerHeader className="relative flex flex-col items-center">
            <button
              className=" absolute left-5 max-sm:top-3 md:left-10 dark:bg-muted-dark hover:bg-muted-dark-hover flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-gray-700 no-underline"
              onClick={() => router.back()}
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            {user ? (
              <PostMetrics
                post={post}
                userId={user?.id || ''}
                votes={post.votes}
                section="details"
                commentLength={comments.length}
              />
            ) : (
              <div>Kindly refresh the page!!</div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full md:w-1/2 mt-3"
              >
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Join the conversation..."
                          className="no-focus text-dark-1 dark:border-muted-dark dark:hover:border-muted-dark-hover mb-3 min-h-10! rounded-lg resize-none outline-none dark:text-white focus-visible:ring-0  focus-visible:border-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row-reverse items-center justify-between">
                  <Button
                    size={'sm'}
                    disabled={
                      comment.length > 300 || false || isCreatingComment
                    }
                    type="submit"
                    className="btn-depth active:btn-depth-active hover:btn-depth-hover max-w-20 min-w-12 rounded-full text-white"
                  >
                    {isCreatingComment ? (
                      <div className="flex items-center justify-center gap-x-2">
                        {' '}
                        <Loader />
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
          </DrawerHeader>

          <div
            className={clsx(
              'mx-auto flex w-full flex-col p-4 pt-5 max-sm:max-w-md md:w-1/2',
              {
                'overflow-y-auto': snap === 1,
                'overflow-hidden': snap !== 1,
              },
            )}
          >
            {comments
              .map((comment: Comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  className="bg-transparent! border-0 pl-0!"
                  headerClassName="px-0 py-0!"
                  contentClassName="pl-10 pb-0"
                />
              ))
              .reverse()}
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
                  Start the conversation and share your thoughts. Your
                  perspective matters!
                </p>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                  <span className="inline-block transform transition-transform hover:scale-110">
                    👆 Just type above to join the discussion
                  </span>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PostDetailDrawer;
