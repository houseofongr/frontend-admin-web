import API_CONFIG from "../config/api";
import { SoundMetadata } from "../types/sound";

//아이템 음원 조회
export const prevFetchItemSounds = async (itemId: number) => {
  const response = await fetch(`${API_CONFIG.BACK_ADMIN_API}/items/${itemId}/sound-sources`);

  if (!response.ok) throw new Error("Failed to fetch sounds");
  return response.json();
};

// 아이템 음원 생성
export const prevCreateSound = async (itemId: number, soundData: FormData) => {
  const response = await fetch(`${API_CONFIG.BACK_ADMIN_API}/items/${itemId}/sound-sources`, {
    method: "POST",
    body: soundData,
  });
  if (!response.ok) throw new Error("Failed to create sound");
  return response.json();
};

//음원 삭제
export const prevDeleteSound = async (soundSourceId: number) => {
  const response = await fetch(`${API_CONFIG.BACK_ADMIN_API}/sound-sources/${soundSourceId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete sound");
};

//음원 상세 조회
export const prevFetchSoundDetails = async (soundSourceId: number) => {
  const response = await fetch(`${API_CONFIG.BACK_ADMIN_API}/sound-sources/${soundSourceId}`);

  if (!response.ok) throw new Error("Failed to fetch sound details");
  return response.json();
};

// 음원 상세 수정
export const prevUpdateSound = async (soundSourceId: number, soundData: SoundMetadata) => {
  const response = await fetch(`${API_CONFIG.BACK_ADMIN_API}/sound-sources/${soundSourceId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(soundData),
  });

  if (!response.ok) throw new Error("Failed to update sound");
  return response.json();
};
