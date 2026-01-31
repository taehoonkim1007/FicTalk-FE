import type {
  CharacterDetail,
  CharacterDetailWithStory,
  CharactersWithStoryListResponse,
  CreateCharacterRequest,
  GetCharactersParams,
  UpdateCharacterRequest,
} from "@/types/story";

import { apiClient } from "./client";

/**
 * 캐릭터 목록 조회 (카테고리별 필터링 가능)
 */
export const getCharacters = async (
  params: GetCharactersParams = {},
): Promise<CharactersWithStoryListResponse> => {
  const response = await apiClient.get<CharactersWithStoryListResponse>("/characters", { params });
  return response.data;
};

/**
 * 캐릭터 상세 조회
 */
export const getCharacter = async (id: string): Promise<CharacterDetailWithStory> => {
  const response = await apiClient.get<CharacterDetailWithStory>(`/characters/${id}`);
  return response.data;
};

/**
 * 캐릭터 추가
 */
export const createCharacter = async (
  storyId: string,
  data: CreateCharacterRequest,
): Promise<CharacterDetail> => {
  const response = await apiClient.post<CharacterDetail>(`/stories/${storyId}/characters`, data);
  return response.data;
};

/**
 * 캐릭터 수정
 */
export const updateCharacter = async (
  id: string,
  data: UpdateCharacterRequest,
): Promise<CharacterDetail> => {
  const response = await apiClient.patch<CharacterDetail>(`/characters/${id}`, data);
  return response.data;
};

/**
 * 캐릭터 삭제
 */
export const deleteCharacter = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/characters/${id}`);
  return response.data;
};
