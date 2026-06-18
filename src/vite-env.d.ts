/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLUB_WHATSAPP?: string;
  readonly VITE_INSTAGRAM_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
