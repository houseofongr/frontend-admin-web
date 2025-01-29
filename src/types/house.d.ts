export interface BaseHouse {
  id?: number;
  title: string;
  author: string;
  description: string;
  createdDate?: string;
  updatedDate?: string;
}

// 리스트 페이지에서 사용하는 하우스 타입
export interface House extends BaseHouse {
  imageId: number;
}

// 단일 하우스 상세 페이지에서 사용하는 타입
export interface HouseDetailInfo extends BaseHouse {
  width: number;
  height: number;
  borderImageId: number;
  houseId: number;
}

export interface BaseRoom {
  name: string;
  width: number;
  height: number;
  imageId: number;
  roomId: number;
}
export interface Room extends BaseRoom {
  x: number;
  y: number;
  z: number;
  originalName?: string;
}

export interface EditableRoomData {
  imageId: number;
  roomId: number;
  name: string;
  originalName?: string;
}

export interface EditableHouseData {
  house: {
    title: string;
    author: string;
    description: string;
    createdDate?: string;
  };
  rooms: EditableRoomData[];
}
