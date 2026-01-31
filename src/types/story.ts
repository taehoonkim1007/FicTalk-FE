// ==========================================
// Category
// ==========================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  order: number;
  title: string;
  emoji: string;
  description: string;
  colorClass: string;
  iconName: string;
}

// ==========================================
// Character
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
}

/** 캐릭터 (상세용) */
export interface CharacterDetail extends Character {
  personality: string | null;
  firstMessage: string | null;
  createdAt?: string;
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

// ==========================================
// Story
// ==========================================

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
  createdAt: string;
  category: Pick<Category, "id" | "name" | "slug">;
  creator: StoryCreator | null;
}

/** 스토리 (상세용) */
export interface StoryDetail extends Story {
  summary: string;
  characters: CharacterDetail[];
}

// ==========================================
// Hero Slide
// ==========================================

export interface HeroSlide {
  category: string;
  story: {
    id: string;
    title: string;
    seriesTitle: string | null;
    authorName: string;
    coverColor: string;
    coverImage: string | null;
  };
  character: {
    id: string;
    name: string;
    firstMessage: string | null;
  };
  slide: {
    marketingTitle: string;
    title: string;
    description: string;
    image: string | null;
  };
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
}

// ==========================================
// API Response DTOs
// ==========================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StoriesListResponse {
  stories: Story[];
  pagination: Pagination;
}

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

// ==========================================
// AI Generation (AI 스토리/캐릭터 생성)
// ==========================================

export interface GenerateSummaryRequest {
  title: string;
  description: string;
}

export interface GenerateSummaryResponse {
  summary: string;
}

export interface GenerateCharactersRequest {
  title: string;
  description: string;
  summary: string;
}

export interface GeneratedCharacter {
  name: string;
  role: string;
  description: string;
  personality: string;
  firstMessage: string;
}

export interface GenerateCharactersResponse {
  characters: GeneratedCharacter[];
}

/** 프로필 이미지 생성 요청 */
export interface GenerateProfileImageRequest {
  description: string;
  personality: string;
}

/** 프로필 이미지 생성 응답 */
export interface GenerateProfileImageResponse {
  /** AI가 생성한 이미지 (base64 인코딩, PNG 포맷) */
  imageBase64: string;
  /** 이미지 생성에 사용된 프롬프트 (디버깅용) */
  promptUsed: string;
}

/** 커버 이미지 생성 요청 */
export interface GenerateCoverImageRequest {
  title: string;
  description: string;
  summary: string;
}

/** 커버 이미지 생성 응답 */
export interface GenerateCoverImageResponse {
  imageBase64: string;
  promptUsed: string;
}

/** 배경 이미지 생성 요청 */
export interface GenerateBackgroundImageRequest {
  title: string;
  description: string;
  summary: string;
}

/** 배경 이미지 생성 응답 */
export interface GenerateBackgroundImageResponse {
  imageBase64: string;
  promptUsed: string;
}

/** 캐릭터 배경 이미지 생성 요청 */
export interface GenerateCharacterBackgroundImageRequest {
  description: string;
  personality: string;
}

/** 캐릭터 배경 이미지 생성 응답 */
export interface GenerateCharacterBackgroundImageResponse {
  imageBase64: string;
  promptUsed: string;
}
