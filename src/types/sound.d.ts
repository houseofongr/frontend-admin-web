// 룸상세페이지 - 음원 목록 - 음원 컴포넌트
export interface SoundSource extends SoundMetadata {
  id: number;
  // name: string;
  // description: string;
  createdDate: string;
  updatedDate: string;
  audioFileId: number;
  // isActive: boolean;
}

// 룸상세페이지 - 음원 목록
export interface ItemSoundsData {
  itemName: string;
  soundSource: SoundSource[];
}

// 룸상세페이지 - 뉴사운드폼 - 사운드메타데이터  (사운드 데이터 수정/삭제)
export interface SoundMetadata {
  name: string;
  description: string;
  isActive: boolean;
}

// 룸상세페이지 - 뉴사운드폼 - 사운드메타데이터에 파일 추가 (사운드 데이터 생성)
export interface SoundAllData extends SoundMetadata {
  file: File;
}

// 음원 전체 조회 페이지 - 사운드 리스트 아이템
export interface SoundListItem {
  name: string;
  description: string;
  createdDate: string;
  updatedDate: string;
  isActive: boolean;
  audioFileId: number;
  userNickname: string;
  userId: number;
  homeName: string;
  roomName: string;
  itemName: string;
  homeId: number;
  roomId: number;
  itemId: number;
}
