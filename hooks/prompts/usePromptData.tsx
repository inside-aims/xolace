import { useQuery } from '@tanstack/react-query';
import { fetchDailyPromptAction } from '@/app/actions';

export function usePrompt() {
  return useQuery({
    queryKey: ['prompt'],
    queryFn: async () => fetchDailyPromptAction(), 
    staleTime: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
  });
}