import { publicStatus } from "./common";

export interface Universe {
  id?: number;
  thumbnailId: number;
  thumbMusicId: number;
  createdDate: number;
  updatedDate?: number;
  viewCount?: number;
  likeCount: number;
  title: string;
  description?: string;
  category?: string;
  publicStatus?: string;
  hashtags?: Array;
}

