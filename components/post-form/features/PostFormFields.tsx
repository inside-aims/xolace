import React, { RefObject } from 'react';
import { Control } from 'react-hook-form';
import { PostTypeSelector, PostType } from '../ui/PostTypeSelector';
import { ToolsPopover } from '../ui/ToolsPopover';
import { PostTextArea } from '../ui/PostTextArea';
import { CarouselEditor } from '../ui/CarouselEditor';
import { TagsList } from '../ui/TagsList';
import { ActionBar } from '../ui/ActionBar';
import { EmojiPickerButton } from '../ui/EmojiPickerButton';
import { MoodSelector, SelectedMoodDisplay } from '../ui/MoodSelector';
import { MoodType } from '@/constants/moods';
import { VoiceInput } from './VoiceInput';
import { InfoPopover } from '../ui/InfoPopover';
import { toast } from 'sonner';

interface PostFormFieldsProps {
  // Form control
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  postType: PostType;
  is24HourPost: boolean;
  content: string;

  // Refs
  textareaRef: RefObject<HTMLTextAreaElement | null> | null;
  carouselTextareaRef: RefObject<HTMLTextAreaElement | null> | null;
  canvasRef: RefObject<HTMLCanvasElement | null> | null;

  // Tags
  tags: string[];
  onContentChange: (value: string) => void;

  // Carousel
  slides: string[];
  currentSlide: number;
  onSlideChange: (index: number, content: string) => void;
  onNavigateSlide: (index: number) => void;
  onAddSlide: () => void;
  onRemoveSlide: (index: number) => void;
  canAddSlide: boolean;
  canRemoveSlide: boolean;
  canNavigateNext: boolean;
  canNavigatePrev: boolean;

  // Mood
  selectedMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
  isTextareaFocused: boolean;
  showMoodTooltip: boolean;
  onMoodTooltipDismiss: () => void;

  // Emoji
  onEmojiSelect: (emoji: string) => void;

  // Voice
  onVoiceTranscription: (text: string) => void;

  // Placeholder
  currentPlaceholderText?: string;

  // Animation
  isAnimating: boolean;

  // Submit
  isLoading: boolean;
  isDisabled: boolean;

  // States
  showMoodPicker: boolean;
  setShowMoodPicker: (show: boolean) => void;
  isEmojiPickerOpen: boolean;
  setIsEmojiPickerOpen: (open: boolean) => void;

  // Focus handlers
  onTextareaFocus: () => void;
  onTextareaBlur: () => void;

  maxChars?: number;
}

/**
 * PostFormFields Component
 *
 * Orchestrates all form fields and their interactions
 *
 * @improvements
 * 1. Centralizes field coordination logic
 * 2. Manages field interactions (e.g., closing emoji picker when opening mood)
 * 3. Conditional rendering based on post type
 * 4. Reduces prop drilling through logical grouping
 * 5. Type-safe props interface
 */
export function PostFormFields({
  control,
  postType,
  is24HourPost,
  textareaRef,
  carouselTextareaRef,
  canvasRef,
  tags,
  onContentChange,
  slides,
  currentSlide,
  onSlideChange,
  onNavigateSlide,
  onAddSlide,
  onRemoveSlide,
  canAddSlide,
  canRemoveSlide,
  canNavigateNext,
  canNavigatePrev,
  selectedMood,
  onMoodChange,
  isTextareaFocused,
  showMoodTooltip,
  onMoodTooltipDismiss,
  onEmojiSelect,
  onVoiceTranscription,
  currentPlaceholderText,
  isAnimating,
  isLoading,
  isDisabled,
  showMoodPicker,
  setShowMoodPicker,
  isEmojiPickerOpen,
  setIsEmojiPickerOpen,
  onTextareaFocus,
  onTextareaBlur,
  maxChars = 500,
}: PostFormFieldsProps) {
  /**
   * Handle emoji picker state - close mood picker when opening
   */
  const handleEmojiPickerChange = (open: boolean) => {
    setIsEmojiPickerOpen(open);
    if (open) {
      setShowMoodPicker(false);
    }
  };

  /**
   * Handle mood picker state - close emoji picker when opening
   */
  const handleMoodPickerChange = (open: boolean) => {
    setShowMoodPicker(open);
    if (open) {
      setIsEmojiPickerOpen(false);
      onMoodTooltipDismiss();
    }
  };
/**
 * 🆕 Handle transcription errors
 */
  const handleVoiceError = (error: string) => {
    console.error('Voice transcription error:', error);
    toast.error('Voice transcription failed: ' + error);
  };

  return (
    <div className="space-y-4">
      {/* Post Type and Tools Row */}
      <div className="relative flex items-end justify-between">
        <PostTypeSelector
          control={control}
          name="type"
          disabled={isLoading || isAnimating}
        />

        <ToolsPopover
          control={control}
          is24HourFieldName="is24HourPost"
          is24HourPost={is24HourPost}
          disabled={isLoading || isAnimating}
        />
      </div>

      {/* Content Input - Single or Carousel */}
      {postType === 'single' ? (
        <PostTextArea
          control={control}
          name="content"
          textareaRef={textareaRef}
          canvasRef={canvasRef}
          onFocus={onTextareaFocus}
          onBlur={onTextareaBlur}
          onChange={onContentChange}
          currentPlaceholder={currentPlaceholderText}
          maxChars={maxChars}
          isAnimating={isAnimating}
          disabled={isLoading || isAnimating}
        />
      ) : (
        <CarouselEditor
          slides={slides}
          currentSlide={currentSlide}
          onSlideChange={onSlideChange}
          onNavigate={onNavigateSlide}
          onAddSlide={onAddSlide}
          onRemoveSlide={onRemoveSlide}
          onFocus={onTextareaFocus}
          onBlur={onTextareaBlur}
          canAddSlide={canAddSlide}
          canRemoveSlide={canRemoveSlide}
          canNavigateNext={canNavigateNext}
          canNavigatePrev={canNavigatePrev}
          maxChars={maxChars}
          disabled={isLoading || isAnimating}
          textareaRef={carouselTextareaRef}
          canvasRef={canvasRef}
          isAnimating={isAnimating}
        />
      )}

      {/* Tags Display */}
      {tags.length > 0 && <TagsList tags={tags} maxVisible={3} />}

      {/* Action Bar with Tools */}
      <ActionBar isLoading={isLoading} isDisabled={isDisabled || isAnimating}>
        {/* Info Popover */}
        <InfoPopover />

        {/* Emoji Picker */}
        <EmojiPickerButton
          onEmojiSelect={onEmojiSelect}
          disabled={isLoading || isAnimating}
          open={isEmojiPickerOpen}
          onOpenChange={handleEmojiPickerChange}
        />

        {/* Voice Input */}
        <VoiceInput
          onTranscriptionComplete={onVoiceTranscription}
          disabled={isLoading || isAnimating}
          onError={handleVoiceError}
        />

        {/* Mood Selector */}
        <MoodSelector
          selectedMood={selectedMood}
          onMoodChange={onMoodChange}
          isTextareaFocused={isTextareaFocused}
          showTooltip={showMoodTooltip}
          onTooltipDismiss={onMoodTooltipDismiss}
          disabled={isLoading || isAnimating}
          open={showMoodPicker}
          onOpenChange={handleMoodPickerChange}
        />

        {/* Selected Mood Display */}
        {selectedMood && <SelectedMoodDisplay mood={selectedMood} />}
      </ActionBar>
    </div>
  );
}
