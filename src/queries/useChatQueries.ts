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
export const useChatCharacters = () => {
  return useQuery({
    queryKey: chatKeys.characters(),
    queryFn: getChatCharacters,
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
 * 메시지 전송 (낙관적 업데이트)
 */
export const useSendMessage = (characterId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageRequest) => sendMessage(characterId, data),
    onMutate: async (variables) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(characterId) });

      // 이전 상태 저장
      const previousData = queryClient.getQueryData(chatKeys.messages(characterId));

      // 낙관적 업데이트: 사용자 메시지 즉시 표시
      const tempUserMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        content: variables.content,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(chatKeys.messages(characterId), (old: unknown) => {
        // 캐시가 없는 경우 새로 생성
        if (!old) {
          return {
            pages: [{ messages: [tempUserMessage], nextCursor: null, hasMore: false }],
            pageParams: [undefined],
          };
        }

        const oldData = old as { pages: { messages: ChatMessage[] }[]; pageParams: unknown[] };

        // pages가 비어있는 경우
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

      return { previousData };
    },
    onSuccess: (response) => {
      // 서버 응답으로 캐시 업데이트 (임시 메시지를 실제 메시지로 교체 + AI 응답 추가)
      queryClient.setQueryData(chatKeys.messages(characterId), (old: unknown) => {
        if (!old) return old;

        const oldData = old as { pages: { messages: ChatMessage[] }[]; pageParams: unknown[] };

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index !== 0) return page;

            // 임시 메시지 제거 후 실제 메시지 추가
            const messagesWithoutTemp = page.messages.filter((m) => !m.id.startsWith("temp-"));

            return {
              ...page,
              messages: [response.aiMessage, response.userMessage, ...messagesWithoutTemp],
            };
          }),
        };
      });
    },
    onError: (_, __, context) => {
      // 실패 시 이전 상태로 복원
      if (context?.previousData) {
        queryClient.setQueryData(chatKeys.messages(characterId), context.previousData);
      } else {
        // previousData가 없어도 임시 메시지는 제거
        queryClient.setQueryData(chatKeys.messages(characterId), (old: unknown) => {
          if (!old) return old;
          const oldData = old as { pages: { messages: ChatMessage[] }[]; pageParams: unknown[] };
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              messages: page.messages.filter((m) => !m.id.startsWith("temp-")),
            })),
          };
        });
      }
    },
  });
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
