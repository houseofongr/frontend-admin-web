export interface Universe {
  id?: number;

  thumbnailId: number;
  thumbMusicId: number;
  innerImageId: number;

  createdTime: number;
  updatedTime?: number;

  view?: number;
  like: number;
  title: string;
  description?: string;
  // category?: string;
  category: Category;

  publicStatus?: string;
  hashtags?: Array;

  author: string;
  authorId: number;
}

export type Category = {
  id: number;
  eng: string;
  kor: string;
};

