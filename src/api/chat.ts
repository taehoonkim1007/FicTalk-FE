import type {
  AddChatCharacterRequest,
  ChatCharacter,
  ChatCharactersResponse,
  ChatMessagesResponse,
  ChatResponse,
  GetMessagesParams,
  SendMessageRequest,
  SendMessageResponse,
} from "@/types/chat";

import { apiClient } from "./client";

// ==========================================
// Chat Room API
// ==========================================

/**
 * 채팅방 조회/생성
 */
export const getOrCreateChat = async (): Promise<ChatResponse> => {
  const response = await apiClient.get<ChatResponse>("/chat");
  return response.data;
};

// ==========================================
// Chat Character API
// ==========================================

/**
 * 채팅방에 추가된 캐릭터 목록 조회
 */
export const getChatCharacters = async (): Promise<ChatCharactersResponse> => {
  const response = await apiClient.get<ChatCharactersResponse>("/chat/characters");
  return response.data;
};

/**
 * 캐릭터 추가
 */
export const addChatCharacter = async (data: AddChatCharacterRequest): Promise<ChatCharacter> => {
  const response = await apiClient.post<ChatCharacter>("/chat/characters", data);
  return response.data;
};

/**
 * 캐릭터 제거
 */
export const removeChatCharacter = async (characterId: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/chat/characters/${characterId}`);
  return response.data;
};

// ==========================================
// Chat Message API
// ==========================================

/**
 * 메시지 목록 조회 (커서 기반 페이지네이션)
 */
export const getChatMessages = async (
  characterId: string,
  params: GetMessagesParams = {},
): Promise<ChatMessagesResponse> => {
  const response = await apiClient.get<ChatMessagesResponse>(
    `/chat/characters/${characterId}/messages`,
    { params },
  );
  return response.data;
};

/**
 * 메시지 전송 (AI 응답도 함께 반환)
 */
export const sendMessage = async (
  characterId: string,
  data: SendMessageRequest,
): Promise<SendMessageResponse> => {
  const response = await apiClient.post<SendMessageResponse>(
    `/chat/characters/${characterId}/messages`,
    data,
    { timeout: 60000 },
  );
  return response.data;
};

/**
 * 대화 초기화
 */
export const resetMessages = async (characterId: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/chat/characters/${characterId}/messages`,
  );
  return response.data;
};
