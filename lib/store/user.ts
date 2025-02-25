import { Profile } from '@/types/global';
import { create } from 'zustand';

interface UserState {
  user: Profile | undefined;
  roles: string[];
  setRoles: (roles: string[]) => void;
}

export const useUserState = create<UserState>((set) => ({
  user: undefined,
  roles: [],
  setRoles: (roles: string[]) => set({ roles }),
}));
