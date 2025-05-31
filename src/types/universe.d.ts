import { publicStatus } from "./common";

export interface Universe {
  id?: number;
  thumbnailId: number;
  thumbMusicId: number;
  createdTime: number;
  updatedTime?: number;
  view?: number;
  like: number;
  title: string;
  description?: string;
  author: string;
  category?: string;
  publicStatus?: string;
  hashtags?: Array;
}


export const PublicStatusOption = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const;

export type PublicStatusOption =
  (typeof PublicStatusOption)[keyof typeof PublicStatusOption];