import { create } from 'zustand';
import {MentorProps} from "@/components/talk-space/mentors-card";

export type CallStatus =
  | 'idle'
  | 'requesting'
  | 'accepted'
  | 'in-call'
  | 'ended'
  | 'rejected'
  | 'error';

interface TalkSpaceState {
  callStatus: CallStatus;
  setCallStatus: (status: CallStatus) => void;
  resetCall: () => void;
  mentor: MentorProps;
  setMentor: (mentor: MentorProps  | undefined) => void;
}

export const useTalkSpaceStore = create<TalkSpaceState>((set) => ({
  callStatus: 'idle',
  setCallStatus: (status) => set({ callStatus: status }),
  resetCall: () => set({ callStatus: 'idle' }),
  mentor: undefined,
  setMentor: (mentor) => set({ mentor: mentor }),
}));
