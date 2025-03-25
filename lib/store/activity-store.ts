import { create } from 'zustand';
import { ActivityLog } from '@/types/activity';
import { generateDummyActivityLogs } from '@/constants/dummy-data';

interface ActivityState {
  logs: ActivityLog[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  page: number;
  fetchLogs: (filter?: string, viewType?: "my-activities" | "related-to-me") => Promise<void>;
  resetLogs: () => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  logs: [],
  isLoading: false,
  hasMore: true,
  error: null,
  page: 1,
  
  fetchLogs: async (filter = 'all', viewType = 'my-activities') => {
    const { page, logs } = get();
    
    set({ isLoading: true });
    
    try {
      // Simulate API call with dummy data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newLogs = generateDummyActivityLogs(10, filter, viewType);
      const hasMore = page < 5; // Limit to 5 pages for demo
      
      set({
        logs: page === 1 ? newLogs : [...logs, ...newLogs],
        page: page + 1,
        hasMore,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch activity logs', 
        isLoading: false 
      });
    }
  },
  
  resetLogs: () => {
    set({
      logs: [],
      page: 1,
      hasMore: true,
      error: null,
    });
  },
}));