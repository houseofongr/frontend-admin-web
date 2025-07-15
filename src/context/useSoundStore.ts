// stores/useSoundStore.ts
import { create } from "zustand";

// 개별 사운드 타입
export interface SoundType {
  soundId: number;
  audioId: number;
  title: string;
  description: string;
  hidden: boolean;
  createdTime: number;
  updatedTime: number;
}

interface SoundStore {
  sounds: SoundType[]; // 현재 조각에 연결된 사운드 리스트
  setSounds: (sounds: SoundType[]) => void;

  currentSound: SoundType | null;
  setCurrentSound: (sound: SoundType | null) => void;

  setSoundInfo: (
    soundId: number,
    title: string,
    description: string,
    hidden: boolean
  ) => void;

  addSound: (sound: SoundType) => void;
  removeSound: (soundId: number) => void;
  resetSound: () => void;
}

export const useSoundStore = create<SoundStore>((set) => ({
  sounds: [],
  setSounds: (sounds) => set({ sounds }),

  currentSound: null,
  setCurrentSound: (sound) => set({ currentSound: sound }),

  setSoundInfo: (soundId, title, description, hidden) =>
    set((state) => {
      const updatedSounds = state.sounds.map((s) =>
        s.soundId === soundId ? { ...s, title, description, hidden } : s
      );
      const updatedCurrent =
        state.currentSound?.soundId === soundId
          ? { ...state.currentSound, title, description, hidden }
          : state.currentSound;

      return {
        sounds: updatedSounds,
        currentSound: updatedCurrent,
      };
    }),

  addSound: (sound) =>
    set((state) => ({
      sounds: [...state.sounds, sound],
    })),

  removeSound: (soundId) =>
    set((state) => ({
      sounds: state.sounds.filter((s) => s.soundId !== soundId),
      currentSound:
        state.currentSound?.soundId === soundId ? null : state.currentSound,
    })),

  resetSound: () => {
    set({ sounds: [] });
    set({ currentSound: null });
  },
}));
