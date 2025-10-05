/**
 * Feed Configuration
 * Centralized configuration for feed behavior and featured content
 */

export const FEED_CONFIG = {
    /**
     * Posts per page when fetching from the API
     */
    POSTS_PER_PAGE: 50,
  
    /**
     * Query cache settings
     */
    QUERY_STALE_TIME: 2 * 60 * 1000, // 2 minutes
    QUERY_CACHE_TIME: 3 * 60 * 1000, // 3 minutes
  
    /**
     * Featured Campfire Configuration
     */
    FEATURED_CAMPFIRE: {
      /**
       * Show a featured campfire after every N posts
       * Adjust this number based on user feedback and engagement metrics
       * 
       * Recommended values:
       * - 8-10: Aggressive (more visibility, may feel spammy)
       * - 10-15: Balanced (good visibility without overwhelming)
       * - 15-20: Conservative (less intrusive, better UX)
       */
      INTERVAL: 10,
  
      /**
       * Maximum number of featured campfire cards to show in one feed session
       * Prevents over-saturation even on long scrolling sessions
       */
      MAX_APPEARANCES: 3,
  
      /**
       * Featured campfire data cache time
       * Can be longer since featured content doesn't change frequently
       */
      STALE_TIME: 15 * 60 * 1000, // 15 minutes
      CACHE_TIME: 30 * 60 * 1000, // 30 minutes
  
      /**
       * Enable/disable featured campfires globally
       * Useful for A/B testing or temporarily disabling the feature
       */
      ENABLED: true,
    },
  
    /**
     * Infinite Scroll Configuration
     */
    INFINITE_SCROLL: {
      /**
       * Root margin for intersection observer
       * Triggers loading before user reaches the bottom
       */
      ROOT_MARGIN: '100px',
  
      /**
       * Intersection threshold
       */
      THRESHOLD: 0,
    },
  
    /**
     * Scroll Restoration Configuration
     */
    SCROLL_RESTORATION: {
      /**
       * Delay before restoring scroll position (ms)
       * Gives time for posts to render
       */
      DELAY: 300,
  
      /**
       * Duration to highlight the last visible post (ms)
       */
      HIGHLIGHT_DURATION: 1500,
    },
  };
  
  /**
   * Helper function to calculate featured campfire positions
   * @param totalPosts Total number of posts in the feed
   * @returns Set of positions where featured campfires should appear
   */
  export function calculateFeaturedPositions(totalPosts: number): Set<number> {
    if (!FEED_CONFIG.FEATURED_CAMPFIRE.ENABLED) {
      return new Set();
    }
  
    const positions = new Set<number>();
    const { INTERVAL, MAX_APPEARANCES } = FEED_CONFIG.FEATURED_CAMPFIRE;
  
    const maxAppearances = Math.min(
      MAX_APPEARANCES,
      Math.floor(totalPosts / INTERVAL)
    );
  
    for (let i = 1; i <= maxAppearances; i++) {
      const position = i * INTERVAL;
      if (position < totalPosts) {
        positions.add(position);
      }
    }
  
    return positions;
  }
  
  /**
   * Type definitions for feed items
   */
  export type FeedItemType = 'post' | 'featured';
  
  export interface FeedItem<T = any> {
    type: FeedItemType;
    data: T;
    key: string;
    index: number;
  }