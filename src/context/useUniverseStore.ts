// stores/useUniverseStore.ts
import { create } from "zustand";
import { getUniverseTree } from "../service/universeService";

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
  universeId: number | null;
  rootUniverse: UniverseType | null;

  currentSpace: SpaceType | null;
  currentSpaceId: number | null;
  parentSpaceId: number;

  existingSpaces: SpaceType[];
  existingPieces: PieceType[];

  activeInnerImageId: number | null;

  setUniverseId: (id: number) => void;
  setRootUniverse: (data: UniverseType) => void;

  setCurrentSpace: (data: SpaceType | null) => void;
  setCurrentSpaceId: (id: number | null) => void;
  setParentSpaceId: (id: number) => void;

  setExistingSpaces: (spaces: SpaceType[]) => void;
  setExistingPieces: (pieces: PieceType[]) => void;

  setRootUniverseInnerImageId: (id: number) => void;
  setActiveInnerImageId: (id: number) => void;

  setUniverseData: (
    innerImgId: number,
    existingSpaces: SpaceType[],
    existingPieces: PieceType[]
  ) => void;

  getSpaceById: (id: number) => SpaceType | null;
  getParentSpaceIdById: (id: number) => number | null;
  getParentSpaceInnerImageId: () => number | null;

  getChildrenSpaces: (parentId: number | null) => SpaceType[];

  updateExistingSpacesByCurrentSpace: () => void;

  resetUniverse: () => void;
  refreshUniverseData: () => void;
}

export const useUniverseStore = create<UniverseStore>((set, get) => ({
  universeId: null,
  rootUniverse: null,

  // currentSpaceId 값이 -1이면 루트
  currentSpace: null,
  currentSpaceId: null,

  parentSpaceId: -1,

  activeInnerImageId: null,
  existingSpaces: [],
  existingPieces: [],

  setUniverseId: (id) => set({ universeId: id }),

  setCurrentSpace: (space) => set({ currentSpace: space }),

  setCurrentSpaceId: (id) => {
    set({ currentSpaceId: id });
    get().updateExistingSpacesByCurrentSpace();
  },

  setParentSpaceId: (id) => set({ parentSpaceId: id }),

  setRootUniverse: (data) => {
    set({ rootUniverse: data });
    console.log(data);
  },

  setActiveInnerImageId: (id) => set({ activeInnerImageId: id }),

  setExistingSpaces: (spaces) => {
    set({ existingSpaces: spaces });
  },

  setExistingPieces: (pieces) => set({ existingPieces: pieces }),

  setUniverseData: (innerImageId, existingSpaces, existingPieces) =>
    set({
      activeInnerImageId: innerImageId,
      existingSpaces,
      existingPieces,
    }),

  setRootUniverseInnerImageId: (id: number) =>
    set((state) => ({
      rootUniverse: {
        universeId: state.rootUniverse?.universeId ?? -1,
        innerImageId: id,
        spaces: state.rootUniverse?.spaces ?? [],
        pieces: state.rootUniverse?.pieces ?? [],
      },
    })),

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

  getParentSpaceInnerImageId: (): number | null => {
    const { rootUniverse, currentSpaceId, getParentSpaceIdById, getSpaceById } =
      get();
    if (!rootUniverse || currentSpaceId == null) return null;

    const parentId = getParentSpaceIdById(currentSpaceId);

    // 부모가 루트라면 universe의 이미지 ID 반환
    if (parentId === null || parentId === -1) {
      return rootUniverse.innerImageId;
    }

    const parentSpace = getSpaceById(parentId);
    return parentSpace?.innerImageId ?? null;
  },

  getChildrenSpaces: (parentId: number | null): SpaceType[] => {
    const root = get().rootUniverse;
    if (!root) return [];

    // 재귀로 특정 스페이스 찾기
    const findParentSpace = (spaces: SpaceType[]): SpaceType | null => {
      for (const s of spaces) {
        if (s.spaceId === parentId) return s;
        const found = findParentSpace(s.spaces);
        if (found) return found;
      }
      return null;
    };

    if (parentId === null || parentId === -1) {
      // 루트 레벨 스페이스들 필터링
      return root.spaces.filter(
        (s) => s.parentSpaceId === null || s.parentSpaceId === -1
      );
    }

    const parentSpace = findParentSpace(root.spaces);
    return parentSpace ? parentSpace.spaces : [];
  },

  // 새로 추가한 함수: currentSpaceId 기준으로 existingSpaces 업데이트
  updateExistingSpacesByCurrentSpace: () => {
    const currentSpaceId = get().currentSpaceId;
    const childrenSpaces = get().getChildrenSpaces(currentSpaceId);
    set({ existingSpaces: childrenSpaces });
  },

  resetUniverse: () => {
    set({ universeId: null });
    set({ activeInnerImageId: null });
    set({ currentSpaceId: null });
    set({ parentSpaceId: -1 });
    set({ rootUniverse: null });
    set({ existingSpaces: [] });
    set({ existingPieces: [] });
  },

  refreshUniverseData: async () => {
    const {
      universeId,
      getSpaceById,
      setRootUniverse,
      setUniverseData,
      setCurrentSpaceId,
      setCurrentSpace,
      setParentSpaceId,
    } = get();

    if (universeId == null) return;

    const data: UniverseType = await getUniverseTree(universeId);

    const spaceID = get().currentSpaceId;
    if (spaceID == null) {
      setRootUniverse(data);
      setUniverseData(data.innerImageId, data.spaces, data.pieces);
      setCurrentSpaceId(-1);
      setCurrentSpace(null);
      setParentSpaceId(-1);
    } else {
      setRootUniverse(data);
      const space = getSpaceById(spaceID);
      if (space != null) {
        setUniverseData(space.innerImageId, space.spaces, space.pieces);
      }
    }
  },
}));
