import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createStory,
  deleteStory,
  generateCharacters,
  generateSummary,
  getHeroSlides,
  getMyStories,
  getStories,
  getStoryById,
  getStoryCharacters,
  updateStory,
} from "@/api/stories";
import type { CreateStoryRequest, GetStoriesParams, UpdateStoryRequest } from "@/types/story";

// ==========================================
// Query Keys
// ==========================================

export const storiesKeys = {
  all: ["stories"] as const,
  lists: () => [...storiesKeys.all, "list"] as const,
  list: (params?: GetStoriesParams) => [...storiesKeys.lists(), params] as const,
  details: () => [...storiesKeys.all, "detail"] as const,
  detail: (id: string) => [...storiesKeys.details(), id] as const,
  characters: (storyId: string) => [...storiesKeys.all, "characters", storyId] as const,
  heroSlides: () => [...storiesKeys.all, "heroSlides"] as const,
  myStories: () => [...storiesKeys.all, "myStories"] as const,
};

// ==========================================
// Queries
// ==========================================

/**
 * 히어로 슬라이드 목록 조회
 * server-cache: Balanced cache for hero content (refreshes periodically, not on every mount)
 */
export const useHeroSlides = () => {
  return useQuery({
    queryKey: storiesKeys.heroSlides(),
    queryFn: getHeroSlides,
    staleTime: 1000 * 60 * 5, // 5분 (홈페이지 재방문 시 캐시 사용)
    gcTime: 1000 * 60 * 30, // 30분 캐시 유지
  });
};

/**
 * 스토리 목록 조회
 */
export const useStories = (params?: GetStoriesParams) => {
  return useQuery({
    queryKey: storiesKeys.list(params),
    queryFn: () => getStories(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};

/**
 * 스토리 상세 조회
 */
export const useStory = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: storiesKeys.detail(id),
    queryFn: () => getStoryById(id),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 스토리 캐릭터 목록 조회
 */
export const useStoryCharacters = (storyId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: storiesKeys.characters(storyId),
    queryFn: () => getStoryCharacters(storyId),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 내가 작성한 스토리 목록 조회
 */
export const useMyStories = (enabled: boolean = true) => {
  return useQuery({
    queryKey: storiesKeys.myStories(),
    queryFn: getMyStories,
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

// ==========================================
// Mutations
// ==========================================

/**
 * 스토리 생성
 */
export const useCreateStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStoryRequest) => createStory(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: storiesKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: storiesKeys.myStories() });
    },
  });
};

/**
 * 스토리 수정
 */
export const useUpdateStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStoryRequest }) => updateStory(id, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: storiesKeys.detail(variables.id) });
      void queryClient.invalidateQueries({ queryKey: storiesKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: storiesKeys.myStories() });
    },
  });
};

/**
 * 스토리 삭제
 */
export const useDeleteStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: storiesKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: storiesKeys.myStories() });
    },
  });
};

// ==========================================
// AI Generation Mutations
// ==========================================

/**
 * AI 줄거리 생성
 */
export const useGenerateSummary = () => {
  return useMutation({
    mutationFn: generateSummary,
  });
};

/**
 * AI 캐릭터 생성
 */
export const useGenerateCharacters = () => {
  return useMutation({
    mutationFn: generateCharacters,
  });
};
