const API_CONFIG = {
  BACK_API: import.meta.env.VITE_BACK_API || "",
  PRIVATE_IMAGE_LOAD_API: import.meta.env.VITE_IMAGE_LOAD_PRIVATE || "",
  PUBLIC_IMAGE_LOAD_API: import.meta.env.VITE_IMAGE_LOAD_PUBLIC || "",
  PRIVATE_AUDIO_LOAD_API: import.meta.env.VITE_AUDIO_LOAD_PRIVATE || "",
  VITE_AUDIO_LOAD_PUBLIC: import.meta.env.VITE_AUDIO_LOAD_PUBLIC || "",
};

export default API_CONFIG;
