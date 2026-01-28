import { useState } from "react";

import type { StoryDetail } from "@/types/story";

interface UseStoryFormLogicProps {
  initialData?: StoryDetail;
}

export const useStoryFormLogic = ({ initialData }: UseStoryFormLogicProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [authorName, setAuthorName] = useState(initialData?.authorName || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const coverColor = initialData?.coverColor || "bg-stone-800";

  const isFormValid = title.trim() && authorName.trim() && description.trim() && summary.trim();

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
  };
};
