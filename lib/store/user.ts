import { create } from 'zustand';

interface UserState {
  user: Profile | undefined;
}

export const useUserState = create<UserState>(set => ({
  user: undefined,
}));
