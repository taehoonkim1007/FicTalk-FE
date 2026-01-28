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
 * server-cache: Increased staleTime for rarely-changing data
 */
export const useCategories = () => {
  return useQuery({
    queryKey: categoriesKeys.list(),
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // 1시간 (카테고리는 거의 변경되지 않음)
    gcTime: 1000 * 60 * 60 * 24, // 24시간 캐시 유지
  });
};
