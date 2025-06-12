'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Globe,
  ImageIcon,
  PaintRoller,
  Plus,
  Smile,
  Timer,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash.debounce';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
//import Loader from '../shared/loaders/Loader';
import { PostSchema } from '@/validation';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { moods } from '@/constants';
import { Send } from 'lucide-react';
// import MoodCarousel from '../hocs/createPostComponent/mood-carousel';
// import ShinyButton from '../ui/shiny-button';
import { calculateExpiryDate } from '@/lib/utils';
import { removeHashtags } from '@/lib/utils';
import { useUserState } from '@/lib/store/user';
import { logActivity } from '@/lib/activity-logger';
import { ActivityType } from '@/types/activity';
import { usePreferencesStore } from '@/lib/store/preferences-store';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
//import mascot from '../../public/assets/images/mas.webp';
import { CURRENT_CONSENT_VERSION } from '@/constants/terms';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { DefaultLoader } from '../shared/loaders/DefaultLoader';
import { NewBadge } from '../shared/NewBadge';

// Dynamic Imports
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
const ConsentModal = dynamic(() => import('../modals/ConsentModal'), {
  ssr: false,
});

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
  const [selectedMood, setSelectedMood] = useState(moods[1]);
  const [tags, setTags] = useState<string[]>([]);
  const [slides, setSlides] = useState(['']);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const carouselTextareaRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newDataRef = useRef<any[]>([]);
  const [animating, setAnimating] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [showConsent, setShowConsent] = useState(false);

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
  }, [handleVisibilityChange]);

  // get mood boolean value
  // const isNeutral = selectedMood?.value === 'neutral';
  // const isHappy = selectedMood?.value === 'happy';
  // const isSad = selectedMood?.value === 'sad';
  // const isAngry = selectedMood?.value === 'angry';
  // const isConfused = selectedMood?.value === 'confused';

  // Memoized mood boolean values
  // const moodClasses = useMemo(() => {
  //   const moodColors = {
  //     neutral: 'border-pink-500 dark:border-pink-400',
  //     happy: 'border-green-500 dark:border-green-400',
  //     sad: 'border-blue dark:border-sky-400',
  //     angry: 'border-red-500 dark:border-red-400',
  //     confused: 'border-yellow-500 dark:border-yellow-400',
  //   };
  //   return selectedMood
  //     ? moodColors[selectedMood.id as keyof typeof moodColors] || ''
  //     : '';
  // }, [selectedMood]);

  //  form
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      content: '',
      is24HourPost: false,
      type: 'single',
    },
  });

  // watch post realtime updates
  const { watch, setValue } = form;
  const content = watch('content');
  const postType = watch('type');
  const is24HourPost = watch('is24HourPost');

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
    const textarea =
      postType === 'single' ? textareaRef.current : carouselTextareaRef.current;
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
      //const decodedPromptText = decodeURIComponent(promptTextQuery);
      const initialContent = `\n\n#DailyPrompt `;

      setValue('content', initialContent, { shouldValidate: true });
      handleInput(initialContent);

      // Clear any saved draft if we are prefilling from a prompt
      if (typeof window !== 'undefined' && preferences?.auto_save_drafts) {
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
        //const decodedPromptText = decodeURIComponent(promptTextQuery);
        const initialContentPattern = `\n\n#DailyPrompt `;
        if (currentContent.trim() === initialContentPattern.trim()) {
          // check both with and without #DailyPrompt initially
          isInitialPromptFill = true;
        }
      }

      if (!isInitialPromptFill) {
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

  const addSlide = () => {
    if (slides.length < 10) {
      setSlides([...slides, '']);
      setCurrentSlide(slides.length);
    }
  };

  const removeSlide = (index: number) => {
    if (slides.length > 1) {
      const newSlides = slides.filter((_, i) => i !== index);
      setSlides(newSlides);
      if (currentSlide >= newSlides.length) {
        setCurrentSlide(newSlides.length - 1);
      }
    }
  };

  const updateSlide = (index: number, value: string) => {
    const newSlides = [...slides];
    newSlides[index] = value;
    setSlides(newSlides);
  };

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

    if (user?.has_consented) {
      if (user?.consent_version !== CURRENT_CONSENT_VERSION) {
        setShowConsent(true);
        return;
      }
    } else {
      setShowConsent(true);
      return;
    }

    vanishAndSubmit(); // Start animation

    setTimeout(async () => {
      // save post values to db
      setIsLoading(true);
      const { content, is24HourPost, type } = data;
      // remove tags from post content
      const contentWithoutTags = removeHashtags(content);
      const duration = is24HourPost ? 24 : null;
      const expires_at = duration ? calculateExpiryDate(duration) : null;

      // Filter out empty slides before submission
      const filteredSlides = slides.filter(slide => slide.trim() !== '');

      // remove hashtags from slides
      const slidesWithoutTags = filteredSlides.map(slide =>
        removeHashtags(slide),
      );

      try {
        // Get prompt_id from searchParams if it exists
        const promptId = searchParams.get('prompt_id');
        const promptText = searchParams.get('prompt');
        const is_prompt_response = promptId ? true : false;

        const { data: post_id, error: postError } = await supabase.rpc(
          'create_post_with_tags',
          {
            content: contentWithoutTags || slides[0],
            mood: selectedMood?.id,
            expires_in_24hr: is24HourPost,
            duration: duration ? `${duration}` : duration,
            expires_at,
            is_sensitive: preferences?.mark_sensitive_by_default ?? false,
            is_prompt_response,
            tag_names: tags,
            type,
            slide_contents: slidesWithoutTags,
          },
        );

        if (postError) {
          console.error('Error creating post:', postError);
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

        // Log the post creation activity
        if (user && post_id) {
          await logActivity({
            userId: user.id,
            entityType: ActivityType.POST,
            action: 'created',
            postId: post_id,
            metadata: {
              expires_in_24: is24HourPost,
              mood: selectedMood?.id,
              is_prompt_response: !!promptId,
              prompt_text: promptText || undefined,
              type: type,
            },
          });
        }

        // Clear the form and tags
        if (type === 'single') {
          form.reset();
          setSelectedMood(moods[1]);
          setTags([]);
          clearDraft();
        }
        {
          setSlides(['']);
          setSelectedMood(moods[1]);
          setTags([]);
          router.refresh();
        }

        if (promptId) {
          router.replace(pathname);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.error('Error creating post:', error);
        toast('Error!', {
          description: 'Ooops🫢 !! Could not create post, Please try again',
          position: 'bottom-center',
        });
      } finally {
        setIsLoading(false);
      }
    }, 800);
  }

  //
  const currentContent =
    postType === 'single' ? form.watch('content') : slides[currentSlide];
  const charCount = currentContent?.length || 0;
  const maxChars = 500;

  return (
    <div className="relative h-full">
      <Card className="mb-3 overflow-visible rounded-2xl border-none">
        <CardContent className="px-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-3 lg:mx-auto lg:w-2/3"
            >
              {/* Post Type Dropdown and 24h Expiry Toggle */}
              <div className="flex items-end justify-between relative">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="relative flex-1">
                      <FormLabel className="text-foreground text-sm font-medium">
                        Post Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-48 rounded-xl border-0">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border-border rounded-xl border shadow-xl">
                          <SelectItem
                            value="single"
                            className="hover:bg-muted cursor-pointer rounded-lg p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-3 w-3 items-center justify-center rounded-full bg-green-500">
                                <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="text-muted-foreground h-4 w-4" />
                                <span className="font-medium">Single Post</span>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="carousel"
                            className="hover:bg-muted cursor-pointer rounded-lg p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-3 w-3 items-center justify-center rounded-full bg-blue-500">
                                <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <ImageIcon className="text-muted-foreground h-4 w-4" />
                                <span className="font-medium">Carousel</span>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      <NewBadge size="sm" containerClass="absolute top-0 left-17" />
                    </FormItem>
                  )}
                />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`mb-2 rounded-xl transition-all duration-200 ${
                        is24HourPost
                          ? 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <PaintRoller className="mr-2 h-4 w-4" />
                      Tools
                      {is24HourPost && (
                        <div className="ml-2 h-2 w-2 animate-pulse rounded-full bg-purple-500"></div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="bg-background border-border w-80 rounded-xl border p-0 shadow-xl"
                    align="end"
                  >
                    <div className="p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <PaintRoller className="text-foreground h-5 w-5" />
                        <h3 className="text-foreground font-semibold">
                          Post Tools
                        </h3>
                      </div>

                      {/* tools popover */}
                      <div className="space-y-4">
                        {/* 24h Expiry Setting */}
                        <FormField
                          control={form.control}
                          name="is24HourPost"
                          render={({ field }) => (
                            <FormItem>
                              <div className="border-border hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`rounded-lg p-2 ${
                                      field.value
                                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                                  >
                                    <Timer className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <FormLabel className="text-foreground cursor-pointer text-sm font-medium">
                                      24h Auto-Delete
                                    </FormLabel>
                                    <p className="text-muted-foreground text-xs">
                                      Post will disappear after 24 hours
                                    </p>
                                  </div>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-purple-500"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />

                        {/* Future Settings Placeholder */}
                        <div className="space-y-2">
                          <div className="border-border flex items-center justify-between rounded-lg border border-dashed p-3 opacity-50">
                            <div className="flex items-center gap-3">
                              <div className="bg-muted text-muted-foreground rounded-lg p-2">
                                <Globe className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-muted-foreground text-sm font-medium">
                                  Visibility
                                </div>
                                <p className="text-muted-foreground text-xs">
                                  Coming soon
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* <div className="border-border flex items-center justify-between rounded-lg border border-dashed p-3 opacity-50">
                            <div className="flex items-center gap-3">
                              <div className="bg-muted text-muted-foreground rounded-lg p-2">
                                <Eye className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-muted-foreground text-sm font-medium">
                                  Comments
                                </div>
                                <p className="text-muted-foreground text-xs">
                                  Coming soon
                                </p>
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                {/* <FormField
                  control={form.control}
                  name="is24HourPost"
                  render={({ field }) => (
                    <FormItem>
                      <div className="bg-muted flex items-center gap-3 rounded-xl p-3">
                        <Clock className="text-muted-foreground h-4 w-4" />
                        <FormLabel className="text-foreground text-sm font-medium">
                          24h Expiry
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-lavender-500 data-[state=unchecked]:bg-white"
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                /> */}
              </div>

              {/* Content Input */}
              {postType === 'single' ? (
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <FormControl>
                          <Textarea
                            {...field}
                            ref={textareaRef}
                            onFocus={() => setIsTextareaFocused(true)}
                            onBlur={() => setIsTextareaFocused(false)}
                            onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>,
                            ) => {
                              field.onChange(e);
                              handleInput(e.target.value);
                              if (
                                e.target.value === '' &&
                                preferences?.auto_save_drafts
                              ) {
                                clearDraft();
                              }
                            }}
                            className={`border-border min-h-[140px] resize-none rounded-xl border-2 border-dashed bg-transparent text-base leading-relaxed transition-all duration-200 focus:border-purple-400 focus:ring-0 focus-visible:ring-0 ${animating && 'text-transparent dark:text-transparent'}`}
                            maxLength={maxChars}
                            id="tags-guide"
                            disabled={animating}
                          />
                        </FormControl>
                        <div className="text-muted-foreground absolute right-3 bottom-3 text-xs">
                          {charCount}/{maxChars}
                        </div>

                        {/* Canvas for animation */}
                        <canvas
                          ref={canvasRef}
                          className={`pointer-events-none absolute inset-0 z-10 pt-8 ${animating ? 'opacity-100' : 'opacity-0'} `}
                        />

                        <div className="pointer-events-none absolute inset-0 flex items-center rounded-md">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="space-y-4">
                  {/* Carousel Navigation */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentSlide(Math.max(0, currentSlide - 1))
                        }
                        disabled={currentSlide === 0}
                        className="h-9 w-9 rounded-full p-0"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-muted-foreground bg-muted rounded-full px-3 py-1 text-sm">
                        {currentSlide + 1} / {slides.length}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentSlide(
                            Math.min(slides.length - 1, currentSlide + 1),
                          )
                        }
                        disabled={currentSlide === slides.length - 1}
                        className="h-9 w-9 rounded-full p-0"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSlide}
                        disabled={slides.length >= 10}
                        className="h-9 w-9 rounded-full p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      {slides.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSlide(currentSlide)}
                          className="h-9 w-9 rounded-full p-0 text-red-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Carousel Content */}
                  <div className="relative">
                    <Textarea
                      ref={carouselTextareaRef}
                      value={slides[currentSlide]}
                      onChange={e => {
                        updateSlide(currentSlide, e.target.value);
                        handleInput(e.target.value);
                      }}
                      onFocus={() => setIsTextareaFocused(true)}
                      onBlur={() => setIsTextareaFocused(false)}
                      placeholder={`Slide ${currentSlide + 1} content... Tell part of your story here`}
                      className="border-border min-h-[140px] resize-none rounded-xl border-2 border-dashed bg-transparent text-base leading-relaxed transition-all duration-200 focus:ring-0 focus-visible:ring-0"
                      maxLength={maxChars}
                      id="tags-guide"
                      disabled={animating}
                    />
                    <div className="text-muted-foreground absolute right-3 bottom-3 text-xs">
                      {charCount}/{maxChars}
                    </div>

                    {/* Canvas for animation */}
                    <canvas
                      ref={canvasRef}
                      className={`pointer-events-none absolute inset-0 z-10 pt-8 ${animating ? 'opacity-100' : 'opacity-0'} `}
                    />
                  </div>

                  {/* Slide Indicators */}
                  <div className="flex justify-center gap-2 pt-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentSlide(index)}
                        className={`h-3 w-3 rounded-full transition-all duration-200 ${
                          index === currentSlide
                            ? 'scale-125 bg-purple-500 shadow-lg'
                            : slides[index].trim()
                              ? 'bg-purple-200 dark:bg-purple-700'
                              : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

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

              {/* Action Bar */}
              <div className="border-border flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-3">
                  {/* Emoji Button */}
                  <Popover
                    open={isEmojiPickerOpen}
                    onOpenChange={setIsEmojiPickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className=""
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

                  {/* Mood Button with Slow Pulse Animation */}
                  <div className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMoodPicker(!showMoodPicker)}
                      className={`rounded-xl p-3 transition-all duration-900 ${
                        isTextareaFocused || showMoodPicker
                          ? `${selectedMood.color} scale-110 animate-[pulse_9s_ease-in-out_infinite] text-white shadow-lg`
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {selectedMood.icon}
                    </Button>

                    {/* Mood Picker Dropdown */}
                    {showMoodPicker && (
                      <div className="bg-card border-border animate-in slide-in-from-top-2 absolute top-full left-0 z-50 mt-3 w-80 rounded-xl border p-4 shadow-2xl duration-200">
                        <h4 className="text-foreground mb-4 text-center font-semibold">
                          How are you feeling?
                        </h4>
                        <div className="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto">
                          {moods.map(mood => (
                            <button
                              key={mood.id}
                              type="button"
                              onClick={() => {
                                setSelectedMood(mood);
                                setShowMoodPicker(false);
                              }}
                              className={`rounded-xl p-3 transition-all duration-200 hover:scale-105 ${
                                selectedMood.id === mood.id
                                  ? `${mood.color} scale-105 text-white shadow-lg`
                                  : `bg-muted hover:bg-muted/80 text-foreground ${mood.hoverColor}`
                              }`}
                            >
                              <div className="flex flex-col items-center gap-1">
                                {mood.icon}
                                <span className="text-xs font-medium">
                                  {mood.label}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Current Mood Display */}
                  {selectedMood && (
                    <div className="bg-muted flex items-center gap-2 rounded-lg px-3 py-2">
                      <div
                        className={`h-2 w-2 rounded-full ${selectedMood.color}`}
                      ></div>
                      <span className="text-muted-foreground text-sm">
                        {selectedMood.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <ShinyButton
                  disabled={content.length > 500 || isLoading || animating}
                  type="submit"
                  className="rounded-full"
                  id="submit-btn"
                >
                  {isLoading ? (
                    <span className="flex gap-2">
                      <DefaultLoader size={20} />
                    </span>
                  ) : (
                    <>
                      <Send size={20} strokeWidth={1.75} absoluteStrokeWidth />
                    </>
                  )}
                </ShinyButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="flex h-full flex-col gap-y-20 md:gap-y-30 lg:gap-y-36">
        <div className="">
          <div className="container mx-auto px-3 pt-10 text-center text-sm text-zinc-600 md:pt-20">
            Tip : Platform made to share your experiences without holding back..
          </div>
          {/* <div className="item-center mt-7 flex justify-center md:mt-5">
            <Image src={mascot} height={130} width={130} alt="image" />
          </div> */}
        </div>

        <section className="flex flex-col items-center justify-center">
          <div className="flex flex-wrap justify-center gap-2 px-2 pb-4 text-xs text-slate-600/60 dark:text-slate-400/60">
            <span>
              <Link className="hover:text-slate-200 hover:underline" href="#">
                Xolace Rules
              </Link>
            </span>
            <span>
              <Link
                className="hover:text-slate-200 hover:underline"
                href="/policy"
              >
                Privacy Policy
              </Link>
            </span>
            <span>
              <Link
                className="hover:text-slate-200 hover:underline"
                href="/policy"
              >
                User Agreement
              </Link>
            </span>
            <span className="metadata-divider before:content-['•']"></span>
            <span>
              <Link className="hover:text-slate-200 hover:underline" href="#">
                Xolace, Inc. © 2025. All rights reserved.
              </Link>
            </span>
          </div>
        </section>
      </div>

      {showConsent && user && (
        <ConsentModal
          isOpen={showConsent}
          onReject={() => {
            setShowConsent(false);
          }}
          user={user}
        />
      )}
    </div>
  );
}
