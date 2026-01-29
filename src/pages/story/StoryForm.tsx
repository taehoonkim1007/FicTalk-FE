import { useState } from "react";

import { FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { useStoryCharactersLogic } from "@/hooks/useStoryCharactersLogic";
import { useStoryFormLogic } from "@/hooks/useStoryFormLogic";
import { CharactersSection } from "@/pages/story/CharactersSection";
import { StoryInfoSection } from "@/pages/story/StoryInfoSection";
import type { StoryDetail, StoryFormData } from "@/types/story";

interface StoryFormProps {
  initialData: StoryDetail | null;
  onSubmit: (data: StoryFormData) => void;
  isSubmitting: boolean;
  isEditMode: boolean;
}

export const StoryForm = ({ initialData, onSubmit, isSubmitting, isEditMode }: StoryFormProps) => {
  const storyId = initialData?.id || "";

  // 탭 상태
  const [activeTab, setActiveTab] = useState<string>("story");

  // 1. 폼 상태 로직 분리
  const {
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
    isGeneratingSummary,
    handleGenerateSummary,
  } = useStoryFormLogic({ initialData });

  // 2. 캐릭터 로직 분리
  const {
    characters,
    existingCharacters,
    editingCharacterId,
    editingCharacterData,
    setEditingCharacterData,
    isAddingCharacter,
    newCharacterData,
    setNewCharacterData,
    isCreatingCharacter,
    isUpdatingCharacter,
    isDeletingCharacter,
    isGeneratingCharacters,
    imageModalCharacter,
    handleAddCharacter,
    handleRemoveCharacter,
    handleCharacterChange,
    handleStartEditCharacter,
    handleCancelEditCharacter,
    handleSaveCharacter,
    handleDeleteCharacter,
    handleOpenAddCharacter,
    handleCancelAddCharacter,
    handleSaveNewCharacter,
    handleGenerateCharacters,
    handleOpenImageModal,
    handleCloseImageModal,
    handleConfirmImage,
  } = useStoryCharactersLogic({
    storyId,
    isEditMode,
    initialCharacters: initialData?.characters ?? [],
    formState: { title, description, summary },
  });

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      authorName,
      description,
      summary,
      coverColor,
      characters,
    });
  };

  // AI 캐릭터 생성 가능 여부
  const canGenerateCharacters = !!(title.trim() && description.trim() && summary.trim());

  return (
    <form onSubmit={handleSubmit} className="pb-24">
      {/* 탭 네비게이션 */}
      <Tabs
        tabs={[
          { id: "story", label: "1. 스토리 작성" },
          { id: "characters", label: "2. 캐릭터 설정" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* 탭 내용 */}
      {activeTab === "story" ? (
        <StoryInfoSection
          title={title}
          setTitle={setTitle}
          authorName={authorName}
          setAuthorName={setAuthorName}
          description={description}
          setDescription={setDescription}
          summary={summary}
          setSummary={setSummary}
          isGeneratingSummary={isGeneratingSummary}
          handleGenerateSummary={handleGenerateSummary}
        />
      ) : (
        <CharactersSection
          isEditMode={isEditMode}
          characters={characters}
          existingCharacters={existingCharacters}
          editingCharacterId={editingCharacterId}
          editingCharacterData={editingCharacterData}
          setEditingCharacterData={setEditingCharacterData}
          isAddingCharacter={isAddingCharacter}
          newCharacterData={newCharacterData}
          setNewCharacterData={setNewCharacterData}
          isCreatingCharacter={isCreatingCharacter}
          isUpdatingCharacter={isUpdatingCharacter}
          isDeletingCharacter={isDeletingCharacter}
          isGeneratingCharacters={isGeneratingCharacters}
          canGenerateCharacters={canGenerateCharacters}
          imageModalCharacter={imageModalCharacter}
          handleAddCharacter={handleAddCharacter}
          handleRemoveCharacter={handleRemoveCharacter}
          handleCharacterChange={handleCharacterChange}
          handleStartEditCharacter={handleStartEditCharacter}
          handleCancelEditCharacter={handleCancelEditCharacter}
          handleSaveCharacter={handleSaveCharacter}
          handleDeleteCharacter={handleDeleteCharacter}
          handleOpenAddCharacter={handleOpenAddCharacter}
          handleCancelAddCharacter={handleCancelAddCharacter}
          handleSaveNewCharacter={handleSaveNewCharacter}
          handleGenerateCharacters={handleGenerateCharacters}
          handleOpenImageModal={handleOpenImageModal}
          handleCloseImageModal={handleCloseImageModal}
          handleConfirmImage={handleConfirmImage}
        />
      )}

      {/* 게시하기 버튼 (하단 고정) */}
      <div className="fixed right-0 bottom-0 left-0 border-t border-stone-800 bg-stone-950 p-4">
        <div className="mx-auto max-w-3xl">
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="h-12 w-full bg-emerald-600 text-base font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                {isEditMode ? "수정하기" : "게시하기"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
