// stores/useUniverseStore.ts
import { create } from "zustand";
import { getUniverseTree } from "../service/universeService";
import { SpaceType, useSpaceStore } from "./useSpcaeStore";
import { PieceType, usePieceStore } from "./usePieceStore";

export interface UniverseType {
  universeId: number;
  innerImageId: number;
  spaces: SpaceType[];
  pieces: PieceType[];
}

export type SaveTargetType = null | "universe" | "space";

interface UniverseStore {
  universeId: number | null;
  rootUniverse: UniverseType | null;
  activeInnerImageId: number | null;

  setUniverseId: (id: number) => void;
  setRootUniverse: (data: UniverseType) => void;

  setUniverseData: (
    innerImgId: number,
    existingSpaces: SpaceType[],
    existingPieces: PieceType[]
  ) => void;
  setActiveInnerImageId: (id: number) => void;
  setRootUniverseInnerImageId: (id: number) => void;
  resetUniverse: () => void;
  refreshUniverseData: () => Promise<void>;
}

export const useUniverseStore = create<UniverseStore>((set, get) => ({
  universeId: null,
  rootUniverse: null,
  activeInnerImageId: null,

  setUniverseId: (id) => set({ universeId: id }),

  setRootUniverse: (data) => {
    set({ rootUniverse: data });
    console.log(data);
  },

  setUniverseData: (
    innerImgId: number,
    spaces: SpaceType[],
    pieces: PieceType[]
  ) => {
    useUniverseStore.getState().setActiveInnerImageId(innerImgId);
    useSpaceStore.getState().setExistingSpaces(spaces);
    usePieceStore.getState().setExistingPieces(pieces);
  },

  setActiveInnerImageId: (id) => set({ activeInnerImageId: id }),

  setRootUniverseInnerImageId: (id: number) =>
    set((state) => ({
      rootUniverse: {
        universeId: state.rootUniverse?.universeId ?? -1,
        innerImageId: id,
        spaces: state.rootUniverse?.spaces ?? [],
        pieces: state.rootUniverse?.pieces ?? [],
      },
    })),

  resetUniverse: () => {
    set({ universeId: null });
    set({ rootUniverse: null });
  },

  refreshUniverseData: async () => {
    const universeId = get().universeId;
    if (universeId == null) return;

    const data: UniverseType = await getUniverseTree(universeId);
    set({ rootUniverse: data });
  },
}));

