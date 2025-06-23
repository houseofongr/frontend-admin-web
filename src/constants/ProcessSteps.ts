export enum SpaceCreateEditStep {
  SetSizeOnCreate,
  SetSizeOnEdit,
  UploadImage,
  FillDetails,
}

export enum PieceCreateEditStep {
  SelectMethod,           // 좌표 방식 또는 이미지 방식 선택
  UploadImage,            // 이미지 업로드
  SelectCoordinates,      // 좌표 선택
  AdjustImagePosition,    // 이미지 위치 조정
  FillDetails,            // 세부 정보 입력
}

export enum UniverseCreateStep {
  Thumbnail,
  ThumbMusic,
  InnerImg,
  DetailInfo,
}