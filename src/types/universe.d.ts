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
  tags?: Array;
}
