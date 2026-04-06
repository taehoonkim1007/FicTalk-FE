import { useState } from "react";

import { FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStoryCharactersLogic } from "@/hooks/useStoryCharactersLogic";
import { useStoryFormLogic } from "@/hooks/useStoryFormLogic";
import { CharactersSection } from "@/pages/story/CharactersSection";
import { ImageSection } from "@/pages/story/ImageSection";
import { StoryInfoSection } from "@/pages/story/StoryInfoSection";
import type { StoryDetail, StoryFormData } from "@/types/story";

interface StoryFormProps {
  initialData: StoryDetail | null;
  onSubmit: (data: StoryFormData) => void;
  isSubmitting: boolean;
  isEditMode: boolean;
}

export const StoryForm = ({ initialData, onSubmit, isSubmitting, isEditMode }: StoryFormProps) => {
  // ==========================================
  // 로컬 상태
  // ==========================================
  // 탭 상태
  const [activeTab, setActiveTab] = useState("story");

  // ==========================================
  // Props 기반 파생 값
  // ==========================================
  const storyId = initialData?.id || "";

  // ==========================================
  // 커스텀 훅 (로직 분리)
  // ==========================================
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
    coverImage,
    setCoverImage,
    backgroundImage,
    setBackgroundImage,
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
    isGeneratingBackgroundImage,
    generatingBackgroundCharacterId,
    imageModalCharacter,
    characterToDelete,
    voicePreviewModal,
    generatingVoiceCharacterId,
    handleAddCharacter,
    handleRemoveCharacter,
    handleCharacterChange,
    handleStartEditCharacter,
    handleCancelEditCharacter,
    handleSaveCharacter,
    handleDeleteCharacter,
    handleConfirmDeleteCharacter,
    handleCancelDeleteCharacter,
    handleOpenAddCharacter,
    handleCancelAddCharacter,
    handleSaveNewCharacter,
    handleGenerateCharacters,
    handleGenerateCharacterBackgroundImage,
    handleOpenImageModal,
    handleCloseImageModal,
    handleConfirmImage,
    handleGenerateVoice,
    handleCloseVoicePreviewModal,
    handleConfirmVoice,
  } = useStoryCharactersLogic({
    storyId,
    isEditMode,
    initialCharacters: initialData?.characters ?? [],
    formState: { title, description, summary },
  });

  // ==========================================
  // 핸들러
  // ==========================================
  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      authorName,
      description,
      summary,
      coverColor,
      coverImage,
      backgroundImage,
      characters,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="pb-24">
      <TooltipProvider>
        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="story">1. 스토리 작성</TabsTrigger>
            <TabsTrigger value="images">2. 스토리 표지 · 배경 설정</TabsTrigger>
            <TabsTrigger value="characters">3. 캐릭터 설정</TabsTrigger>
          </TabsList>

          {/* 탭 내용 */}
          <TabsContent value="story">
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
            {/* 탭 네비게이션 버튼 */}
            <div className="mt-8 flex justify-end">
              <Button
                type="button"
                onClick={() => setActiveTab("images")}
                className="bg-emerald-600 text-white hover:bg-emerald-500"
              >
                다음
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="images">
            <ImageSection
              coverImage={coverImage}
              onCoverImageChange={setCoverImage}
              backgroundImage={backgroundImage}
              onBackgroundImageChange={setBackgroundImage}
              title={title}
              description={description}
              summary={summary}
            />
            {/* 탭 네비게이션 버튼 */}
            <div className="mt-8 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("story")}
                className="border-stone-700"
              >
                이전
              </Button>
              <Button
                type="button"
                onClick={() => setActiveTab("characters")}
                className="bg-emerald-600 text-white hover:bg-emerald-500"
              >
                다음
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="characters">
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
              isGeneratingBackgroundImage={isGeneratingBackgroundImage}
              generatingBackgroundCharacterId={generatingBackgroundCharacterId}
              storyTitle={title}
              storyDescription={description}
              storySummary={summary}
              storyBackgroundImage={backgroundImage}
              imageModalCharacter={imageModalCharacter}
              characterToDelete={characterToDelete}
              voicePreviewModal={voicePreviewModal}
              generatingVoiceCharacterId={generatingVoiceCharacterId}
              handleAddCharacter={handleAddCharacter}
              handleRemoveCharacter={handleRemoveCharacter}
              handleCharacterChange={handleCharacterChange}
              handleStartEditCharacter={handleStartEditCharacter}
              handleCancelEditCharacter={handleCancelEditCharacter}
              handleSaveCharacter={handleSaveCharacter}
              handleDeleteCharacter={handleDeleteCharacter}
              handleConfirmDeleteCharacter={handleConfirmDeleteCharacter}
              handleCancelDeleteCharacter={handleCancelDeleteCharacter}
              handleOpenAddCharacter={handleOpenAddCharacter}
              handleCancelAddCharacter={handleCancelAddCharacter}
              handleSaveNewCharacter={handleSaveNewCharacter}
              handleGenerateCharacters={handleGenerateCharacters}
              handleGenerateCharacterBackgroundImage={handleGenerateCharacterBackgroundImage}
              handleOpenImageModal={handleOpenImageModal}
              handleCloseImageModal={handleCloseImageModal}
              handleConfirmImage={handleConfirmImage}
              handleGenerateVoice={handleGenerateVoice}
              handleCloseVoicePreviewModal={handleCloseVoicePreviewModal}
              handleConfirmVoice={handleConfirmVoice}
            />
            {/* 탭 네비게이션 버튼 */}
            <div className="mt-8 flex justify-start">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("images")}
                className="border-stone-700"
              >
                이전
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </TooltipProvider>

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
