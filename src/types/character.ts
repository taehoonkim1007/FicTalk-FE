// ==========================================
// Entity
// ==========================================

/** 캐릭터 (목록용) */
export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  imageColor: string;
  profileImage: string | null;
  backgroundImage: string | null;
  backgroundColor: string | null;
  voiceId: string | null;
  voiceSettings: VoiceSettings | null;
}

/** 캐릭터 (상세용) */
export interface CharacterDetail extends Character {
  personality: string | null;
  firstMessage: string | null;
  createdAt: string;
}

/** 캐릭터 (스토리 정보 포함) */
export interface CharacterWithStory {
  id: string;
  name: string;
  role: string;
  description: string;
  imageColor: string;
  profileImage: string | null;
  backgroundImage: string | null;
  backgroundColor: string | null;
  voiceId: string | null;
  voiceSettings: VoiceSettings | null;
  story: {
    id: string;
    title: string;
    seriesTitle: string | null;
    authorName: string;
    coverColor: string;
    coverImage: string | null;
    backgroundImage: string | null;
  };
}

/** 캐릭터 상세 (스토리 정보 포함) */
export interface CharacterDetailWithStory extends CharacterDetail {
  story: {
    id: string;
    title: string;
    seriesTitle: string | null;
    authorName: string;
    coverColor: string;
    coverImage: string | null;
    backgroundImage: string | null;
  };
}

/** AI 생성 캐릭터 */
export interface GeneratedCharacter {
  name: string;
  role: string;
  description: string;
  personality: string;
  firstMessage: string;
}

// ==========================================
// API Request DTOs
// ==========================================

export interface GetCharactersParams {
  category?: string;
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export interface CreateCharacterRequest {
  id?: string;
  name: string;
  role: string;
  description: string;
  personality?: string;
  firstMessage?: string;
  imageColor?: string;
  profileImage: string | null;
  backgroundImage: string | null;
  backgroundColor: string | null;
  voiceId?: string;
  voiceSettings?: VoiceSettings;
}

export interface UpdateCharacterRequest {
  name?: string;
  role?: string;
  description?: string;
  personality?: string;
  firstMessage?: string;
  imageColor?: string;
  profileImage?: string | null;
  backgroundImage?: string | null;
  backgroundColor?: string | null;
  voiceId?: string;
  voiceSettings?: VoiceSettings;
}

/** 프로필 이미지 생성 요청 */
export interface GenerateProfileImageRequest {
  description: string;
  personality: string;
}

/** 캐릭터 배경 이미지 생성 요청 */
export interface GenerateCharacterBackgroundImageRequest {
  description: string;
  personality: string;
}

/** Voice ID 조회 요청 */
export interface GetVoiceIdRequest {
  description: string;
  personality: string;
}

/** TTS 샘플 음성 생성 요청 */
export interface TTSSampleRequest {
  voiceId: string;
  text: string;
  voiceSettings?: VoiceSettings;
}

// ==========================================
// API Response DTOs
// ==========================================

/** 스토리별 캐릭터 목록 응답 */
export interface CharactersListResponse {
  storyId: string;
  storyTitle: string;
  characters: CharacterDetail[];
}

/** 전체 캐릭터 목록 응답 (스토리 정보 포함) */
export interface CharactersWithStoryListResponse {
  characters: CharacterWithStory[];
  pagination: Pagination;
}

/** 프로필 이미지 생성 응답 */
export interface GenerateProfileImageResponse {
  imageBase64: string;
  promptUsed: string;
}

/** 캐릭터 배경 이미지 생성 응답 */
export interface GenerateCharacterBackgroundImageResponse {
  imageBase64: string;
  promptUsed: string;
}

/** Voice ID 조회 응답 */
export interface GetVoiceIdResponse {
  voiceId: string;
  voiceName: string;
  attributes: VoiceAttributes;
  voiceSettings: VoiceSettings;
}

/** TTS 샘플 음성 생성 응답 */
export interface TTSSampleResponse {
  audioBase64: string;
}

// ==========================================
// Common
// ==========================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Voice 설정 */
export interface VoiceSettings {
  stability: number;
  similarityBoost: number;
  style: number;
  speed: number;
}

/** Voice 속성 */
export interface VoiceAttributes {
  gender: string;
  age: string;
  accent: string;
  tone: string[];
  keywords: string[];
}
