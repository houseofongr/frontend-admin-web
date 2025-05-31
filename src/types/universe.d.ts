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
  authorId: string;
  category?: string;
  publicStatus?: string;
  hashtags?: Array;
}
