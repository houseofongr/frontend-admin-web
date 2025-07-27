import API_CONFIG from "../config/api";

// 유니버스 생성 API
export const postUniverse = async (
  innerImg: File,
  thumbnail: File,
  thumbMusic: File,
  metadata: object
) => {
  const formData = new FormData();

  formData.append("innerImage", innerImg);
  formData.append("thumbnail", thumbnail);
  formData.append("thumbMusic", thumbMusic);
  formData.append("metadata", JSON.stringify(metadata));

  const response = await fetch(`${API_CONFIG.BACK_ADMIN_API}/universes`, {
    method: "POST",
    body: formData,
  });
  

  if (!response.ok) throw new Error("Failed to fetch universe.");

  return response.json();
};

// 유니버스 검색 API
export const getUniverse = async (
  page: number,
  sizeValue: number,
  type: string | null,
  word: string | null
) => {
  const query = new URLSearchParams({
    page: page.toString(),
    size: sizeValue.toString(),
  });
  if (type && word) {
    query.append("searchType", type);
    query.append("keyword", word);
  }
  const response = await fetch(
    `${API_CONFIG.BACK_ADMIN_API}/universes?${query.toString()}`
  );

  if (!response.ok) throw new Error("Failed to fetch universe.");

  return response.json();
};

// 관리자 유니버스 상세정보 조회 API
export const getUniverseDetail = async (universeId: number) => {
  const response = await fetch(
    `${API_CONFIG.BACK_ADMIN_API}/universes/${universeId}`
  );
  if (!response.ok) throw new Error("Failed to fetch universe.");

  return response.json();
};

// 관리자 유니버스 트리정보 조회 API
export const getUniverseTree = async (universeId: number) => {
  const response = await fetch(
    `${API_CONFIG.BACK_ADMIN_API}/universes/tree/${universeId}`
  );

  if (!response.ok) throw new Error("Failed to create sound");
  return response.json();
};

// 특정 유니버스 정보 수정 API
export const patchUniverseInfoEdit = async (
  universeId: number,
  payload: object
) => {
  const response = await fetch(
    `${API_CONFIG.BACK_ADMIN_API}/universes/${universeId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) throw new Error("Failed to edit universe info");
  return response.json();
};

// 특정 유니버스 썸네일 변경 API
export const patchUniverseThumbnailEdit = async (
  universeId: number,
  thumbnail: File
) => {
  const formData = new FormData();
  formData.append("thumbnail", thumbnail);

  const response = await fetch(
    `${API_CONFIG.BACK_ADMIN_API}/universes/thumbnail/${universeId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) throw new Error("Failed to edit universe thumbnail");
  return response.json();
};

// 특정 유니버스 썸뮤직 변경 API
export const patchUniverseThumbMusicEdit = async (
  universeId: number,
  thumbMusic: File
) => {
  const formData = new FormData();
  formData.append("thumbMusic", thumbMusic);

  const response = await fetch(
    `${API_CONFIG.BACK_ADMIN_API}/universes/thumb-music/${universeId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) throw new Error("Failed to edit universe thumbMusic");
  return response.json();
};

// 특정 유니버스 내부 이미지 변경 API
export const patchUniverseInnerImageEdit = async (
  universeId: number,
  innerImg: File
) => {
  const formData = new FormData();
  formData.append("innerImage", innerImg);

  console.log(`${API_CONFIG.BACK_ADMIN_API}/universes/inner-image/${universeId}`);
  console.log(formData);


  const response = await fetch(
    `${API_CONFIG.BACK_ADMIN_API}/universes/inner-image/${universeId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) throw new Error("Failed to edit universe innerImg");
  return response.json();
};

// 특정 유니버스 삭제 API
export const deleteUniverse = async (universeId: number) => {
  const response = await fetch(
    `${API_CONFIG.BACK_ADMIN_API}/universes/${universeId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) throw new Error("Failed to delete universe");
  return response.json();
};
