export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface Character {
  id: string | number;
  name: string;
  role: string;
  desc: string;
  image?: string; // Optional image class or url
}

export interface Story {
  id: number | string;
  title: string;
  author: string;
  tags: string[];
  color: string;
  desc?: string; // Short description
  summary?: string; // Long description for detail page
  character?: string; // Main character (legacy)
  characters?: Character[]; // List of characters
}

export interface HeroSlide {
  id: number;
  title: string; // Marketing Headline
  storyTitle: string; // Actual Book Title
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
  firstMessage?: string;
  color?: string;
  desc?: string;
}

export interface ChatMessage {
  id: number;
  role: "user" | "ai";
  text: string;
}
