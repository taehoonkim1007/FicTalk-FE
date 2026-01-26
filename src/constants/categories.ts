import { BookOpen, Globe, PenTool, Sparkles } from "lucide-react";

export type CategoryConfig = {
  icon: React.ElementType;
  emoji: string;
  title: string;
  desc: string;
  color: string;
};

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  "world-lit": {
    icon: Globe,
    emoji: "🏰",
    title: "시대를 초월한 세계 명작",
    desc: "국경과 시대를 넘어 사랑받는 불멸의 고전들을 만나보세요.",
    color: "text-emerald-400",
  },
  "korean-lit": {
    icon: BookOpen,
    emoji: "🇰🇷",
    title: "한국 문학의 정수",
    desc: "우리 말과 글로 빚어낸 한국 문학의 깊은 울림을 느껴보세요.",
    color: "text-rose-400",
  },
  creative: {
    icon: PenTool,
    emoji: "✨",
    title: "새로운 상상, 창작 스토리",
    desc: "독창적인 아이디어와 새로운 세계관이 펼쳐지는 창작 공간입니다.",
    color: "text-violet-400",
  },
  default: {
    icon: Sparkles,
    emoji: "📚",
    title: "모든 이야기",
    desc: "FicTalk의 모든 매력적인 캐릭터와 스토리를 한곳에서 만나보세요.",
    color: "text-amber-400",
  },
};
