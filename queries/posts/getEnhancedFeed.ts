import { useInfiniteQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

export interface EnhancedPost {
  id: string;
  created_at: string;
  created_by: string | null;
  author_name: string;
  content: string;
  mood: string;
  author_avatar_url: string | null;
  expires_in_24hr: boolean;
  duration: string | null;
  expires_at: string | null;
  downvotes: number;
  upvotes: number;
  is_sensitive: boolean;
  is_prompt_response: boolean;
  type: string;
  author_roles: (
    | 'normal_user'
    | 'verified'
    | 'blue_team'
    | 'help_professional'
    | 'mentor'
  )[];
  campfire_id: string | null;
  campfire_name: string | null;
  campfire_slug: string | null;
  campfire_icon_url: string | null;
  priority_score: number;
  is_new_post: boolean;
  is_campfire_post: boolean;
  posttags: Array<{ name: string }>;
  comments_count: number;
  views_count: number;
  collections: Array<{ user_id: string }>;
  post_slides: Array<{ slide_index: number; content: string }>;
  prompt_text: string | null;
  prompt_category: string | null;
}

interface FeedPage {
  posts: EnhancedPost[];
  nextOffset: number | null;
  hasMore: boolean;
}

const POSTS_PER_PAGE = 50;
const QUERY_STALE_TIME = 2 * 60 * 1000; // 2 minutes
const QUERY_CACHE_TIME = 3 * 60 * 1000; // 3 minutes

export function getEnhancedFeed(userId: string | undefined) {
  const supabase = getSupabaseBrowserClient();

  return useInfiniteQuery<FeedPage, Error>({
    queryKey: ['enhanced-feed', userId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const offset = pageParam as number;

      const { data, error } = await supabase.rpc('get_personalized_feed', {
        user_id_param: userId,
        page_size: POSTS_PER_PAGE,
        offset_param: offset,
      });

      if (error) {
        throw new Error(error.message);
      }

      const posts = data || [];
      const hasMore = posts.length === POSTS_PER_PAGE;
      const nextOffset = hasMore ? offset + POSTS_PER_PAGE : null;

      return {
        posts,
        nextOffset,
        hasMore,
      } as unknown as FeedPage;
    },
    getNextPageParam: lastPage => lastPage.nextOffset,
    initialPageParam: 0,
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_CACHE_TIME,
    enabled: !!userId,
    refetchOnWindowFocus: false,
    // Optimistic updates for better UX
    // Better loading state handling
    refetchOnMount: false, // Prevent unnecessary refetch if we have cached data
    // This ensures better performance on navigation
    networkMode: 'always',
  });
}

// Hook for getting flattened posts array
export function getEnhancedFeedPosts(userId: string | undefined) {
  const query = getEnhancedFeed(userId);

  const posts = query.data?.pages.flatMap(page => page.posts) ?? [];

  return {
    ...query,
    posts,
    totalPosts: posts.length,
  };
}
