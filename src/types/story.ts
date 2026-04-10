import type { Category } from "./category";
import type {
  CharacterDetail,
  CreateCharacterRequest,
  GeneratedCharacter,
  Pagination,
} from "./character";

// ==========================================
// Entity
// ==========================================

/** 스토리 게시 상태 */
export type StoryStatus = "DRAFT" | "PUBLISHED";

export const STORY_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
} as const satisfies Record<StoryStatus, StoryStatus>;

/** 스토리 작성자 */
export interface StoryCreator {
  id: string;
  name: string;
}

/** 스토리 (목록용) */
export interface Story {
  id: string;
  title: string;
  seriesTitle: string | null;
  authorName: string;
  description: string;
  coverColor: string;
  coverImage: string | null;
  backgroundImage: string | null;
  isOfficial: boolean;
  status: StoryStatus;
  publishedAt: string | null;
  createdAt: string;
  category: Pick<Category, "id" | "name" | "slug">;
}

/** 스토리 (상세용) */
export interface StoryDetail extends Story {
  summary: string;
  creator: StoryCreator | null;
  characters: CharacterDetail[];
}

// ==========================================
// API Request DTOs
// ==========================================

export interface GetStoriesParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateStoryRequest {
  title: string;
  seriesTitle?: string;
  authorName: string;
  description: string;
  summary: string;
  coverColor?: string;
  coverImage?: string | null;
  backgroundImage?: string | null;
  categorySlug: string;
  characters?: CreateCharacterRequest[];
}

export interface UpdateStoryRequest {
  title?: string;
  seriesTitle?: string;
  authorName?: string;
  description?: string;
  summary?: string;
  coverColor?: string;
  coverImage?: string | null;
  backgroundImage?: string | null;
}

/** 줄거리 생성 요청 */
export interface GenerateSummaryRequest {
  title: string;
  description: string;
}

/** 캐릭터 생성 요청 */
export interface GenerateCharactersRequest {
  title: string;
  description: string;
  summary: string;
}

/** 커버 이미지 생성 요청 */
export interface GenerateCoverImageRequest {
  title: string;
  description: string;
  summary: string;
}

/** 배경 이미지 생성 요청 */
export interface GenerateBackgroundImageRequest {
  title: string;
  description: string;
  summary: string;
}

// ==========================================
// API Response DTOs
// ==========================================

export interface StoriesListResponse {
  stories: Story[];
  pagination: Pagination;
}

/** 줄거리 생성 응답 */
export interface GenerateSummaryResponse {
  summary: string;
}

/** 캐릭터 생성 응답 */
export interface GenerateCharactersResponse {
  characters: GeneratedCharacter[];
}

/** 커버 이미지 생성 응답 */
export interface GenerateCoverImageResponse {
  imageBase64: string;
  promptUsed: string;
}

/** 배경 이미지 생성 응답 */
export interface GenerateBackgroundImageResponse {
  imageBase64: string;
  promptUsed: string;
}

// ==========================================
// Common
// ==========================================

export interface StoryFormData {
  title: string;
  authorName: string;
  description: string;
  summary: string;
  coverColor: string;
  coverImage: string | null;
  backgroundImage: string | null;
  characters: CreateCharacterRequest[];
}
