/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NG_APP_API_KEY: string;
  // add more keys as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
