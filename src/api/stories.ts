import type {
  CharactersListResponse,
  CreateStoryRequest,
  GenerateBackgroundImageRequest,
  GenerateBackgroundImageResponse,
  GenerateCharacterBackgroundImageRequest,
  GenerateCharacterBackgroundImageResponse,
  GenerateCharactersRequest,
  GenerateCharactersResponse,
  GenerateCoverImageRequest,
  GenerateCoverImageResponse,
  GenerateProfileImageRequest,
  GenerateProfileImageResponse,
  GenerateSummaryRequest,
  GenerateSummaryResponse,
  GetStoriesParams,
  HeroSlide,
  StoriesListResponse,
  Story,
  StoryDetail,
  UpdateStoryRequest,
} from "@/types/story";

import { apiClient } from "./client";

/**
 * 히어로 슬라이드 목록 조회
 */
export const getHeroSlides = async (): Promise<HeroSlide[]> => {
  const response = await apiClient.get<HeroSlide[]>("/stories/hero-slides");
  return response.data;
};

/**
 * 스토리 목록 조회 (필터, 페이지네이션)
 */
export const getStories = async (params: GetStoriesParams = {}): Promise<StoriesListResponse> => {
  const response = await apiClient.get<StoriesListResponse>("/stories", { params });
  return response.data;
};

/**
 * 스토리 상세 조회
 */
export const getStoryById = async (id: string): Promise<StoryDetail> => {
  const response = await apiClient.get<StoryDetail>(`/stories/${id}`);
  return response.data;
};

/**
 * 스토리의 캐릭터 목록 조회
 */
export const getStoryCharacters = async (storyId: string): Promise<CharactersListResponse> => {
  const response = await apiClient.get<CharactersListResponse>(`/stories/${storyId}/characters`);
  return response.data;
};
/**
 * 내가 작성한 스토리 목록 조회
 * 백엔드는 Story[] 배열을 직접 반환함
 */
export const getMyStories = async (): Promise<Story[]> => {
  const response = await apiClient.get<Story[]>("/stories/me");
  return response.data;
};

/**
 * 스토리 생성
 */
export const createStory = async (data: CreateStoryRequest): Promise<StoryDetail> => {
  const response = await apiClient.post<StoryDetail>("/stories", data);
  return response.data;
};

/**
 * 스토리 수정
 */
export const updateStory = async (id: string, data: UpdateStoryRequest): Promise<StoryDetail> => {
  const response = await apiClient.patch<StoryDetail>(`/stories/${id}`, data);
  return response.data;
};

/**
 * 스토리 삭제
 */
export const deleteStory = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/stories/${id}`);
  return response.data;
};

// ==========================================
// AI Generation (AI 스토리/캐릭터 생성)
// ==========================================

/**
 * AI 줄거리 생성
 */
export const generateSummary = async (
  data: GenerateSummaryRequest,
): Promise<GenerateSummaryResponse> => {
  const response = await apiClient.post<GenerateSummaryResponse>("/stories/generate/summary", data);
  return response.data;
};

/**
 * AI 캐릭터 생성
 */
export const generateCharacters = async (
  data: GenerateCharactersRequest,
): Promise<GenerateCharactersResponse> => {
  const response = await apiClient.post<GenerateCharactersResponse>(
    "/stories/generate/characters",
    data,
  );
  return response.data;
};

/**
 * AI 프로필 이미지 생성
 */
export const generateProfileImage = async (
  data: GenerateProfileImageRequest,
): Promise<GenerateProfileImageResponse> => {
  const response = await apiClient.post<GenerateProfileImageResponse>(
    "/stories/generate/profile-image",
    data,
    { timeout: 180000 }, // 이미지 생성은 오래 걸림 (180초)
  );
  return response.data;
};

/**
 * AI 커버 이미지 생성
 */
export const generateCoverImage = async (
  data: GenerateCoverImageRequest,
): Promise<GenerateCoverImageResponse> => {
  const response = await apiClient.post<GenerateCoverImageResponse>(
    "/stories/generate/cover-image",
    data,
    { timeout: 180000 },
  );
  return response.data;
};

/**
 * AI 배경 이미지 생성
 */
export const generateBackgroundImage = async (
  data: GenerateBackgroundImageRequest,
): Promise<GenerateBackgroundImageResponse> => {
  const response = await apiClient.post<GenerateBackgroundImageResponse>(
    "/stories/generate/background-image",
    data,
    { timeout: 180000 },
  );
  return response.data;
};

/**
 * AI 캐릭터 배경 이미지 생성
 */
export const generateCharacterBackgroundImage = async (
  data: GenerateCharacterBackgroundImageRequest,
): Promise<GenerateCharacterBackgroundImageResponse> => {
  const response = await apiClient.post<GenerateCharacterBackgroundImageResponse>(
    "/stories/generate/character-background-image",
    data,
    { timeout: 180000 },
  );
  return response.data;
};
