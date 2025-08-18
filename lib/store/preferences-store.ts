import { create } from 'zustand';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';
import { useUserState } from './user'; // Assuming user store provides the user ID
import {toast } from 'sonner';

// Define types based on your Supabase schema (adjust if needed)
export type ThemeOptions = 'system' | 'light' | 'dark';
export type PrivacyOptions = 'public' | 'private' | 'followers_only'; // Example options

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: ThemeOptions;
  preferred_language: string;
  privacy: PrivacyOptions;
  show_sensitive_content: boolean;
  mark_sensitive_by_default: boolean;
  guided_tour_enabled: boolean;
  auto_save_drafts: boolean;
  daily_prompt_enabled: boolean;
  allow_anonymous_replies: boolean;
  created_at: string;
  updated_at: string;
}

// Define the store state and actions
interface PreferencesState {
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  fetchPreferences: () => Promise<void>;
  updatePreference: <
    K extends keyof Omit<
      UserPreferences,
      'id' | 'user_id' | 'created_at' | 'updated_at'
    >,
  >(
    key: K,
    value: UserPreferences[K],
  ) => Promise<void>;
  resetPreferences: () => void;
}

// Default preferences (used if no record exists for the user yet)
const defaultPreferences: Omit<
  UserPreferences,
  'id' | 'user_id' | 'created_at' | 'updated_at'
> = {
  theme: 'system',
  preferred_language: 'en',
  privacy: 'public',
  show_sensitive_content: false,
  mark_sensitive_by_default: false,
  guided_tour_enabled: true,
  auto_save_drafts: false,
  daily_prompt_enabled: false,
  allow_anonymous_replies: false,
};

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  preferences: null,
  isLoading: false,
  error: null,

  fetchPreferences: async () => {
    const user = useUserState.getState().user;
    if (!user) {
      console.warn(
        'PreferencesStore: User not available for fetching preferences.',
      );
      set({
        preferences: null,
        isLoading: false,
        error: 'User not authenticated',
      });
      return;
    }

    set({ isLoading: true, error: null });
    const supabase = getSupabaseBrowserClient();

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116: row not found
        throw error;
      }

      if (data) {
        set({ preferences: data as UserPreferences, isLoading: false });
      } else {
        // No preferences found, potentially set defaults
        set({
          preferences: {
            ...defaultPreferences,
            id: '', // No real ID yet
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          isLoading: false,
        });
      }
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error fetching user preferences:', error);
      set({
        error: 'Failed to fetch preferences',
        isLoading: false,
        preferences: null,
      });
    }
  },

  updatePreference: async (key, value) => {
    const user = useUserState.getState().user;
    const currentPreferences = get().preferences;

    if (!user) {
      set({ error: 'User not authenticated' });
      return;
    }
    if (!currentPreferences) {
      set({ error: 'Preferences not loaded' });
      return;
    }

    set({ isLoading: true }); // Indicate loading state for the update
    const supabase = getSupabaseBrowserClient();

    try {
      // Optimistic update locally first
      const updatedPrefs = {
        ...currentPreferences,
        [key]: value,
        updated_at: new Date().toISOString(),
      };
      set({ preferences: updatedPrefs, isLoading: false }); 

      const { error } = await supabase
        .from('user_preferences')
        .update({ [key]: value })
        .eq('user_id', user.id);

      if (error) {
        // Revert optimistic update on error
        set({
          preferences: currentPreferences,
          error: `Failed to update ${key}`,
        });
        toast.error(`Failed to update ${key}`);
        throw error;
      }

      //toast.success(`Updated ${key} successfully`);
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(`Error updating preference ${key}:`, error);
      // State is already reverted in the catch block for the Supabase call
    }
  },

  resetPreferences: () => {
    set({ preferences: null, isLoading: false, error: null });
  },
}));

// Function to initialize the store
export const initializePreferences = async () => {
  // Ensure user state is potentially loaded first
  await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for user state hydration
  const user = useUserState.getState().user;
  if (user && !usePreferencesStore.getState().preferences) {
    await usePreferencesStore.getState().fetchPreferences();
  }
};
