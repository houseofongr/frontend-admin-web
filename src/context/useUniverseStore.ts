// stores/useUniverseStore.ts
import { create } from "zustand";

export interface Piece {
  elementId: number;
  parentSpaceId: number | null;
  innerImageId: number;
  depth: number;
  title: string;
  description: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface Space {
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
  spaces: Space[];
  elements: Piece[];
}

export interface UniverseData {
  universeId: number;
  innerImageId: number;
  spaces: Space[];
  elements: Piece[];
}

interface UniverseStore {
  universe: UniverseData | null;
  setUniverse: (data: UniverseData) => void;
  addElementToSpace: (spaceId: number, newElement: Piece) => void;
  getSpaceById: (id: number) => Space | null;
  updateSpaceTitle: (id: number, title: string) => void;
}

export const useUniverseStore = create<UniverseStore>((set, get) => ({
  universe: null,

  setUniverse: (data) => set({ universe: data }),

  getSpaceById: (id) => {
    const find = (spaces: Space[]): Space | null => {
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
    const update = (spaces: Space[]): Space[] =>
      spaces.map((space) => ({
        ...space,
        title: space.spaceId === id ? title : space.title,
        spaces: update(space.spaces),
      }));

    const u = get().universe;
    if (!u) return;
    set({ universe: { ...u, spaces: update(u.spaces) } });
  },

  addElementToSpace: (spaceId, newElement) => {
    const add = (spaces: Space[]): Space[] =>
      spaces.map((space) => {
        if (space.spaceId === spaceId) {
          return {
            ...space,
            elements: [...space.elements, newElement],
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
