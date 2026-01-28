export interface User {
  id: string;
  name: string;
  email: string;
  picture: string | null;
}

export interface Character {
  id: string | number;
  name: string;
  role: string;
  desc: string;
  image: string | null;
}

export interface Story {
  id: number | string;
  title: string;
  author: string;
  tags: string[];
  color: string;
  desc: string | null;
  summary: string | null; // Long description for detail page
  characters?: Character[];
}

export interface HeroSlide {
  id: number;
  marketingTitle: string; // Marketing Headline
  title: string; // Actual Book Title
  desc: string;
  image: string;
  tag: string;
  character: string;
  firstMessage: string;
}

export interface Creator {
  id: number;
  name: string;
  title: string;
  desc: string;
  color: string;
}

export interface ChatContext {
  id?: number | string;
  title: string;
  character: string;
  firstMessage: string | null;
  color: string | null;
  desc: string | null;
}

export interface ChatMessage {
  id: number;
  role: "user" | "ai";
  text: string;
}
