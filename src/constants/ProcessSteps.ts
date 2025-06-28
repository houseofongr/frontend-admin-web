export enum CreateEditStep {
  Space_SetSizeOnCreate,
  Space_SetSizeOnEdit,
  Space_UploadImage,
  Space_FillDetails,

  Piece_SelectMethod, // 좌표 방식 또는 이미지 방식 선택
  Piece_UploadImage, // 이미지 업로드
  Piece_SetSizeOnCreate, // 좌표 선택
  Piece_AdjustImagePosition, // 이미지 위치 조정
  Piece_FillDetails, // 세부 정보 입력

  Piece_SetSizeOnEdit,
}

export enum UniverseCreateStep {
  Thumbnail,
  ThumbMusic,
  InnerImg,
  DetailInfo,
}