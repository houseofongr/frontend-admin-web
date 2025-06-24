// stores/usePieceStore.ts
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
export type CreatePieceMethod = "coordination" | "image";

interface PieceStore {
  existingPieces: PieceType[];
  setExistingPieces: (pieces: PieceType[]) => void;
}

export const usePieceStore = create<PieceStore>((set) => ({
  existingPieces: [],
  setExistingPieces: (pieces) => set({ existingPieces: pieces }),
}));
