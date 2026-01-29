const STATIC_BASE_URL = (import.meta.env.VITE_STATIC_BASE_URL as string) ?? "";

export const getImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${STATIC_BASE_URL}${path}`;
};
