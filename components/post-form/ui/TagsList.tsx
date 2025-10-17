import React from 'react';
import { motion } from 'motion/react';

interface TagsListProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
  maxVisible?: number;
  className?: string;
}

/**
 * TagsList Component
 * 
 * Displays extracted hashtags with animations
 * 
 * @improvements
 * 1. Extracted tags display logic
 * 2. Animated tag appearance
 * 3. Optional click handlers for interactivity
 * 4. Configurable max visible tags
 * 5. Accessible with proper ARIA
 */
export function TagsList({
  tags,
  onTagClick,
  maxVisible,
  className = '',
}: TagsListProps) {
  if (tags.length === 0) return null;

  const visibleTags = maxVisible ? tags.slice(0, maxVisible) : tags;
  const hiddenCount = maxVisible && tags.length > maxVisible ? tags.length - maxVisible : 0;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} aria-label="Post tags">
      {visibleTags.map((tag, index) => (
        <motion.span
          key={`${tag}-${index}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className={`bg-primary text-primary-foreground rounded-full px-2 py-1 text-sm ${
            onTagClick ? 'cursor-pointer hover:opacity-80' : ''
          }`}
          onClick={() => onTagClick?.(tag)}
          role="listitem"
        >
          #{tag}
        </motion.span>
      ))}
      {hiddenCount > 0 && (
        <span className="text-muted-foreground rounded-full px-2 py-1 text-sm">
          +{hiddenCount} more
        </span>
      )}
    </div>
  );
}

/**
 * TagsWarning Component
 * 
 * Shows warning when tag limit is exceeded
 */
interface TagsWarningProps {
  currentCount: number;
  maxCount: number;
}

export function TagsWarning({ currentCount, maxCount }: TagsWarningProps) {
  if (currentCount <= maxCount) return null;

  return (
    <div className="text-amber-600 dark:text-amber-400 text-xs" role="alert">
      Only the first {maxCount} tags will be used ({currentCount} found)
    </div>
  );
}