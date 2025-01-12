import { Profile } from '@/types/global';
import { create } from 'zustand';

interface UserState {
  user: Profile | undefined;
}

export const useUserState = create<UserState>(() => ({
  user: undefined,
}));
