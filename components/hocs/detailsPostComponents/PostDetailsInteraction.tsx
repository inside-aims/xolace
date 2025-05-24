'use client';

import React from 'react';
import { useUserState } from '@/lib/store/user';
import Image from 'next/image';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
import Loader from '@/components/shared/loaders/Loader';
import PostMetrics from '@/components/shared/PostMetrics';
import SaveToCollectionsButton from '@/components/shared/SaveToCollectionsButton';
import { moodMap } from '@/types';

const PostDetailsInteraction = ({ post }: { post: DetailPost }) => {
  // get user data
  const user = useUserState(state => state.user);
  // initialize supabase client
  const supabase = getSupabaseBrowserClient();

  // mood
  const postMood = moodMap[post?.mood] || moodMap['neutral'];

  const router = useRouter();

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEffect((): any => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listener = (payload: any) => {
      const eventType = payload.eventType;

      if (eventType === 'INSERT') {
        setComments((prevComments: Comment[]) => [
          ...prevComments,
          payload.new,
        ]);
      } else if (eventType === 'DELETE') {
        setComments((prevComments: Comment[]) =>
          prevComments.filter(
            (comment: Comment) => comment.id !== payload.old.id,
          ),
        );
      } else if (eventType === 'UPDATE') {
        setComments((prevComments: Comment[]) =>
          prevComments.map((comment: Comment) =>
            comment.id === payload.new.id ? payload.new : comment,
          ),
        );
      }
    };

    const subscription = supabase
      .channel('my-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          // filter: `ticket=eq.${ticket}`,
        },
        listener,
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <div className="w-full px-13">
      <div className="mt-1 mb-5 px-2">
        {user ? (
          <div className="flex items-center gap-5">
            <PostMetrics
              post={post}
              userId={user?.id || ''}
              votes={post.votes}
              section="details"
              commentLength={comments.length}
            />

            <div
              className={`flex items-center justify-center h-7 w-10 rounded-full ${
                postMood.style
              }`}
            >
              <span>
                {postMood.gif ? (
                  <Image
                    src={postMood.gif}
                    alt="Gif Emoji"
                    width={24}
                    height={24}
                    className="h-6"
                    unoptimized
                  />
                ) : (
                  postMood.emoji
                )}
              </span>

              {post?.expires_in_24hr && (
                <span className="animate-bounce duration-700 ease-in-out">
                  {' '}
                  ⏳
                </span>
              )}
            </div>

            <div>
              <SaveToCollectionsButton
                userId={user?.id || ''}
                createdBy={post.created_by}
                postId={post.id}
                postCollections={post.collections}
              />
            </div>
          </div>
        ) : (
          <div>Kindly refresh the page!!</div>
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
                    className="no-focus text-dark-1 dark:border-muted-dark dark:hover:border-muted-dark-hover mb-2 h-[42px] resize-none rounded-full outline-none dark:text-white"
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
              disabled={comment.length > 300 || false || isCreatingComment}
              type="submit"
              className="btn-depth active:btn-depth-active hover:btn-depth-hover w-12 rounded-full text-white"
            >
              {isCreatingComment ? (
                <div className="flex items-center justify-center gap-x-2">
                  {' '}
                  <Loader /> <span>Loading</span>
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
  );
};

export default PostDetailsInteraction;
