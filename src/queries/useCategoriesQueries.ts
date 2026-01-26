import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/api/categories";

// ==========================================
// Query Keys
// ==========================================

export const categoriesKeys = {
  all: ["categories"] as const,
  list: () => [...categoriesKeys.all, "list"] as const,
};

// ==========================================
// Queries
// ==========================================

/**
 * 전체 카테고리 목록 조회
 */
export const useCategories = () => {
  return useQuery({
    queryKey: categoriesKeys.list(),
    queryFn: getCategories,
    staleTime: 1000 * 60 * 30, // 30분 (카테고리는 자주 변경되지 않음)
  });
};
