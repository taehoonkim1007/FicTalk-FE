import { useState } from "react";

import { toast } from "sonner";

import { useGenerateSummary } from "@/queries/useStoriesQueries";
import type { StoryDetail } from "@/types/story";

interface UseStoryFormLogicProps {
  initialData: StoryDetail | null;
}

export const useStoryFormLogic = ({ initialData }: UseStoryFormLogicProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [authorName, setAuthorName] = useState(initialData?.authorName || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const coverColor = initialData?.coverColor || "bg-stone-800";

  const isFormValid = title.trim() && authorName.trim() && description.trim() && summary.trim();

  // AI 줄거리 생성
  const { mutate: generateSummaryMutate, isPending: isGeneratingSummary } = useGenerateSummary();

  const handleGenerateSummary = () => {
    if (!title.trim() || !description.trim()) {
      toast.error("제목과 한줄 소개를 먼저 입력해주세요.");
      return;
    }
    generateSummaryMutate(
      { title, description },
      {
        onSuccess: (data) => {
          setSummary(data.summary);
          toast.success("줄거리가 생성되었습니다.");
        },
        onError: () => {
          toast.error("줄거리 생성에 실패했습니다.");
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
    isFormValid,
    // AI 생성
    isGeneratingSummary,
    handleGenerateSummary,
  };
};
