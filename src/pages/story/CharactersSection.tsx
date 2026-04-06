import { useState } from "react";

import { Loader2, Plus, Sparkles, Users } from "lucide-react";

import {
  CharacterFormCard,
  CharacterImageModal,
  CharacterVoiceModal,
} from "@/components/character";
import { EmptyState } from "@/components/common";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type {
  CharacterDetail,
  CreateCharacterRequest,
  UpdateCharacterRequest,
} from "@/types/character";

interface CharactersSectionProps {
  isEditMode: boolean;
  characters: (CreateCharacterRequest & { id: string })[];
  existingCharacters: CharacterDetail[];
  editingCharacterId: string | null;
  editingCharacterData: UpdateCharacterRequest;
  setEditingCharacterData: (data: UpdateCharacterRequest) => void;
  isAddingCharacter: boolean;
  newCharacterData: CreateCharacterRequest;
  setNewCharacterData: (data: CreateCharacterRequest) => void;
  isCreatingCharacter: boolean;
  isUpdatingCharacter: boolean;
  isDeletingCharacter: boolean;
  isGeneratingCharacters: boolean;
  isGeneratingBackgroundImage: boolean;
  generatingBackgroundCharacterId: string | null;
  storyTitle: string;
  storyDescription: string;
  storySummary: string;
  storyBackgroundImage: string | null;
  imageModalCharacter: {
    id: string;
    name: string;
    role: string;
    description: string;
    personality: string;
  } | null;
  characterToDelete: string | null;
  voicePreviewModal: {
    characterId: string;
    characterName: string;
    voiceId: string;
    voiceName: string;
    audioBase64: string | null;
  } | null;
  generatingVoiceCharacterId: string | null;
  handleAddCharacter: () => void;
  handleRemoveCharacter: (id: string) => void;
  handleCharacterChange: (
    id: string,
    field: keyof Omit<CreateCharacterRequest, "id">,
    value: string,
  ) => void;
  handleStartEditCharacter: (char: CharacterDetail) => void;
  handleCancelEditCharacter: () => void;
  handleSaveCharacter: (id: string) => void | Promise<void>;
  handleDeleteCharacter: (id: string) => void | Promise<void>;
  handleConfirmDeleteCharacter: () => void | Promise<void>;
  handleCancelDeleteCharacter: () => void;
  handleOpenAddCharacter: () => void;
  handleCancelAddCharacter: () => void;
  handleSaveNewCharacter: () => void | Promise<void>;
  handleGenerateCharacters: () => void | Promise<void>;
  handleGenerateCharacterBackgroundImage: (char: {
    id: string;
    name: string;
    role: string;
    description: string;
    personality?: string | null;
  }) => void | Promise<void>;
  handleOpenImageModal: (char: {
    id: string;
    name: string;
    role: string;
    description: string;
    personality?: string | null;
  }) => void;
  handleCloseImageModal: () => void;
  handleConfirmImage: (imageBase64: string) => void | Promise<void>;
  handleGenerateVoice: (char: {
    id: string;
    name: string;
    description: string;
    personality?: string | null;
    firstMessage?: string | null;
  }) => void | Promise<void>;
  handleCloseVoicePreviewModal: () => void;
  handleConfirmVoice: () => void | Promise<void>;
}

