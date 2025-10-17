import { useCallback, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';

const POST_DRAFT_KEY = 'postFormDraft';

interface UsePostFormDraftProps {
  content: string;
  autoSaveEnabled: boolean;
  promptTextQuery?: string;
  setValue: (name: 'content', value: string, options?: { shouldValidate: boolean }) => void;
  onTagsExtracted?: (content: string) => void;
}

interface UsePostFormDraftReturn {
  clearDraft: () => void;
  loadDraft: () => void;
}

/**
 * Custom hook to manage post form draft functionality
 * 
 * Features:
 * - Auto-saves content to localStorage with debouncing
 * - Loads saved draft on mount
 * - Handles prompt prefilling
 * - Cleans up on unmount
 * 
 * @improvements
 * 1. Centralized draft logic (was scattered across 3 useEffects)
 * 2. Proper cleanup of debounced functions
 * 3. Type-safe return values
 * 4. Clear separation of concerns
 */
export function usePostFormDraft({
  content,
  autoSaveEnabled,
  promptTextQuery,
  setValue,
  onTagsExtracted,
}: UsePostFormDraftProps): UsePostFormDraftReturn {
  const isInitialMount = useRef(true);

  // Memoized debounced save function
  const debouncedSaveDraft = useRef(
    debounce((draftContent: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(POST_DRAFT_KEY, draftContent);
      }
    }, 500)
  ).current;

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(POST_DRAFT_KEY);
    }
  }, []);

  // Load draft from localStorage
  const loadDraft = useCallback(() => {
    if (typeof window === 'undefined') return;

    const savedDraft = localStorage.getItem(POST_DRAFT_KEY);
    if (savedDraft) {
      setValue('content', savedDraft, { shouldValidate: true });
      onTagsExtracted?.(savedDraft);
    }
  }, [setValue, onTagsExtracted]);

  // Initial load: Handle prompt prefill or load saved draft
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    if (promptTextQuery) {
      // Prefill from prompt and clear any existing draft
      const initialContent = `\n\n#DailyPrompt `;
      setValue('content', initialContent, { shouldValidate: true });
      onTagsExtracted?.(initialContent);
      clearDraft();
    } else if (autoSaveEnabled) {
      // Load saved draft if available
      loadDraft();
    }
  }, [promptTextQuery, autoSaveEnabled, setValue, onTagsExtracted, clearDraft, loadDraft]);

  // Auto-save content changes
  useEffect(() => {
    if (!autoSaveEnabled || !content) return;

    // Don't save if it's just the initial prompt pattern
    const initialPromptPattern = `\n\n#DailyPrompt `;
    const isInitialPrompt = promptTextQuery && content.trim() === initialPromptPattern.trim();

    if (!isInitialPrompt) {
      debouncedSaveDraft(content);
    }

    // Cleanup debounced function on unmount
    return () => {
      debouncedSaveDraft.cancel();
    };
  }, [content, autoSaveEnabled, promptTextQuery, debouncedSaveDraft]);

  // Clear draft when content is empty
  useEffect(() => {
    if (autoSaveEnabled && content === '') {
      clearDraft();
    }
  }, [content, autoSaveEnabled, clearDraft]);

  return {
    clearDraft,
    loadDraft,
  };
}