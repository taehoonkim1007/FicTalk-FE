interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_STATIC_BASE_URL: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
}

interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
