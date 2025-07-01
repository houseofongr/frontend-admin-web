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