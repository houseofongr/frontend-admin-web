export interface SoundSource {
  id: number;
  name: string;
  description: string;
  createdDate: string;
  updatedDate: string;
  audioFileId: number;
  isActive: boolean;
}

export interface ItemSoundsData {
  itemName: string;
  soundSource: SoundSource[];
}

export interface SoundMetadata {
  name: string;
  description: string;
  isActive: boolean;
}

export interface SoundData extends SoundMetadata {
  file: File;
}
