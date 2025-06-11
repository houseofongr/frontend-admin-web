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

interface UniverseStore {
  universeId: number | null;
  parentSpaceId: number;
  universe: UniverseType | null;
  setUniverseId: (id: number) => void;
  setParentSpaceId: (id: number) => void;
  setUniverse: (data: UniverseType) => void;
  addPieceToSpace: (spaceId: number, newPiece: PieceType) => void;
  getSpaceById: (id: number) => SpaceType | null;
  updateSpaceTitle: (id: number, title: string) => void;
}

export const useUniverseStore = create<UniverseStore>((set, get) => ({
  universeId: null,
  parentSpaceId: -1,
  universe: null,

  setUniverseId: (id) => set({ universeId: id }),

  setParentSpaceId: (id) => set({ parentSpaceId: id }),

  setUniverse: (data) => set({ universe: data }),

  getSpaceById: (id) => {
    const find = (spaces: SpaceType[]): SpaceType | null => {
      for (const space of spaces) {
        if (space.spaceId === id) return space;
        const found = find(space.spaces);
        if (found) return found;
      }
      return null;
    };
    const u = get().universe;
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

    const u = get().universe;
    if (!u) return;
    set({ universe: { ...u, spaces: update(u.spaces) } });
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

    const u = get().universe;
    if (!u) return;
    set({ universe: { ...u, spaces: add(u.spaces) } });
  },
}));
