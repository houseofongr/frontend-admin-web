import API_CONFIG from "../config/api";

// 스페이스 생성 API
export const postSpaceCreate = async (metadata: object, innerImg: File) => {
  const formData = new FormData();

  formData.append("metadata", JSON.stringify(metadata));
  formData.append("innerImage", innerImg);

  const response = await fetch(`${API_CONFIG.BACK_API}/spaces`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to create space");

  return response.json();
};

// 특정 스페이스 정보 수정 API
export const patchSpaceInfoEdit = async (spaceId: number, payload: object) => {
  const response = await fetch(`${API_CONFIG.BACK_API}/spaces/${spaceId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to edit space info");
  return response.json();
};


// 특정 스페이스 좌표 수정 API
export const patchSpacePositionEdit = async (spaceId: number, payload: object) => {
  const response = await fetch(
    `${API_CONFIG.BACK_API}/spaces/position/${spaceId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) throw new Error("Failed to edit space position");
  return response.json();
};

// 특정 스페이스 내부이미지 변경 API
export const patchSpaceInnerImageEdit = async (
  spaceId: number,
  innerImg: File
) => {
  const formData = new FormData();
  formData.append("innerImage", innerImg);

  const response = await fetch(
    `${API_CONFIG.BACK_API}/spaces/inner-image/${spaceId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) throw new Error("Failed to edit space innerImg");
  return response.json();
};

// 특정 스페이스 삭제 API
export const deleteSpace = async (spaceId: number) => {
  const response = await fetch(`${API_CONFIG.BACK_API}/spaces/${spaceId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete space");
  return response.json();
};