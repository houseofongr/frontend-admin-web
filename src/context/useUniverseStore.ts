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
  setCurrentSpaceId: (id: number) => void;
  setParentSpaceId: (id: number) => void;
  setRootUniverse: (data: UniverseType) => void;
  addPieceToSpace: (spaceId: number, newPiece: PieceType) => void;
  getSpaceById: (id: number) => SpaceType | null;
  getParentSpaceIdById: (id: number) => number | null;
  updateSpaceTitle: (id: number, title: string) => void;

  resetUniverse: () => void;
}

export const useUniverseStore = create<UniverseStore>((set, get) => ({
  currentSpaceId: null,
  parentSpaceId: -1,
  rootUniverse: null,

  setCurrentSpaceId: (id) => set({ currentSpaceId: id }),

  setParentSpaceId: (id) => set({ parentSpaceId: id }),

  setRootUniverse: (data) => set({ rootUniverse: data }),

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

  updateSpaceTitle: (id, title) => {
    const update = (spaces: SpaceType[]): SpaceType[] =>
      spaces.map((space) => ({
        ...space,
        title: space.spaceId === id ? title : space.title,
        spaces: update(space.spaces),
      }));

    const u = get().rootUniverse;
    if (!u) return;
    set({ rootUniverse: { ...u, spaces: update(u.spaces) } });
  },

  addPieceToSpace: (spaceId, newPiece) => {
    const add = (spaces: SpaceType[]): SpaceType[] =>
      spaces.map((space) => {
        if (space.spaceId === spaceId) {
          return {
            ...space,
            pieces: [...space.pieces, newPiece],
          };
        }
        return {
          ...space,
          spaces: add(space.spaces),
        };
      });

    const u = get().rootUniverse;
    if (!u) return;
    set({ rootUniverse: { ...u, spaces: add(u.spaces) } });
  },

  resetUniverse: () => {
    set({ currentSpaceId: null });
    set({ parentSpaceId: -1 });
    set({ rootUniverse: null });
  }

}));
