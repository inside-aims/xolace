'use client';

import React from 'react';
import { useUserState } from '@/lib/store/user';
import Image from 'next/image';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
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
import Loader from '@/components/shared/loaders/Loader';
import PostMetrics from '@/components/shared/PostMetrics';
import SaveToCollectionsButton from '@/components/shared/SaveToCollectionsButton';
import { moodMap } from '@/types';
import CommentCard from '@/components/cards/CommentCard';
// import View from '@/components/hocs/detailsPostComponents/View';
const View = dynamic(() => import('../../hocs/detailsPostComponents/View'), {
  ssr: false,
});

const PostDetailsInteraction = ({ post }: { post: DetailPost }) => {
  // get user data
  const user = useUserState(state => state.user);
  // initialize supabase client
  const supabase = getSupabaseBrowserClient();

  // mood
  const postMood = moodMap[post?.mood] || moodMap['neutral'];


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
    <div className="w-full px-13 max-md:hidden">
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

            <View id={post.id} createdBy={post.created_by} viewsCount={post.views[0].count || 0} content={post.content} />

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
          <div className="flex items-center gap-5 animate-pulse">
            <div className="flex items-center gap-1">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-7 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
              className="btn-depth active:btn-depth-active hover:btn-depth-hover min-w-12 max-w-20 rounded-full text-white"
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

     <div className='mt-10'>
     {comments
              .map((comment: Comment) => <CommentCard key={comment.id} comment={comment} className='border-none bg-transparent! p-0!' headerClassName='p-0!' contentClassName='pl-9 pb-0' />)
              .reverse()}
            {comments.length == 0 && (
               <div className="flex flex-col items-center justify-center space-y-4 py-5 text-center">
               <div className="relative">
                 <div className="animate-bounce">
                   💭
                 </div>
                 <div className="absolute -right-4 top-0 animate-bounce-delayed">
                   💭
                 </div>
                 <div className="absolute -left-4 top-2 animate-bounce-slow">
                   💭
                 </div>
               </div>
               <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                 Be the First to share your Experience!
               </h3>
               <p className="max-w-sm text-sm text-gray-600 dark:text-gray-400">
                 Start the conversation and share your thoughts. Your perspective matters!
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
