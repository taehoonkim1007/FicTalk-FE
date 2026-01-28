const STATIC_BASE_URL = (import.meta.env.VITE_STATIC_BASE_URL as string) ?? "";

export const getImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith("http")) return path; // 이미 절대 URL인 경우
  return `${STATIC_BASE_URL}${path}`;
};
