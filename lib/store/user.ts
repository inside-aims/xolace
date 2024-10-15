import { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface UserState {
  user: any | undefined;
}

export const useUserState = create<UserState>((set) => ({
  user: undefined,
}));
