import type { VoiceSettings } from "./character";

// ==========================================
// Entity
// ==========================================

/** 채팅방에 추가된 캐릭터 */
export interface ChatCharacter {
  id: string;
  name: string;
  role: string;
  description: string;
  profileImage: string | null;
  backgroundImage: string | null;
  imageColor: string;
  personality: string | null;
  firstMessage: string | null;
  voiceId: string | null;
  voiceSettings: VoiceSettings | null;
  story: {
    id: string;
    title: string;
    backgroundImage: string | null;
  };
}

/** 채팅 메시지 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

// ==========================================
// API Request DTOs
// ==========================================

/** 캐릭터 추가 요청 */
export interface AddChatCharacterRequest {
  characterId: string;
}

/** 메시지 전송 요청 */
export interface SendMessageRequest {
  content: string;
}

/** 메시지 조회 파라미터 */
export interface GetMessagesParams {
  cursor?: string;
  limit?: number;
}

// ==========================================
// API Response DTOs
// ==========================================

/** 채팅방 응답 */
export interface ChatResponse {
  id: string;
  createdAt: string;
}

/** 채팅방 캐릭터 목록 응답 */
export interface ChatCharactersResponse {
  characters: ChatCharacter[];
}

/** 메시지 목록 응답 (커서 기반 페이지네이션) */
export interface ChatMessagesResponse {
  messages: ChatMessage[];
  nextCursor: string | null;
  hasMore: boolean;
}

/** 메시지 전송 응답 (사용자 메시지 + AI 응답) */
export interface SendMessageResponse {
  userMessage: ChatMessage;
  aiMessage: ChatMessage;
  usageCount?: number;
  maxUsage?: number;
}
