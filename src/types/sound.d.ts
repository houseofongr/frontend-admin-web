export interface SoundSource {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  updatedDate: string;
  audioFileId: number;
}

export interface ItemSoundsData {
  itemName: string;
  soundSource: SoundSource[];
}

export interface SoundData {
  file: File;
  name: string;
  description: string;
  isActive: boolean;
}
