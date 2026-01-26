import { CATEGORY_CONFIG } from "@/constants/categories";

export const useCategoryMeta = (slug?: string) => {
  const config = CATEGORY_CONFIG[slug || "default"] || CATEGORY_CONFIG.default;

  return {
    ...config,
    Icon: config.icon,
  };
};
