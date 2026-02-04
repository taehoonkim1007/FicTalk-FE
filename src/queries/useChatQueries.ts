import { useCallback, useRef } from "react";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addChatCharacter,
  getChatCharacters,
  getChatMessages,
  getOrCreateChat,
  removeChatCharacter,
  resetMessages,
  sendMessage,
} from "@/api/chat";
import type { AddChatCharacterRequest, ChatMessage, SendMessageRequest } from "@/types/chat";

// ==========================================
// Query Keys
// ==========================================

export const chatKeys = {
  all: ["chat"] as const,
  chat: () => [...chatKeys.all, "room"] as const,
  characters: () => [...chatKeys.all, "characters"] as const,
  messages: (characterId: string) => [...chatKeys.all, "messages", characterId] as const,
};

// ==========================================
// Queries
// ==========================================

/**
 * 채팅방 조회/생성
 */
export const useChat = () => {
  return useQuery({
    queryKey: chatKeys.chat(),
    queryFn: getOrCreateChat,
  });
};

/**
 * 채팅방 캐릭터 목록 조회
 */
export const useChatCharacters = (enabled = true) => {
  return useQuery({
    queryKey: chatKeys.characters(),
    queryFn: getChatCharacters,
    enabled,
  });
};

/**
 * 메시지 목록 조회 (무한 스크롤)
 */
export const useChatMessages = (characterId: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(characterId),
    queryFn: ({ pageParam }) => getChatMessages(characterId, { cursor: pageParam, limit: 50 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    enabled: !!characterId && enabled,
    staleTime: 0,
    refetchOnMount: true,
    gcTime: 5 * 60 * 1000, // 5분 후 미사용 캐시 정리
  });
};

// ==========================================
// Mutations
// ==========================================

/**
 * 캐릭터 추가
 */
export const useAddChatCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddChatCharacterRequest) => addChatCharacter(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.characters() });
    },
  });
};

/**
 * 캐릭터 제거
 */
export const useRemoveChatCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (characterId: string) => removeChatCharacter(characterId),
    onSuccess: (_, characterId) => {
      // 삭제된 캐릭터의 메시지 캐시도 함께 제거
      queryClient.removeQueries({ queryKey: chatKeys.messages(characterId) });
      void queryClient.invalidateQueries({ queryKey: chatKeys.characters() });
    },
  });
};

/**
 * 메시지 전송 (낙관적 업데이트 + 취소 지원)
 * 임시 메시지를 즉시 표시하고, 응답 시 실제 메시지로 교체
 */
export const useSendMessage = (characterId: string) => {
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);
  const tempMessageIdRef = useRef<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: SendMessageRequest) => {
      // 이전 요청이 있으면 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // 새 AbortController 생성
      abortControllerRef.current = new AbortController();
      return sendMessage(characterId, data, abortControllerRef.current.signal);
    },
    onMutate: async (variables) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(characterId) });

      // 고유한 임시 메시지 ID 생성 및 저장
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      tempMessageIdRef.current = tempId;

      // 낙관적 업데이트: 사용자 메시지 즉시 표시
      const tempUserMessage: ChatMessage = {
        id: tempId,
        role: "user",
        content: variables.content,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(chatKeys.messages(characterId), (old: unknown) => {
        if (!old) {
          return {
            pages: [{ messages: [tempUserMessage], nextCursor: null, hasMore: false }],
            pageParams: [undefined],
          };
        }

        const oldData = old as { pages: { messages: ChatMessage[] }[]; pageParams: unknown[] };

        if (!oldData.pages || oldData.pages.length === 0) {
          return {
            ...oldData,
            pages: [{ messages: [tempUserMessage], nextCursor: null, hasMore: false }],
            pageParams: [undefined],
          };
        }

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) =>
            index === 0 ? { ...page, messages: [tempUserMessage, ...page.messages] } : page,
          ),
        };
      });
    },
    onSuccess: (response) => {
      const tempId = tempMessageIdRef.current;

      // 서버 응답으로 캐시 업데이트 (임시 메시지 제거 + 실제 메시지 추가)
      queryClient.setQueryData(chatKeys.messages(characterId), (old: unknown) => {
        if (!old) {
          return {
            pages: [
              {
                messages: [response.aiMessage, response.userMessage],
                nextCursor: null,
                hasMore: false,
              },
            ],
            pageParams: [undefined],
          };
        }

        const oldData = old as { pages: { messages: ChatMessage[] }[]; pageParams: unknown[] };

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index !== 0) return page;

            // 해당 임시 메시지만 제거하고 실제 메시지 추가
            const messagesWithoutTemp = page.messages.filter((m) => m.id !== tempId);

            return {
              ...page,
              messages: [response.aiMessage, response.userMessage, ...messagesWithoutTemp],
            };
          }),
        };
      });

      tempMessageIdRef.current = null;
      abortControllerRef.current = null;
    },
    onError: () => {
      const tempId = tempMessageIdRef.current;

      // 실패 시 임시 메시지 제거
      if (tempId) {
        queryClient.setQueryData(chatKeys.messages(characterId), (old: unknown) => {
          if (!old) return old;

          const oldData = old as { pages: { messages: ChatMessage[] }[]; pageParams: unknown[] };

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              messages: page.messages.filter((m) => m.id !== tempId),
            })),
          };
        });
      }

      tempMessageIdRef.current = null;
      abortControllerRef.current = null;
    },
  });

  // 요청 취소 함수
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return { ...mutation, cancel };
};

/**
 * 메시지 캐시 정리 (쿼리 무효화)
 */
export const useCleanupMessages = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (characterId: string) => {
      // 쿼리 무효화하여 다음 마운트 시 새로 fetch
      void queryClient.invalidateQueries({ queryKey: chatKeys.messages(characterId) });
    },
    [queryClient],
  );
};

/**
 * 대화 초기화
 */
export const useResetMessages = (characterId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => resetMessages(characterId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.messages(characterId) });
    },
  });
};
