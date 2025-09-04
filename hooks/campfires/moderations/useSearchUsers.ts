import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@/utils/supabase/client';

interface FoundUser {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
  reputation: number;
}

export function useSearchUsers(searchTerm: string) {
  const supabase = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ['user-search', searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('search_profiles_for_invite', {
        p_search_term: searchTerm,
      });

      if (error) {
        throw new Error(`Error searching users: ${error.message}`);
      }
      return data as unknown as FoundUser[];
    },
    // Only enable the query if the search term is 3 or more characters.
    // This matches the logic in our PostgreSQL function.
    enabled: !!searchTerm && searchTerm.length >= 3,
  });
}