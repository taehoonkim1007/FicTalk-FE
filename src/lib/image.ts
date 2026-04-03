const STATIC_BASE_URL = import.meta.env.VITE_STATIC_BASE_URL ?? "";

export const getImageUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${STATIC_BASE_URL}${path}`;
};
