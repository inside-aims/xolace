import { FeedItem, calculateFeaturedPositions, getHighlightedContentPositions } from '@/lib/feedConfig';
import { EnhancedPost } from '@/queries/posts/getEnhancedFeed';
import { FeaturedCampfireWithMembership } from '@/queries/posts/useGetFeaturedCampfire';
import { HighlightedContent } from '@/types/highlightedContent';

/**
 * Builds a unified feed items array with posts and featured content injected at calculated positions
 * 
 * This function is optimized for performance:
 * - Single pass through posts array (O(n) complexity)
 * - Uses Set for O(1) position lookups
 * - Creates stable keys for React reconciliation
 * - Memoization-friendly (pure function)
 * 
 * @param posts Array of enhanced posts
 * @param featuredCampfire Featured campfire data (optional)
 * @param highlightedContent Array of highlighted content (optional)
 * @returns Array of feed items ready for rendering
 */
export function buildFeedItems(
  posts: EnhancedPost[],
  featuredCampfire: FeaturedCampfireWithMembership | null | undefined,
  highlightedContent: HighlightedContent[] = []
): FeedItem[] {
  // Early return if no posts
  if (!posts || posts.length === 0) {
    return [];
  }

  // Calculate positions where featured campfire should appear
  const featuredPositions = calculateFeaturedPositions(posts.length);

   // Get positions for highlighted content and create a map
   const highlightPositions = getHighlightedContentPositions();
   const highlightMap = new Map<number, HighlightedContent>();
   
   // Distribute highlighted content across positions
   // Each highlight appears ONCE at its designated position
   highlightedContent.forEach((highlight, index) => {
     if (index < highlightPositions.length) {
       highlightMap.set(highlightPositions[index], highlight);
     }
   });

  // Build the feed items array
  const items: FeedItem[] = [];
  
  posts.forEach((post, index) => {
    // Add the post
    items.push({
      type: 'post',
      data: post,
      key: `post-${post.id}`,
      index: items.length
    });

    const postPosition = index + 1;

    // Check if we should add highlighted content after this post
    const highlightAtPosition = highlightMap.get(postPosition);
    if (highlightAtPosition) {
      items.push({
        type: 'highlighted_content',
        data: highlightAtPosition,
        key: `highlight-${postPosition}-${highlightAtPosition.id}`,
        index: items.length
      });
    }

    // Check if we should add a featured campfire after this post
    const shouldInsertFeatured = featuredPositions.has(postPosition) && 
    featuredCampfire &&
    !highlightAtPosition;
    
    if (shouldInsertFeatured) {
      items.push({
        type: 'featured',
        data: featuredCampfire,
        // Unique key that includes position to prevent React key conflicts
        key: `featured-${index + 1}-${featuredCampfire!.id}`,
        index: items.length
      });
    }
  });

  return items;
}

/**
 * Type guard to check if a feed item is a post
 */
export function isFeedPost(item: FeedItem): item is FeedItem<EnhancedPost> {
  return item.type === 'post';
}

/**
 * Type guard to check if a feed item is a featured campfire
 */
export function isFeaturedCampfire(item: FeedItem): item is FeedItem<FeaturedCampfireWithMembership> {
  return item.type === 'featured';
}

/**
 * Type guard to check if a feed item is highlighted content
 */
export function isHighlightedContent(item: FeedItem): item is FeedItem<HighlightedContent> {
  return item.type === 'highlighted_content';
}