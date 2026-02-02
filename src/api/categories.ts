import type { Category } from "@/types/category";

import { apiClient } from "./client";

/**
 * 전체 카테고리 목록 조회
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>("/categories");
  return response.data;
};
