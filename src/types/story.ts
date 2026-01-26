// ==========================================
// Category
// ==========================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  order: number;
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
}

/** 캐릭터 (상세용) */
export interface CharacterDetail extends Character {
  personality: string | null;
  firstMessage: string | null;
  createdAt?: string;
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
  isOfficial: boolean;
  createdAt: string;
  category: Pick<Category, "id" | "name" | "slug">;
  creator: StoryCreator | null;
}

/** 스토리 (상세용) */
export interface StoryDetail extends Story {
  summary: string;
  characters: Character[];
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
  };
  character: {
    id: string;
    name: string;
    firstMessage: string | null;
  };
  slide: {
    title: string;
    description: string;
    image: string;
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

export interface CreateCharacterRequest {
  name: string;
  role: string;
  description: string;
  personality?: string;
  firstMessage?: string;
  imageColor?: string;
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

export interface CharactersListResponse {
  storyId: string;
  storyTitle: string;
  characters: CharacterDetail[];
}

export interface StoryFormData {
  title: string;
  authorName: string;
  description: string;
  summary: string;
  coverColor: string;
  characters: CreateCharacterRequest[];
}
