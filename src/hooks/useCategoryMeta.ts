import { BookOpen, Globe, type LucideIcon, PenTool, Sparkles } from "lucide-react";

import { useCategories } from "@/queries/useCategoriesQueries";

const ICON_MAP: Record<string, LucideIcon> = {
  globe: Globe,
  "book-open": BookOpen,
  "pen-tool": PenTool,
};

const DEFAULT_META = {
  emoji: "📚",
  name: "모든 이야기",
  title: "모든 이야기",
  description: "FicTalk의 모든 매력적인 캐릭터와 스토리를 한곳에서 만나보세요.",
  colorClass: "text-amber-400",
  Icon: Sparkles,
};

const COLOR_MAP: Record<string, string> = {
  "world-lit": "text-emerald-500",
  "korean-lit": "text-rose-500",
  creative: "text-violet-500",
};

export const useCategoryMeta = (slug?: string) => {
  const { data: categories } = useCategories();

  if (!slug || !categories) {
    return DEFAULT_META;
  }

  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return DEFAULT_META;
  }

  return {
    emoji: category.emoji,
    name: category.name,
    title: category.title,
    description: category.description,
    colorClass: COLOR_MAP[category.slug] || category.colorClass || "text-emerald-500",
    Icon: ICON_MAP[category.iconName] || Sparkles,
  };
};
