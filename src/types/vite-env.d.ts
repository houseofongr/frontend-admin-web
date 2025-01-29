/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACK_API: string;
  readonly VITE_IMAGE_LOAD_PRIVATE: string;
  readonly VITE_IMAGE_LOAD_PUBLIC: string;
  readonly VITE_IMAGE_HOSTNAME: string;
  readonly VITE_IMAGE_PATH_PRIVATE: string;
  readonly VITE_IMAGE_PATH_PUBLIC: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
