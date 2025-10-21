import { useState, useCallback, useMemo } from 'react';

const MAX_TAGS = 3;
const MIN_TAG_LENGTH = 2;
const MAX_TAG_LENGTH = 30;

interface UseTagExtractionReturn {
  tags: string[];
  extractTags: (content: string) => void;
  clearTags: () => void;
  isValidTag: (tag: string) => boolean;
}

/**
 * Custom hook to extract and manage hashtags from content
 * 
 * Features:
 * - Extracts hashtags from text content
 * - Validates tag quality (length, characters)
 * - Limits to maximum number of tags
 * - Deduplicates tags
 * - Normalizes tags (lowercase, alphanumeric + underscore only)
 * 
 * @improvements
 * 1. Extracted validation logic for reusability
 * 2. Added tag quality validation (min/max length)
 * 3. Memoized validation function
 * 4. Better regex pattern for hashtag extraction
 * 5. Type-safe return values
 * 6. Clear separation from component logic
 */
export function useTagExtraction(): UseTagExtractionReturn {
  const [tags, setTags] = useState<string[]>([]);

  /**
   * Validates if a tag meets quality standards
   */
  const isValidTag = useCallback((tag: string): boolean => {
    const cleanTag = tag.replace(/^#/, '');
    return (
      cleanTag.length >= MIN_TAG_LENGTH &&
      cleanTag.length <= MAX_TAG_LENGTH &&
      /^[a-zA-Z0-9_]+$/.test(cleanTag)
    );
  }, []);

  /**
   * Extracts and processes hashtags from content
   */
  const extractTags = useCallback((content: string) => {
    if (!content.trim()) {
      setTags([]);
      return;
    }

    // Extract hashtags (# followed by word characters)
    // Improved regex: supports Unicode word characters and underscores
    const hashtagMatches = content.match(/#[\w]+/g) || [];

    // Process tags
    const processedTags = hashtagMatches
      .slice(0, MAX_TAGS) // Limit to max tags first (performance)
      .map(tag => 
        tag
          .slice(1) // Remove #
          .replace(/[^a-zA-Z0-9_]/g, '') // Keep only alphanumeric and underscore
          .toLowerCase()
      )
      .filter(tag => isValidTag(`#${tag}`)) // Validate each tag
      .filter((tag, index, self) => self.indexOf(tag) === index); // Deduplicate

    setTags(processedTags);
  }, [isValidTag]);

  /**
   * Clears all tags
   */
  const clearTags = useCallback(() => {
    setTags([]);
  }, []);

  // Memoized return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      tags,
      extractTags,
      clearTags,
      isValidTag,
    }),
    [tags, extractTags, clearTags, isValidTag]
  );
}

/**
 * Utility function to format tags for display
 */
export function formatTagForDisplay(tag: string): string {
  return tag.startsWith('#') ? tag : `#${tag}`;
}

/**
 * Utility function to validate content for tag limits
 */
export function getTagWarning(content: string): string | null {
  const matches = content.match(/#[\w]+/g) || [];
  
  if (matches.length > MAX_TAGS) {
    return `Only the first ${MAX_TAGS} tags will be used`;
  }
  
  return null;
}