'use client';

import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash.debounce';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
//import Loader from '../shared/loaders/Loader';
import { PostSchema } from '@/validation';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { postMoods } from '@/constants';
import { Send } from 'lucide-react';
// import MoodCarousel from '../hocs/createPostComponent/mood-carousel';
import { Mood } from '@/types';
// import ShinyButton from '../ui/shiny-button';
import { FloatingCheckbox } from '../create-postComponents/floating-checkbox';
import { calculateExpiryDate } from '@/lib/utils';
import { removeHashtags } from '@/lib/utils';
import { useUserState } from '@/lib/store/user';
import { logActivity } from '@/lib/activity-logger';
import { ActivityType } from '@/types/activity';
import { usePreferencesStore } from '@/lib/store/preferences-store';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Mascot from '../extras/mascot';
import img1 from '../extras/mas.webp'

// Dynamic Imports
const Loader = dynamic(() => import('../shared/loaders/Loader'), {
  ssr: false,
});
const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => <p className="p-4">Loading emojis...</p>,
});
const ShinyButton = dynamic(() => import('../ui/shiny-button'), {
  ssr: false,
  loading: () => (
    <Button disabled className="rounded-full disabled:bg-gray-900">
      <Send size={20} strokeWidth={1.75} absoluteStrokeWidth />
    </Button>
  ),
});
const MoodCarousel = dynamic(
  () => import('../hocs/createPostComponent/mood-carousel'),
  {
    ssr: false,
    loading: () => <div className="h-[50px] w-full rounded-full bg-gray-900" />,
  },
);

// Define a key for local storage
const POST_DRAFT_KEY = 'postFormDraft';

