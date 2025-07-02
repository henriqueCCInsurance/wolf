/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ZOOM_API_KEY?: string
  readonly VITE_ZOOM_API_SECRET?: string
  readonly VITE_ZOOM_ACCOUNT_ID?: string
  readonly VITE_ZOHO_CLIENT_ID?: string
  readonly VITE_ZOHO_CLIENT_SECRET?: string
  readonly VITE_ZOHO_REFRESH_TOKEN?: string
  readonly VITE_ZOHO_API_DOMAIN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}