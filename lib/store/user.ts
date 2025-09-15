import { Profile } from '@/types/global';
import { create } from 'zustand';

interface UserState {
  user: Profile | undefined;
  roles: string[];
  isLoading: boolean;
  isInitialized: boolean;
  setRoles: (roles: string[]) => void;
  setUser: (user: Profile | undefined) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useUserState = create<UserState>((set) => ({
  user: undefined,
  roles: [],
  isLoading: true, // Start as loading
  isInitialized: false,
  setRoles: (roles: string[]) => set({ roles }),
  setUser: (user: Profile | undefined) => set({ user }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setInitialized: (initialized: boolean) => set({ isInitialized: initialized }),
}));
