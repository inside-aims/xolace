'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { PostSchema } from '@/validation';
import { moods } from '@/constants/moods';
import { useUserState } from '@/lib/store/user';
import { usePreferencesStore } from '@/lib/store/preferences-store';
import { CURRENT_CONSENT_VERSION } from '@/constants/terms';
import { getFeatureModalConfig } from '@/utils/featureModals';
import { useFeatureModal } from '@/hooks/useFeatureModal';
import { FeatureOverviewModal } from '@/components/modals/FeatureOverViewModal';
import { usePostSubmission } from '@/hooks/posts/usePostSubmission';
import { UserCampfire } from '@/components/campfires/campfire-selector';

// Hooks
import { usePostFormDraft } from '@/hooks/postForm/usePostFormDraft';
import { useTagExtraction } from '@/hooks/postForm/useTagExtraction';
import { useCarouselSlides } from '@/hooks/postForm/useCarouselSlides';
import { usePlaceholderAnimation } from '@/hooks/postForm/usePlaceholderAnimation';
import { useCanvasAnimation } from '@/hooks/postForm/useCanvasAnimation';
import { useMoodTooltip } from '@/hooks/postForm/useMoodTooltip';

// Components
import { CampfireSection } from '@/components/post-form/features/CampfireSection';
import { PostFormFields } from '@/components/post-form/features/PostFormFields';
import { PostFormFooter } from '@/components/post-form/ui/PostFormFooter';

// Dynamic Imports
const ConsentModal = dynamic(() => import('@/components/modals/ConsentModal'), {
  ssr: false,
});

const PLACEHOLDERS = [
  "What's on your mind?",
  'Use # for tags! At most 3',
  'Share your experiences',
];

interface PostFormProps {
  submitToSlug?: string;
  promptTextQuery?: string;
  promptIdQuery?: string;
}

/**
 * PostForm Component (Refactored)
 * 
 * Main post creation form with support for:
 * - Single posts and carousels
 * - Mood selection
 * - Tag extraction
 * - Draft auto-save
 * - Canvas animations
 * - Campfire selection
 * 
 * @improvements
 * - Reduced from 1000+ lines to ~250 lines
 * - Separated concerns into focused hooks and components
 * - Better testability and maintainability
 * - Improved performance with proper memoization
 * - Cleaner state management
 */
