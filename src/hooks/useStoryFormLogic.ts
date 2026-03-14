import { useState } from "react";

import { toast } from "sonner";

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";
import { useGenerateSummary } from "@/queries/useStoriesQueries";
import type { StoryDetail } from "@/types/story";

interface UseStoryFormLogicProps {
  initialData: StoryDetail | null;
}

export const useStoryFormLogic = ({ initialData }: UseStoryFormLogicProps) => {
  // ==========================================
  // 로컬 상태
  // ==========================================
  // 스토리 기본 정보
  const [title, setTitle] = useState(initialData?.title || "");
  const [authorName, setAuthorName] = useState(initialData?.authorName || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  // 이미지
  const [coverImage, setCoverImage] = useState<string | null>(initialData?.coverImage ?? null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(
    initialData?.backgroundImage ?? null,
  );

  // ==========================================
  // 계산된 값 (Computed)
  // ==========================================
  const coverColor = initialData?.coverColor || "bg-stone-800";
  const isFormValid = title.trim() && authorName.trim() && description.trim() && summary.trim();

  // ==========================================
  // 서버 상태 (React Query)
  // ==========================================
  const { mutate: generateSummaryMutate, isPending: isGeneratingSummary } = useGenerateSummary();

  // ==========================================
  // 핸들러
  // ==========================================
  // AI 줄거리 생성
  const handleGenerateSummary = () => {
    if (!title.trim() || !description.trim()) {
      toast.error(ERROR_MESSAGES.STORY_BASIC_FIELDS_REQUIRED);
      return;
    }
    generateSummaryMutate(
      { title, description },
      {
        onSuccess: (data) => {
          setSummary(data.summary);
          toast.success(SUCCESS_MESSAGES.SUMMARY_GENERATED);
        },
        onError: () => {
          toast.error(ERROR_MESSAGES.SUMMARY_GENERATE_FAILED);
        },
      },
    );
  };

  return {
    title,
    setTitle,
    authorName,
    setAuthorName,
    description,
    setDescription,
    summary,
    setSummary,
    coverColor,
    coverImage,
    setCoverImage,
    backgroundImage,
    setBackgroundImage,
    isFormValid,
    // AI 생성
    isGeneratingSummary,
    handleGenerateSummary,
  };
};