const placeholders = [
  "What's on your mind ?",
  'Use # for tags! At most 3',
  'Share your experiences',
];
export function PostForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { preferences } = usePreferencesStore();
  const supabase = getSupabaseBrowserClient();

  //get user profile
  const user = useUserState(state => state.user);

  // states
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(postMoods[0]);
  const [tags, setTags] = useState<string[]>([]);

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newDataRef = useRef<any[]>([]);
  const [animating, setAnimating] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder(prev => (prev + 1) % placeholders.length);
    }, 3000);
  };
  const handleVisibilityChange = () => {
    if (document.visibilityState !== 'visible' && intervalRef.current) {
      clearInterval(intervalRef.current); // Clear the interval when the tab is not visible
      intervalRef.current = null;
    } else if (document.visibilityState === 'visible') {
      startAnimation(); // Restart the interval when the tab becomes visible
    }
  };

  useEffect(() => {
    startAnimation();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [placeholders]);

  // get mood boolean value
  // const isNeutral = selectedMood?.value === 'neutral';
  // const isHappy = selectedMood?.value === 'happy';
  // const isSad = selectedMood?.value === 'sad';
  // const isAngry = selectedMood?.value === 'angry';
  // const isConfused = selectedMood?.value === 'confused';

  // Memoized mood boolean values
  const moodClasses = useMemo(() => {
    const moodColors = {
      neutral: 'border-pink-500 dark:border-pink-400',
      happy: 'border-green-500 dark:border-green-400',
      sad: 'border-blue dark:border-sky-400',
      angry: 'border-red-500 dark:border-red-400',
      confused: 'border-yellow-500 dark:border-yellow-400',
    };
    return selectedMood
      ? moodColors[selectedMood.value as keyof typeof moodColors] || ''
      : '';
  }, [selectedMood]);

  //  counter for comment fields
  const counter: number = 500;

  //  form
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      content: '',
      is24HourPost: false,
    },
  });

  // watch post realtime updates
  const { watch, setValue } = form;
  const content = watch('content');

  // Debounced function to save draft to local storage
  const debouncedSaveDraft = useCallback(
    debounce((draftContent: string) => {
      if (typeof window !== 'undefined' && preferences?.auto_save_drafts) {
        localStorage.setItem(POST_DRAFT_KEY, draftContent);
      }
    }, 500), // Debounce time: 500ms
    [preferences?.auto_save_drafts], // Recreate debounce function if preference changes
  );

  // Function to clear the draft from local storage
  const clearDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(POST_DRAFT_KEY);
    }
  };

  // function to handle emoji selection add to post field
  const handleEmojiClick = (emojiData: { emoji: string }) => {
    const emoji = emojiData.emoji;
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent =
        form.getValues('content').substring(0, start) +
        emoji +
        form.getValues('content').substring(end);
      form.setValue('content', newContent, { shouldValidate: true });

      // Set cursor position after the inserted emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    }
    setIsEmojiPickerOpen(false);
  };

  // retrieve tags from content
  const handleInput = useCallback(
    (value: string) => {
      const newTags = value.match(/#\w+/g) || [];
      const cleanTags = newTags
        .filter((_, index) => index < 3) // Limit to 3 tags
        .map(tag =>
          tag
            .slice(1)
            .replace(/[^a-zA-Z0-9_]/g, '')
            .toLowerCase(),
        );
      setTags([...new Set(cleanTags)]);
    },
    [setTags],
  ); // setTags is stable from useState

  // Effect to load draft or prefill from prompt on component mount
  useEffect(() => {
    const promptTextQuery = searchParams.get('prompt');

    if (promptTextQuery) {
      const decodedPromptText = decodeURIComponent(promptTextQuery);
      const initialContent = `Prompt: ${decodedPromptText}\n\n#DailyPrompt `;

      setValue('content', initialContent, { shouldValidate: true });
      handleInput(initialContent);

      // Clear any saved draft if we are prefilling from a prompt
      if (typeof window !== 'undefined' && preferences?.auto_save_drafts) {
        console.log('Clearing saved draft');
        localStorage.removeItem(POST_DRAFT_KEY);
      }
    } else if (typeof window !== 'undefined' && preferences?.auto_save_drafts) {
      const savedDraft = localStorage.getItem(POST_DRAFT_KEY);
      if (savedDraft) {
        setValue('content', savedDraft, { shouldValidate: true });
        handleInput(savedDraft);
      }
    }
  }, [searchParams, setValue, preferences?.auto_save_drafts, handleInput]);

  useEffect(() => {
    if (preferences?.auto_save_drafts) {
      // Do not save draft if the content is the initial prompt prefill unless modified
      const currentContent = form.getValues('content');
      const promptTextQuery = searchParams.get('prompt');
      let isInitialPromptFill = false;
      if (promptTextQuery) {
        const decodedPromptText = decodeURIComponent(promptTextQuery);
        const initialContentPattern = `Prompt: ${decodedPromptText}\n\n#DailyPrompt `;
        if (
          currentContent.trim() === initialContentPattern.trim() ||
          currentContent === `Prompt: ${decodedPromptText}\n\n`
        ) {
          // check both with and without #DailyPrompt initially
          console.log('isInitialPromptFill');
          isInitialPromptFill = true;
        }
      }

      if (
        !isInitialPromptFill ||
        (isInitialPromptFill &&
          content !==
            `Prompt: ${decodeURIComponent(promptTextQuery || '')}\n\n#DailyPrompt ` &&
          content !==
            `Prompt: ${decodeURIComponent(promptTextQuery || '')}\n\n`)
      ) {
        console.log('Saving draft');
        debouncedSaveDraft(content);
      }
    }
    return () => {
      debouncedSaveDraft.cancel();
    };
  }, [
    content,
    preferences?.auto_save_drafts,
    debouncedSaveDraft,
    searchParams,
    form.getValues,
    form,
  ]);

  // function to handle submit
  // Canvas drawing function
  const draw = useCallback(() => {
    if (!textareaRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = textareaRef.current.offsetWidth;
    canvas.height = textareaRef.current.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const computedStyles = getComputedStyle(textareaRef.current);
    const fontSize = parseFloat(computedStyles.getPropertyValue('font-size'));
    ctx.font = `${fontSize}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = computedStyles.color;

    // Split content by newlines to render multiple lines
    const lines = content.split('\n');
    const lineHeight = fontSize * 1.2;

    lines.forEach((line, index) => {
      ctx.fillText(line, 16, (index + 1) * lineHeight);
    });

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newData: any[] = [];

    for (let t = 0; t < canvas.height; t++) {
      const i = 4 * t * canvas.width;
      for (let n = 0; n < canvas.width; n++) {
        const e = i + 4 * n;
        if (
          pixelData[e] !== 0 ||
          pixelData[e + 1] !== 0 ||
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            ],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`,
    }));
  }, [content]);

  // Animation function
  const animate = (start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        if (!canvasRef.current) {
          return;
        }
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          ctx.clearRect(
            pos,
            0,
            canvasRef.current.width,
            canvasRef.current.height,
          );
          newDataRef.current.forEach(t => {
            const { x: n, y: i, r: s, color: color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setAnimating(false);
        }
      });
    };
    animateFrame(start);
  };

  // Trigger animation on submit
  const vanishAndSubmit = () => {
    if (animating || !content.trim()) return;

    setAnimating(true);
    draw();

    if (textareaRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0,
      );
      animate(maxX);
    }
  };

  // Modified onSubmit function
  async function onSubmit(data: z.infer<typeof PostSchema>) {
    if (animating) return; // Prevent multiple submissions during animation

    vanishAndSubmit(); // Start animation

    setTimeout(async () => {
      // save post values to db
      setIsLoading(true);
      const { content, is24HourPost } = data;
      // remove tags from post content
      const contentWithoutTags = removeHashtags(content);
      const duration = is24HourPost ? 24 : null;
      const expires_at = duration ? calculateExpiryDate(duration) : null;

      try {
        // Get prompt_id from searchParams if it exists
        const promptId = searchParams.get('prompt_id');
        const promptText = searchParams.get('prompt');
        const is_prompt_response = promptId ? true : false;

        const { data: post_id, error: postError } = await supabase.rpc(
          'create_post_with_tags',
          {
            content: contentWithoutTags,
            duration: duration ? `${duration}` : duration,
            expires_at,
            expires_in_24hr: is24HourPost,
            mood: selectedMood?.value,
            tag_names: tags,
            is_sensitive: preferences?.mark_sensitive_by_default ?? false,
            is_prompt_response,
          },
        );

        if (postError) {
          toast.error('Oops, something must have gone wrong 😵‍💫! try again', {
            position: 'bottom-center',
          });
          return;
        }

        // If this is a prompt response, create the prompt response record
        if (promptId && post_id && user) {
          const { error: promptResponseError } = await supabase
            .from('prompt_responses')
            .insert({
              post_id: post_id,
              prompt_id: promptId,
              user_id: user.id,
            });

          if (promptResponseError) {
            console.error(
              'Error creating prompt response:',
              promptResponseError,
            );
          }
        }

        // show notification
        if (promptId) {
          toast.success('Your response has been saved!🙂‍↕️', {
            position: 'bottom-center',
          });
        } else {
          toast.success('Post created successfully🤭 !', {
            position: 'bottom-center',
          });
        }

        console.log('come on');
        // Log the post creation activity
        if (user && post_id) {
          await logActivity({
            userId: user.id,
            entityType: ActivityType.POST,
            action: 'created',
            postId: post_id,
            metadata: {
              expires_in_24: is24HourPost,
              mood: selectedMood?.value,
              is_prompt_response: !!promptId,
              prompt_text: promptText || undefined,
            },
          });
        }

        // Clear the form and tags
        form.reset();
        setSelectedMood(postMoods[0]);
        setTags([]);
        clearDraft();

        if (promptId) {
          router.replace(pathname);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast('Error!', {
          description: 'Ooops🫢 !! Could not create post, Please try again',
          position: 'bottom-center',
        });
      } finally {
        setIsLoading(false);
      }
    }, 800);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 lg:mx-auto lg:w-2/3"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <div className="relative" id="postTextArea">
                  <Textarea
                    {...field}
                    ref={e => {
                      field.ref(e);
                      textareaRef.current = e;
                    }}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      field.onChange(e);
                      handleInput(e.target.value);
                      if (
                        e.target.value === '' &&
                        preferences?.auto_save_drafts
                      ) {
                        clearDraft();
                      }
                    }}
                    className={`no-focus text-dark-2 h-[150px] resize-none pt-8! pr-10! transition-all duration-300 dark:text-white ${moodClasses} ${animating && 'text-transparent dark:text-transparent'}`}
                    id="tags-guide"
                    disabled={animating}
                  />

                  {/* Canvas for animation */}
                  <canvas
                    ref={canvasRef}
                    className={`pointer-events-none absolute inset-0 z-10 pt-8 ${animating ? 'opacity-100' : 'opacity-0'} `}
                  />

                  {/* mood icon */}
                  <div
                    className="absolute bottom-3 left-3 flex items-center gap-x-1"
                    id="mood-display"
                  >
                    <span>
                      {selectedMood?.gif ? (
                        <Image
                          src={selectedMood?.gif}
                          alt="Sad Emoji"
                          width={24}
                          height={24}
                          className="h-6 sm:h-7 sm:w-7"
                          unoptimized
                        />
                      ) : (
                        selectedMood?.icon
                      )}
                    </span>
                    <p className="text-[12px] text-gray-900 dark:text-gray-500">
                      Mood:{' '}
                      <span className={`${moodClasses}`}>
                        {selectedMood?.label}
                      </span>
                    </p>
                  </div>

                  {/* emoji picker */}
                  <Popover
                    open={isEmojiPickerOpen}
                    onOpenChange={setIsEmojiPickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 bottom-2"
                        aria-label="Open emoji picker"
                        id="emoji-btn"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="end">
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        width="100%"
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        theme={'auto' as any}
                        height={370}
                        searchDisabled
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        emojiStyle={'apple' as any}
                        lazyLoadEmojis
                      />
                    </PopoverContent>
                  </Popover>

                  <div className="pointer-events-none absolute inset-0 flex items-center rounded-full">
                    <AnimatePresence mode="wait">
                      {!content && (
                        <motion.p
                          initial={{
                            y: 5,
                            opacity: 0,
                          }}
                          key={`current-placeholder-${currentPlaceholder}`}
                          animate={{
                            y: 0,
                            opacity: 1,
                          }}
                          exit={{
                            y: -15,
                            opacity: 0,
                          }}
                          transition={{
                            duration: 0.6,
                            ease: 'linear',
                          }}
                          className="w-[calc(100%-2rem)] truncate pl-4 text-left text-sm font-normal text-neutral-500 sm:pl-12 sm:text-base dark:text-zinc-500"
                        >
                          {placeholders[currentPlaceholder]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </FormControl>

              {/* checkbox*/}
              <FormField
                control={form.control}
                name="is24HourPost"
                render={({ field }) => (
                  <FloatingCheckbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="toggle24hr"
                  />
                )}
              />

              {/* tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-sm"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              )}

              <div className="h-4">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="mt-1! w-full max-sm:px-10" id="mood-carousel">
          <MoodCarousel
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
          />
        </div>

        <div className="flex flex-row-reverse items-center justify-between">
          <ShinyButton
            disabled={content.length > 500 || isLoading || animating}
            type="submit"
            className="rounded-full"
            id="submit-btn"
          >
            {isLoading ? (
              <span className="flex gap-2">
                <Loader />
                <p>Loading...</p>
              </span>
            ) : (
              <>
                <Send size={20} strokeWidth={1.75} absoluteStrokeWidth />
              </>
            )}
          </ShinyButton>
          <p
            className={`border text-slate-900/90 dark:text-white ${
              counter - content.length < 0
                ? 'border-red-500 bg-red-400'
                : 'border-blue bg-blue'
            } flex h-9 max-h-9 min-h-9 w-9 max-w-9 min-w-9 items-center justify-center rounded-full p-3 shadow-sm`}
            id="counter"
          >
            {counter - content.length}
          </p>
        </div>
      </form>

      <div className="container mx-auto px-3 pt-20 text-center text-sm text-zinc-600">
        Tip : Platform made to share your experiences without holding back..
      </div>
      <div className="flex justify-center item-center mt-7 md:mt-5">
      <Image src={img1} height={130} width={130} alt='image'/>
      {/* <Mascot id="mascot"/> */}
      </div>
      
    </Form>
  );
}