export function PostForm({
  submitToSlug,
  promptTextQuery,
  promptIdQuery,
}: PostFormProps) {
  const router = useRouter();
  const { preferences } = usePreferencesStore();
  const user = useUserState(state => state.user);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const carouselTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Form setup
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      content: '',
      is24HourPost: false,
      type: 'single',
    },
  });

  const { watch, setValue } = form;
  const content = watch('content');
  const postType = watch('type');
  const is24HourPost = watch('is24HourPost');

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState(moods[1]);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [selectedCampfire, setSelectedCampfire] = useState<UserCampfire | null>(null);

  // Custom Hooks
  const { tags, extractTags, clearTags } = useTagExtraction();
  
  const {
    slides,
    currentSlide,
    canAddSlide,
    canRemoveSlide,
    canNavigateNext,
    canNavigatePrev,
    addSlide,
    removeSlide,
    updateSlide,
    navigateToSlide,
    navigateNext,
    navigatePrev,
    resetSlides,
  } = useCarouselSlides('');

  const { clearDraft } = usePostFormDraft({
    content,
    autoSaveEnabled: preferences?.auto_save_drafts ?? false,
    promptTextQuery,
    setValue,
    onTagsExtracted: extractTags,
  });

  const { currentText: currentPlaceholder } = usePlaceholderAnimation({
    placeholders: PLACEHOLDERS,
    intervalDuration: 3000,
    enabled: true,
  });

  const { canvasRef, isAnimating, startAnimation } = useCanvasAnimation({
    textareaRef: postType === 'single' ? textareaRef : carouselTextareaRef,
    content: postType === 'single' ? content : slides[currentSlide],
    onAnimationComplete: () => {
      // Animation complete - form will submit
    },
  });

  const {
    showTooltip: showMoodTooltip,
    markAsSelected: markMoodAsSelected,
    resetTooltip: resetMoodTooltip,
  } = useMoodTooltip({
    hasContent: postType === 'single' ? !!content.trim() : slides.some(s => s.trim()),
    maxShowCount: 3,
  });

  // Post submission mutation
  const { submitPost, isSubmitting } = usePostSubmission();

  // Feature modal
  const modalConfig = getFeatureModalConfig('/create-post');
  const {
    isOpen: isFeatureModalOpen,
    hideModal: hideFeatureModal,
    dismissModal: dismissFeatureModal,
  } = useFeatureModal({
    config: modalConfig!,
    delay: 2000,
    autoShow: true,
  });

  /**
   * Handle content changes and extract tags
   */
  const handleContentChange = useCallback((value: string) => {
    extractTags(value);
  }, [extractTags]);

  /**
   * Handle emoji insertion
   */
  const handleEmojiSelect = useCallback((emoji: string) => {
    const textarea = postType === 'single' ? textareaRef.current : carouselTextareaRef.current;
    if (textarea) {
        console.log("textarea ", textarea)
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentContent = form.getValues('content');
      const newContent =
        currentContent.substring(0, start) +
        emoji +
        currentContent.substring(end);
      
      form.setValue('content', newContent, { shouldValidate: true });

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    }
    setIsEmojiPickerOpen(false);
  }, [postType, form]);

  /**
   * Handle mood change
   */
  const handleMoodChange = useCallback((mood: typeof moods[0]) => {
    setSelectedMood(mood);
    setShowMoodPicker(false);
    markMoodAsSelected();
  }, [markMoodAsSelected]);

  /**
   * Handle form submission
   */
  async function onSubmit(data: z.infer<typeof PostSchema>) {
    if (isAnimating || isSubmitting) return;

    // Check consent
    if (user?.has_consented) {
      if (user?.consent_version !== CURRENT_CONSENT_VERSION) {
        setShowConsent(true);
        return;
      }
    } else {
      setShowConsent(true);
      return;
    }

    // Start animation
    startAnimation();

    // Submit after animation
    setTimeout(async () => {
      try {
        setIsLoading(true);

        console.log("data content", data.content);
        await submitPost({
          content: data.content,
          is24HourPost: data.is24HourPost,
          type: data.type,
          selectedMood,
          tags,
          slides,
          selectedCampfire,
          promptId: promptIdQuery,
          promptText: promptTextQuery,
          userId: user.id,
          preferences,
        });

        // Reset form on success
        if (data.type === 'single') {
          form.reset();
          setSelectedMood(moods[1]);
          clearTags();
          clearDraft();
        } else {
          resetSlides();
          setSelectedMood(moods[1]);
          clearTags();
          router.refresh();
        }

        resetMoodTooltip();
      } catch (error) {
        console.error('Post submission error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 600);
  }

  // Calculate if submit should be disabled
  const currentContent = postType === 'single' ? content : slides[currentSlide];
  const isSubmitDisabled = 
    (postType === 'single' && (!content.trim() || content.length > 500)) ||
    (postType === 'carousel' && !slides.some(s => s.trim())) ||
    isLoading ||
    isAnimating;

  return (
    <div className="relative h-full">
      <Card className="mb-3 overflow-visible rounded-2xl border-none">
        <CardContent className="px-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-3 lg:mx-auto lg:w-2/3"
            >
              {/* Campfire Selection */}
              <CampfireSection
                userId={user?.id}
                selectedCampfire={selectedCampfire}
                onCampfireChange={setSelectedCampfire}
                submitToSlug={submitToSlug}
                disabled={isLoading || isAnimating}
              />

              {/* All Form Fields */}
              <PostFormFields
                control={form.control}
                postType={postType}
                is24HourPost={is24HourPost}
                content={content}
                textareaRef={textareaRef}
                carouselTextareaRef={carouselTextareaRef}
                canvasRef={canvasRef}
                tags={tags}
                onContentChange={handleContentChange}
                slides={slides}
                currentSlide={currentSlide}
                onSlideChange={updateSlide}
                onNavigateSlide={navigateToSlide}
                onAddSlide={addSlide}
                onRemoveSlide={removeSlide}
                canAddSlide={canAddSlide}
                canRemoveSlide={canRemoveSlide}
                canNavigateNext={canNavigateNext}
                canNavigatePrev={canNavigatePrev}
                selectedMood={selectedMood}
                onMoodChange={handleMoodChange}
                isTextareaFocused={isTextareaFocused}
                showMoodTooltip={showMoodTooltip}
                onMoodTooltipDismiss={markMoodAsSelected}
                onEmojiSelect={handleEmojiSelect}
                currentPlaceholderText={currentPlaceholder}
                isAnimating={isAnimating}
                isLoading={isLoading}
                isDisabled={isSubmitDisabled}
                showMoodPicker={showMoodPicker}
                setShowMoodPicker={setShowMoodPicker}
                isEmojiPickerOpen={isEmojiPickerOpen}
                setIsEmojiPickerOpen={setIsEmojiPickerOpen}
                onTextareaFocus={() => setIsTextareaFocused(true)}
                onTextareaBlur={() => setIsTextareaFocused(false)}
                maxChars={500}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Footer */}
      <PostFormFooter />

      {/* Modals */}
      {showConsent && user && (
        <ConsentModal
          isOpen={showConsent}
          onReject={() => setShowConsent(false)}
          user={user}
        />
      )}

      {modalConfig && (
        <FeatureOverviewModal
          isOpen={isFeatureModalOpen}
          onClose={hideFeatureModal}
          config={modalConfig}
          onDismissForever={dismissFeatureModal}
        />
      )}
    </div>
  );
}