// stores/useUniverseStore.ts
import { create } from "zustand";

export interface PieceType {
  pieceId: number;
  parentSpaceId: number | null;
  innerImageId: number;
  depth: number;
  title: string;
  description: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  createdTime: number;
  updatedTime: number;
}

export interface SpaceType {
  spaceId: number;
  parentSpaceId: number | null;
  innerImageId: number;
  depth: number;
  title: string;
  description: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  spaces: SpaceType[];
  pieces: PieceType[];
  createdTime: number;
  updatedTime: number;
}

export interface UniverseType {
  universeId: number;
  innerImageId: number;
  spaces: SpaceType[];
  pieces: PieceType[];
}

export type SaveTargetType = null | "universe" | "space";

interface UniverseStore {
  currentSpaceId: number | null;
  parentSpaceId: number;
  rootUniverse: UniverseType | null;
  innerImageId: number | null;
  existingSpaces: SpaceType[];
  existingPieces: PieceType[];
  setCurrentSpaceId: (id: number) => void;
  setParentSpaceId: (id: number) => void;
  setRootUniverse: (data: UniverseType) => void;

  setInnerImageId: (id: number) => void;
  setExistingSpaces: (spaces: SpaceType[]) => void;
  setExistingPieces: (pieces: PieceType[]) => void;

  setUniverseData: (innerImgId: number, existingSpaces: SpaceType[], existingPieces: PieceType[]) => void;

  getSpaceById: (id: number) => SpaceType | null;
  getParentSpaceIdById: (id: number) => number | null;

  resetUniverse: () => void;
  refreshUniverseData: (currentPageSpaceId: number) => void;

}

export const useUniverseStore = create<UniverseStore>((set, get) => ({
  currentSpaceId: null,
  parentSpaceId: -1,
  rootUniverse: null,

  innerImageId: null,
  existingSpaces: [],
  existingPieces: [],

  setCurrentSpaceId: (id) => set({ currentSpaceId: id }),

  setParentSpaceId: (id) => set({ parentSpaceId: id }),

  setRootUniverse: (data) => set({ rootUniverse: data }),

  setInnerImageId: (id) => set({ innerImageId: id }),

  setExistingSpaces: (spaces) => { set({ existingSpaces: spaces }) },

  setExistingPieces: (pieces) => set({ existingPieces: pieces }),

  setUniverseData: (innerImageId, existingSpaces, existingPieces) =>
    set({
      innerImageId,
      existingSpaces,
      existingPieces,
    }),

  getSpaceById: (id) => {
    const find = (spaces: SpaceType[]): SpaceType | null => {
      for (const space of spaces) {
        if (space.spaceId === id) return space;
        const found = find(space.spaces);
        if (found) return found;
      }
      return null;
    };
    const u = get().rootUniverse;
    if (!u) return null;
    return find(u.spaces);
  },

  getParentSpaceIdById: (id: number): number | null => {
    const find = (spaces: SpaceType[]): number | null => {
      for (const space of spaces) {
        if (space.spaceId === id) return space.parentSpaceId ?? null;
        const found = find(space.spaces);
        if (found !== null) return found;
      }
      return null;
    };

    const u = get().rootUniverse;
    if (!u) return null;
    return find(u.spaces);
  },


  resetUniverse: () => {
    set({ currentSpaceId: null });
    set({ parentSpaceId: -1 });
    set({ rootUniverse: null });
  },

  refreshUniverseData: async () => {
    // try {
    //   const response = await axios.get(`/api/universe/${universeId}`);
    //   const data: UniverseType = response.data;

    //   set({ rootUniverse: data });

    //   // 예: 현재 spaceId 다시 설정 (기존 위치 유지)
    //   const currentId = get().currentSpaceId;
    //   if (currentId) {
    //     const found = get().getSpaceById(currentId);
    //     if (!found) {
    //       // 현재 ID가 없어졌으면 루트로 이동
    //       set({ currentSpaceId: null, parentSpaceId: -1 });
    //     }
    //   }
    // } catch (error) {
    //   console.error("Failed to refresh universe data", error);
    // }
  },

}));