export const CharactersSection = ({
  isEditMode,
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
  storyTitle,
  storyDescription,
  storySummary,
  storyBackgroundImage,
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
}: CharactersSectionProps) => {
  // ==========================================
  // 로컬 상태
  // ==========================================
  // 캐릭터별 "스토리 배경 사용" 상태 (characterId -> boolean)
  const [useStoryBackgroundMap, setUseStoryBackgroundMap] = useState<Record<string, boolean>>({});

  // ==========================================
  // 계산된 값 (Computed)
  // ==========================================
  const displayCharacters = isEditMode ? existingCharacters : characters;
  const canGenerateCharacters = !!(
    storyTitle.trim() &&
    storyDescription.trim() &&
    storySummary.trim()
  );

  // ==========================================
  // 핸들러
  // ==========================================
  // 스토리 배경 사용 체크박스 변경
  const handleUseStoryBackgroundChange = (characterId: string, checked: boolean) => {
    setUseStoryBackgroundMap((prev) => ({ ...prev, [characterId]: checked }));
    // 체크 시 스토리 배경 이미지를 캐릭터 배경으로 설정
    if (checked && storyBackgroundImage) {
      handleCharacterChange(characterId, "backgroundImage", storyBackgroundImage);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-stone-400">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">등장인물</span>
        </div>
        <div className="flex items-center gap-2">
          {/* AI 생성 버튼 (생성 모드에서만) */}
          {!isEditMode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleGenerateCharacters()}
                    disabled={isGeneratingCharacters || !canGenerateCharacters}
                    className="border-emerald-700 bg-transparent text-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300"
                  >
                    {isGeneratingCharacters ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-1 h-4 w-4" />
                    )}
                    AI 생성
                  </Button>
                </span>
              </TooltipTrigger>
              {!canGenerateCharacters && !isGeneratingCharacters && (
                <TooltipContent side="bottom">
                  <p className="mb-2.5 text-stone-200">
                    ✨ 제목, 한줄 소개, 줄거리를 입력하시면 사용할 수 있어요
                  </p>
                  <ul className="space-y-1.5">
                    <li className={storyTitle.trim() ? "text-emerald-400" : "text-red-400"}>
                      {storyTitle.trim() ? "✓" : "✗"} 제목
                    </li>
                    <li className={storyDescription.trim() ? "text-emerald-400" : "text-red-400"}>
                      {storyDescription.trim() ? "✓" : "✗"} 한줄 소개
                    </li>
                    <li className={storySummary.trim() ? "text-emerald-400" : "text-red-400"}>
                      {storySummary.trim() ? "✓" : "✗"} 줄거리
                    </li>
                  </ul>
                </TooltipContent>
              )}
            </Tooltip>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={isEditMode ? handleOpenAddCharacter : handleAddCharacter}
            disabled={isEditMode ? isAddingCharacter : characters.length >= 20}
            className="border-stone-700 bg-transparent text-stone-300 hover:bg-stone-800 hover:text-white"
          >
            <Plus className="mr-1 h-4 w-4" /> 인물 추가
          </Button>
        </div>
      </div>

      {/* 새 캐릭터 추가 폼 (편집 모드) */}
      {isEditMode && isAddingCharacter && (
        <CharacterFormCard
          mode="edit-save"
          name={newCharacterData.name || ""}
          role={newCharacterData.role || ""}
          description={newCharacterData.description || ""}
          personality={newCharacterData.personality || ""}
          firstMessage={newCharacterData.firstMessage || ""}
          profileImage={newCharacterData.profileImage}
          backgroundImage={newCharacterData.backgroundImage}
          backgroundColor={newCharacterData.backgroundColor}
          voiceId={newCharacterData.voiceId}
          onNameChange={(v) => setNewCharacterData({ ...newCharacterData, name: v })}
          onRoleChange={(v) => setNewCharacterData({ ...newCharacterData, role: v })}
          onDescriptionChange={(v) => setNewCharacterData({ ...newCharacterData, description: v })}
          onPersonalityChange={(v) => setNewCharacterData({ ...newCharacterData, personality: v })}
          onFirstMessageChange={(v) =>
            setNewCharacterData({ ...newCharacterData, firstMessage: v })
          }
          onProfileImageChange={(v) =>
            setNewCharacterData({ ...newCharacterData, profileImage: v })
          }
          onBackgroundImageChange={(v) =>
            setNewCharacterData({ ...newCharacterData, backgroundImage: v })
          }
          onGenerateImage={() =>
            handleOpenImageModal({
              id: newCharacterData.id || "",
              name: newCharacterData.name,
              role: newCharacterData.role,
              description: newCharacterData.description,
              personality: newCharacterData.personality || "",
            })
          }
          onGenerateBackgroundImage={() =>
            handleGenerateCharacterBackgroundImage({
              id: newCharacterData.id || "",
              name: newCharacterData.name,
              role: newCharacterData.role,
              description: newCharacterData.description,
              personality: newCharacterData.personality,
            })
          }
          isGeneratingBackgroundImage={
            isGeneratingBackgroundImage && generatingBackgroundCharacterId === newCharacterData.id
          }
          onGenerateVoice={() =>
            handleGenerateVoice({
              id: newCharacterData.id || "",
              name: newCharacterData.name,
              description: newCharacterData.description,
              personality: newCharacterData.personality,
              firstMessage: newCharacterData.firstMessage,
            })
          }
          isGeneratingVoice={generatingVoiceCharacterId === newCharacterData.id}
          storyBackgroundImage={storyBackgroundImage}
          useStoryBackground={useStoryBackgroundMap[newCharacterData.id || "new"] || false}
          onUseStoryBackgroundChange={(checked) => {
            setUseStoryBackgroundMap((prev) => ({
              ...prev,
              [newCharacterData.id || "new"]: checked,
            }));
            if (checked && storyBackgroundImage) {
              setNewCharacterData({ ...newCharacterData, backgroundImage: storyBackgroundImage });
            }
          }}
          onSave={handleSaveNewCharacter}
          onCancel={handleCancelAddCharacter}
          isSaving={isCreatingCharacter}
        />
      )}

      {/* 캐릭터 목록 */}
      {displayCharacters.length === 0 && !isAddingCharacter ? (
        <EmptyState
          title="등록된 캐릭터가 없습니다."
          description="인물 추가 버튼을 눌러 캐릭터를 추가하세요."
          variant="dashed"
          className="py-8"
        />
      ) : (
        <div className="space-y-3">
          {isEditMode
            ? existingCharacters.map((char) =>
                editingCharacterId === char.id ? (
                  <CharacterFormCard
                    key={char.id}
                    mode="edit-save"
                    name={editingCharacterData.name || ""}
                    role={editingCharacterData.role || ""}
                    description={editingCharacterData.description || ""}
                    personality={editingCharacterData.personality || ""}
                    firstMessage={editingCharacterData.firstMessage || ""}
                    profileImage={editingCharacterData.profileImage ?? null}
                    backgroundImage={editingCharacterData.backgroundImage ?? null}
                    backgroundColor={editingCharacterData.backgroundColor ?? null}
                    voiceId={editingCharacterData.voiceId}
                    onNameChange={(v) =>
                      setEditingCharacterData({ ...editingCharacterData, name: v })
                    }
                    onRoleChange={(v) =>
                      setEditingCharacterData({ ...editingCharacterData, role: v })
                    }
                    onDescriptionChange={(v) =>
                      setEditingCharacterData({ ...editingCharacterData, description: v })
                    }
                    onPersonalityChange={(v) =>
                      setEditingCharacterData({ ...editingCharacterData, personality: v })
                    }
                    onFirstMessageChange={(v) =>
                      setEditingCharacterData({ ...editingCharacterData, firstMessage: v })
                    }
                    onProfileImageChange={(v) =>
                      setEditingCharacterData({ ...editingCharacterData, profileImage: v })
                    }
                    onBackgroundImageChange={(v) =>
                      setEditingCharacterData({ ...editingCharacterData, backgroundImage: v })
                    }
                    onGenerateImage={() =>
                      handleOpenImageModal({
                        id: char.id,
                        name: editingCharacterData.name || "",
                        role: editingCharacterData.role || "",
                        description: editingCharacterData.description || "",
                        personality: editingCharacterData.personality || "",
                      })
                    }
                    onGenerateBackgroundImage={() =>
                      handleGenerateCharacterBackgroundImage({
                        id: char.id,
                        name: editingCharacterData.name || "",
                        role: editingCharacterData.role || "",
                        description: editingCharacterData.description || "",
                        personality: editingCharacterData.personality,
                      })
                    }
                    isGeneratingBackgroundImage={
                      isGeneratingBackgroundImage && generatingBackgroundCharacterId === char.id
                    }
                    onGenerateVoice={() =>
                      handleGenerateVoice({
                        id: char.id,
                        name: editingCharacterData.name || "",
                        description: editingCharacterData.description || "",
                        personality: editingCharacterData.personality,
                        firstMessage: editingCharacterData.firstMessage,
                      })
                    }
                    isGeneratingVoice={generatingVoiceCharacterId === char.id}
                    storyBackgroundImage={storyBackgroundImage}
                    useStoryBackground={useStoryBackgroundMap[char.id] || false}
                    onUseStoryBackgroundChange={(checked) => {
                      setUseStoryBackgroundMap((prev) => ({ ...prev, [char.id]: checked }));
                      if (checked && storyBackgroundImage) {
                        setEditingCharacterData({
                          ...editingCharacterData,
                          backgroundImage: storyBackgroundImage,
                        });
                      }
                    }}
                    onSave={() => handleSaveCharacter(char.id)}
                    onCancel={handleCancelEditCharacter}
                    isSaving={isUpdatingCharacter}
                  />
                ) : (
                  <CharacterFormCard
                    key={char.id}
                    mode="view"
                    name={char.name}
                    role={char.role}
                    description={char.description}
                    personality={char.personality || ""}
                    firstMessage={char.firstMessage || ""}
                    profileImage={char.profileImage}
                    backgroundImage={char.backgroundImage}
                    backgroundColor={char.backgroundColor}
                    voiceId={char.voiceId ?? undefined}
                    storyBackgroundImage={storyBackgroundImage}
                    useStoryBackground={useStoryBackgroundMap[char.id] || false}
                    onEdit={() => handleStartEditCharacter(char)}
                    onDelete={() => handleDeleteCharacter(char.id)}
                    onGenerateImage={() => handleOpenImageModal(char)}
                    onGenerateVoice={() =>
                      handleGenerateVoice({
                        id: char.id,
                        name: char.name,
                        description: char.description,
                        personality: char.personality,
                        firstMessage: char.firstMessage,
                      })
                    }
                    isGeneratingVoice={generatingVoiceCharacterId === char.id}
                    isDeleting={isDeletingCharacter}
                  />
                ),
              )
            : characters.map((char) => (
                <CharacterFormCard
                  key={char.id}
                  mode="edit-delete"
                  name={char.name}
                  role={char.role}
                  description={char.description}
                  personality={char.personality ?? null}
                  firstMessage={char.firstMessage ?? null}
                  profileImage={char.profileImage}
                  backgroundImage={char.backgroundImage}
                  backgroundColor={char.backgroundColor}
                  voiceId={char.voiceId}
                  onNameChange={(v) => handleCharacterChange(char.id, "name", v)}
                  onRoleChange={(v) => handleCharacterChange(char.id, "role", v)}
                  onDescriptionChange={(v) => handleCharacterChange(char.id, "description", v)}
                  onPersonalityChange={(v) => handleCharacterChange(char.id, "personality", v)}
                  onFirstMessageChange={(v) => handleCharacterChange(char.id, "firstMessage", v)}
                  onProfileImageChange={(v) => handleCharacterChange(char.id, "profileImage", v)}
                  onBackgroundImageChange={(v) =>
                    handleCharacterChange(char.id, "backgroundImage", v)
                  }
                  onGenerateImage={() => handleOpenImageModal(char)}
                  onGenerateBackgroundImage={() =>
                    handleGenerateCharacterBackgroundImage({
                      id: char.id,
                      name: char.name,
                      role: char.role,
                      description: char.description,
                      personality: char.personality,
                    })
                  }
                  isGeneratingBackgroundImage={
                    isGeneratingBackgroundImage && generatingBackgroundCharacterId === char.id
                  }
                  onGenerateVoice={() =>
                    handleGenerateVoice({
                      id: char.id,
                      name: char.name,
                      description: char.description,
                      personality: char.personality,
                      firstMessage: char.firstMessage,
                    })
                  }
                  isGeneratingVoice={generatingVoiceCharacterId === char.id}
                  storyBackgroundImage={storyBackgroundImage}
                  useStoryBackground={useStoryBackgroundMap[char.id] || false}
                  onUseStoryBackgroundChange={(checked) =>
                    handleUseStoryBackgroundChange(char.id, checked)
                  }
                  onDelete={() => handleRemoveCharacter(char.id)}
                />
              ))}
        </div>
      )}

      {/* 이미지 생성 모달 */}
      {imageModalCharacter && (
        <CharacterImageModal
          isOpen={!!imageModalCharacter}
          onClose={handleCloseImageModal}
          character={imageModalCharacter}
          onConfirm={handleConfirmImage}
        />
      )}

      {/* 캐릭터 삭제 확인 다이얼로그 */}
      <AlertDialog open={!!characterToDelete} onOpenChange={handleCancelDeleteCharacter}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>캐릭터 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 캐릭터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDeleteCharacter}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleConfirmDeleteCharacter()}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 음성 미리듣기 모달 */}
      <CharacterVoiceModal
        isOpen={!!voicePreviewModal}
        onClose={handleCloseVoicePreviewModal}
        voiceName={voicePreviewModal?.voiceName ?? ""}
        audioBase64={voicePreviewModal?.audioBase64 ?? null}
        onConfirm={handleConfirmVoice}
        isConfirming={isUpdatingCharacter}
      />
    </div>
  );
};
