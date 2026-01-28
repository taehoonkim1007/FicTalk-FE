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
  profileImage?: string;
  backgroundImage?: string;
  backgroundColor?: string;
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
  profileImage?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  story: {
    id: string;
    title: string;
    authorName: string;
    coverColor: string;
    coverImage?: string;
  };
}

/** 캐릭터 상세 (스토리 정보 포함) */
export interface CharacterDetailWithStory extends CharacterDetail {
  story: {
    id: string;
    title: string;
    authorName: string;
    coverColor: string;
    coverImage?: string;
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
  authorName: string;
  description: string;
  coverColor: string;
  coverImage?: string;
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
    authorName: string;
    coverColor: string;
    coverImage?: string;
  };
  character: {
    id: string;
    name: string;
    firstMessage: string | null;
  };
  slide: {
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
  profileImage?: string;
  backgroundImage?: string;
  backgroundColor?: string;
}

export interface CreateStoryRequest {
  title: string;
  authorName: string;
  description: string;
  summary: string;
  coverColor?: string;
  categorySlug: string;
  characters?: CreateCharacterRequest[];
}

export interface UpdateStoryRequest {
  title?: string;
  authorName?: string;
  description?: string;
  summary?: string;
  coverColor?: string;
}

export interface UpdateCharacterRequest {
  name?: string;
  role?: string;
  description?: string;
  personality?: string;
  firstMessage?: string;
  imageColor?: string;
  profileImage?: string;
  backgroundImage?: string;
  backgroundColor?: string;
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
  characters: CreateCharacterRequest[];
}
