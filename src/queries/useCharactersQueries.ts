import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCharacter,
  deleteCharacter,
  getCharacter,
  getCharacters,
  updateCharacter,
} from "@/api/characters";
import type {
  CreateCharacterRequest,
  GetCharactersParams,
  UpdateCharacterRequest,
} from "@/types/story";

import { storiesKeys } from "./useStoriesQueries";

// ==========================================
// Query Keys
// ==========================================

export const charactersKeys = {
  all: ["characters"] as const,
  lists: () => [...charactersKeys.all, "list"] as const,
  list: (params: GetCharactersParams) => [...charactersKeys.lists(), params] as const,
  details: () => [...charactersKeys.all, "detail"] as const,
  detail: (id: string) => [...charactersKeys.details(), id] as const,
};

// ==========================================
// Queries
// ==========================================

/**
 * 캐릭터 목록 조회
 */
export const useCharacters = (params: GetCharactersParams) => {
  return useQuery({
    queryKey: charactersKeys.list(params),
    queryFn: () => getCharacters(params),
    placeholderData: keepPreviousData,
  });
};

/**
 * 캐릭터 상세 조회
 */
export const useCharacter = (id: string, enabled = true) => {
  return useQuery({
    queryKey: charactersKeys.detail(id),
    queryFn: () => getCharacter(id),
    enabled: !!id && enabled,
  });
};

// ==========================================
// Mutations
// ==========================================

/**
 * 캐릭터 추가
 */
export const useCreateCharacter = (storyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCharacterRequest) => createCharacter(storyId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: storiesKeys.detail(storyId) });
      void queryClient.invalidateQueries({ queryKey: storiesKeys.characters(storyId) });
    },
  });
};

/**
 * 캐릭터 수정
 */
export const useUpdateCharacter = (storyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCharacterRequest }) =>
      updateCharacter(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: storiesKeys.detail(storyId) });
      void queryClient.invalidateQueries({ queryKey: storiesKeys.characters(storyId) });
    },
  });
};

/**
 * 캐릭터 삭제
 */
export const useDeleteCharacter = (storyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCharacter(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: storiesKeys.detail(storyId) });
      void queryClient.invalidateQueries({ queryKey: storiesKeys.characters(storyId) });
    },
  });
};
