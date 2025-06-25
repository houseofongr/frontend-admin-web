// stores/useSpaceStore.ts
import { create } from "zustand";
import { useUniverseStore } from "./useUniverseStore";
import { PieceType } from "./usePieceStore";

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

interface SpaceStore {
  currentSpace: SpaceType | null;
  currentSpaceId: number | null;
  parentSpaceId: number;
  existingSpaces: SpaceType[];

  setCurrentSpace: (space: SpaceType | null) => void;
  setCurrentSpaceId: (id: number | null) => void;
  setParentSpaceId: (id: number) => void;

  setExistingSpaces: (spaces: SpaceType[]) => void;

  getSpaceById: (id: number) => SpaceType | null;
  getParentSpaceIdById: (id: number) => number | null;
  getParentSpaceInnerImageId: () => number | null;
  getChildrenSpaces: (parentId: number | null) => SpaceType[];
  updateExistingSpacesByCurrentSpace: () => void;
}

export const useSpaceStore = create<SpaceStore>((set, get) => ({
  currentSpace: null,
  currentSpaceId: null,
  parentSpaceId: -1,
  existingSpaces: [],


  setCurrentSpace: (space) => set({ currentSpace: space }),

  setCurrentSpaceId: (id) => {
    set({ currentSpaceId: id });
    get().updateExistingSpacesByCurrentSpace();
  },

  setParentSpaceId: (id) => set({ parentSpaceId: id }),

  setExistingSpaces: (spaces) => set({ existingSpaces: spaces }),

  getSpaceById: (id) => {
    const { rootUniverse } = useUniverseStore.getState();
    const find = (spaces: SpaceType[]): SpaceType | null => {
      for (const space of spaces) {
        if (space.spaceId === id) return space;
        const found = find(space.spaces);
        if (found) return found;
      }
      return null;
    };
    if (!rootUniverse) return null;
    return find(rootUniverse.spaces);
  },

  getParentSpaceIdById: (id: number): number | null => {
    const { rootUniverse } = useUniverseStore.getState();
    const find = (spaces: SpaceType[]): number | null => {
      for (const space of spaces) {
        if (space.spaceId === id) return space.parentSpaceId ?? null;
        const found = find(space.spaces);
        if (found !== null) return found;
      }
      return null;
    };
    if (!rootUniverse) return null;
    return find(rootUniverse.spaces);
  },

  getParentSpaceInnerImageId: (): number | null => {
    const { rootUniverse } = useUniverseStore.getState();
    const { currentSpaceId, getParentSpaceIdById, getSpaceById } = get();
    if (!rootUniverse || currentSpaceId == null) return null;

    const parentId = getParentSpaceIdById(currentSpaceId);
    if (parentId === null || parentId === -1) return rootUniverse.innerImageId;
    const parentSpace = getSpaceById(parentId);
    return parentSpace?.innerImageId ?? null;
  },

  getChildrenSpaces: (parentId: number | null): SpaceType[] => {
    const { rootUniverse } = useUniverseStore.getState();
    if (!rootUniverse) return [];

    const findParentSpace = (spaces: SpaceType[]): SpaceType | null => {
      for (const s of spaces) {
        if (s.spaceId === parentId) return s;
        const found = findParentSpace(s.spaces);
        if (found) return found;
      }
      return null;
    };

    if (parentId === null || parentId === -1) {
      return rootUniverse.spaces.filter(
        (s) => s.parentSpaceId === null || s.parentSpaceId === -1
      );
    }

    const parentSpace = findParentSpace(rootUniverse.spaces);
    return parentSpace ? parentSpace.spaces : [];
  },

  updateExistingSpacesByCurrentSpace: () => {
    const { currentSpaceId, getChildrenSpaces } = get();
    const childrenSpaces = getChildrenSpaces(currentSpaceId);
    set({ existingSpaces: childrenSpaces });
  },
}));
