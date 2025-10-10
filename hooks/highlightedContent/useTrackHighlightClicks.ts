import { useMutation } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { TrackHighlightClickParams } from '@/types/highlightedContent';

/**
 * Hook to track clicks on highlighted content buttons
 * 
 * Tracks which button users click:
 * - 'health_tip' - User clicked "Read Article" button
 * - 'glimpse' - User clicked "Watch Video" button
 * 
 * Fire-and-forget pattern:
 * - Does not block UI
 * - Fails silently
 * - No loading states needed
 * 
 * Performance: ~10-20ms (background)
 */
export function useTrackHighlightClick() {
  const supabase = getSupabaseBrowserClient();

  return useMutation<void, Error, TrackHighlightClickParams>({
    mutationFn: async ({ highlightId, clickType }) => {
      // ============================================
      // OPTION 1: Using RPC function (recommended)
      // ============================================
      const { error } = await supabase.rpc('track_highlight_click', {
        p_highlight_id: highlightId,
        p_click_type: clickType,
      });

      if (error) {
        console.warn('Failed to track highlight click:', error);
        // Don't throw - fail silently
      }

      // ============================================
      // OPTION 2: Direct update (if RPC not available)
      // ============================================
      /*
      const field = clickType === 'health_tip' 
        ? 'health_tip_clicks' 
        : 'glimpse_clicks';

      const { error } = await supabase
        .from('highlighted_feed_content')
        .update({ [field]: supabase.raw(`${field} + 1`) })
        .eq('id', highlightId);

      if (error) {
        console.warn('Failed to track highlight click:', error);
      }
      */
    },
    // Fire and forget - no need for callbacks
    retry: false,
  });
}

/**
 * Simplified tracking function for inline use
 * Doesn't require hook, can be called anywhere
 * 
 * Usage:
 * ```typescript
 * trackHighlightClickDirect(highlightId, 'health_tip');
 * ```
 */
export async function trackHighlightClickDirect(
  highlightId: string,
  clickType: 'health_tip' | 'glimpse'
): Promise<void> {
  try {
    const supabase = getSupabaseBrowserClient();
    
    await supabase.rpc('track_highlight_click', {
      p_highlight_id: highlightId,
      p_click_type: clickType,
    });
  } catch (error) {
    console.warn('Failed to track highlight click:', error);
    // Fail silently
  }
}