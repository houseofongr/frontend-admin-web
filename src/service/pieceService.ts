import API_CONFIG from "../config/api";

// 피스 좌표방식 생성 API
export const postPieceCreateByCoordinate = async (payload: object) => {
  const response = await fetch(`${API_CONFIG.BACK_ADMIN_API}/pieces/position `, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to create space");

  return response.json();
};

// 피스 좌표방식 생성 API V2
export const postPieceCreateByCoordinateV2 = async (payload: object) => {
  const response = await fetch(`${API_CONFIG.BACK_ADMIN_API}/pieces/outline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to create space");

  return response.json();
};


// 관리자 특정 피스 내부 조회 API
  export const getPieceDetail = async (
    pieceId: number,
    page: number,
    sizeValue: number,
    sortType?: string | null,
    isAsc?: string | null
  ) => {
    const query = new URLSearchParams({
      page: page.toString(),
      size: sizeValue.toString(),
    });
    if (sortType && isAsc) {
      query.append("searchType", sortType);
      query.append("keyword", isAsc);
    }
    const response = await fetch(
      `${API_CONFIG.BACK_ADMIN_API}/pieces/${pieceId}?${query.toString()}`
    );

    if (!response.ok) throw new Error("Failed to fetch piece.");

    return response.json();
  };


// 특정 피스 정보 수정 API
export const patchPieceInfoEdit = async (pieceId: number, payload: object) => {
  const response = await fetch(`${API_CONFIG.BACK_ADMIN_API}/pieces/${pieceId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to edit piece info");
  return response.json();
};

// 특정 피스 좌표 수정 API
export const patchPieceCoordinatesEdit = async (
  pieceId: number,
  payload: object
) => {
  const response = await fetch(
    `${API_CONFIG.BACK_ADMIN_API}/pieces/position/${pieceId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) throw new Error("Failed to edit piece info");
  return response.json();
};

// 특정 피스 삭제 API
export const deletePiece = async (pieceId: number) => {
  const response = await fetch(`${API_CONFIG.BACK_ADMIN_API}/pieces/${pieceId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete piece");
  return response.json();
};
