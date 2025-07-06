<<<<<<< Updated upstream
import API_CONFIG from "../config/api";
import { SoundMetadata } from "../types/sound";

//아이템 음원 조회
export const fetchItemSounds = async (itemId: number) => {
  const response = await fetch(`${API_CONFIG.BACK_API}/items/${itemId}/sound-sources`);

  if (!response.ok) throw new Error("Failed to fetch sounds");
  return response.json();
};

// 아이템 음원 생성
export const createSound = async (itemId: number, soundData: FormData) => {
  const response = await fetch(`${API_CONFIG.BACK_API}/items/${itemId}/sound-sources`, {
    method: "POST",
    body: soundData,
  });
  if (!response.ok) throw new Error("Failed to create sound");
  return response.json();
};

//음원 삭제
export const deleteSound = async (soundSourceId: number) => {
  const response = await fetch(`${API_CONFIG.BACK_API}/sound-sources/${soundSourceId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete sound");
};

//음원 상세 조회
export const fetchSoundDetails = async (soundSourceId: number) => {
  const response = await fetch(`${API_CONFIG.BACK_API}/sound-sources/${soundSourceId}`);

  if (!response.ok) throw new Error("Failed to fetch sound details");
  return response.json();
};

// 음원 상세 수정
export const updateSound = async (soundSourceId: number, soundData: SoundMetadata) => {
  const response = await fetch(`${API_CONFIG.BACK_API}/sound-sources/${soundSourceId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(soundData),
  });

  if (!response.ok) throw new Error("Failed to update sound");
  return response.json();
};
=======
import API_CONFIG from "../config/api";

// 아이템 음원 생성
export const createSound = async (soundData: object, audio: File) => {
  const formData = new FormData();

  formData.append("metadata", JSON.stringify(soundData));
  formData.append("audio", audio);

  const response = await fetch(`${API_CONFIG.BACK_API}/sounds`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to create sound");

  return response.json();
};

// 특정 사운드 정보 수정 API
export const patchSoundInfoEdit = async (soundId: number, payload: object) => {
  const response = await fetch(`${API_CONFIG.BACK_API}/sounds/${soundId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to edit piece info");
  return response.json();
};


// 특정 사운드 오디오 변경 API
export const patchSoundEdit = async (soundId: number, audio: File) => {
  const formData = new FormData();
  formData.append("audio", audio);

  const response = await fetch(
    `${API_CONFIG.BACK_API}/sounds/audio/${soundId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) throw new Error("Failed to edit sound info");
  return response.json();
};


// 특정 사운드 삭제 API
export const deleteSound = async (soundId: number) => {
  const response = await fetch(`${API_CONFIG.BACK_API}/sounds/${soundId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete sound");
  return response.json();
};
>>>>>>> Stashed changes
