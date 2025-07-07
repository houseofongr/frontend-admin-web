export enum SpacePiece_CreateEditStep {
  Space_SetSizeOnCreate,
  Space_SetSizeOnEdit,
  Space_UploadImage,
  Space_FillDetails,
  Space_Delete,

  Piece_SelectMethod, // 좌표 방식 또는 이미지 방식 선택
  Piece_UploadImage, // 이미지 업로드
  Piece_SetSizeOnCreate, // 좌표 선택
  Piece_AdjustImagePosition, // 이미지 위치 조정
  Piece_FillDetails, // 세부 정보 입력

  Piece_SetSizeOnEdit,
  Piece_Delete
}

export enum UniverseCreateStep {
  Thumbnail,
  ThumbMusic,
  InnerImg,
  DetailInfo,
}

export enum SoundCreateStep {
  Sound,
  DetailInfo,
}