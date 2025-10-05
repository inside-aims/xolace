import { FeedItem, calculateFeaturedPositions } from '@/lib/feedConfig';
import { EnhancedPost } from '@/queries/posts/getEnhancedFeed';
import { FeaturedCampfireWithMembership } from '@/queries/posts/useGetFeaturedCampfire';

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
 * @returns Array of feed items ready for rendering
 */
export function buildFeedItems(
  posts: EnhancedPost[],
  featuredCampfire: FeaturedCampfireWithMembership | null | undefined
): FeedItem[] {
  // Early return if no posts
  if (!posts || posts.length === 0) {
    return [];
  }

  // Calculate positions where featured campfire should appear
  const featuredPositions = calculateFeaturedPositions(posts.length);

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

    // Check if we should add a featured campfire after this post
    const shouldInsertFeatured = featuredPositions.has(index + 1) && featuredCampfire;
    
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