import { Loader2, Plus, Sparkles, Users } from "lucide-react";

import { CharacterImageModal } from "@/components/character";
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
import { CharacterFormCard } from "@/pages/character/CharacterFormCard";
import type {
  CharacterDetail,
  CreateCharacterRequest,
  UpdateCharacterRequest,
} from "@/types/story";

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
  canGenerateCharacters: boolean;
  imageModalCharacter: {
    id: string;
    name: string;
    role: string;
    description: string;
    personality: string;
  } | null;
  characterToDelete: string | null;
  handleAddCharacter: () => void;
  handleRemoveCharacter: (id: string) => void;
  handleCharacterChange: (
    id: string,
    field: keyof Omit<CreateCharacterRequest, "id">,
    value: string,
  ) => void;
  handleStartEditCharacter: (char: CharacterDetail) => void;
  handleCancelEditCharacter: () => void;
  handleSaveCharacter: (id: string) => void;
  handleDeleteCharacter: (id: string) => void;
  handleConfirmDeleteCharacter: () => void;
  handleCancelDeleteCharacter: () => void;
  handleOpenAddCharacter: () => void;
  handleCancelAddCharacter: () => void;
  handleSaveNewCharacter: () => void;
  handleGenerateCharacters: () => void;
  handleOpenImageModal: (char: {
    id: string;
    name: string;
    role: string;
    description: string;
    personality?: string | null;
  }) => void;
  handleCloseImageModal: () => void;
  handleConfirmImage: (imageBase64: string) => void;
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
  canGenerateCharacters,
  imageModalCharacter,
  characterToDelete,
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
  handleOpenImageModal,
  handleCloseImageModal,
  handleConfirmImage,
}: CharactersSectionProps) => {
  const displayCharacters = isEditMode ? existingCharacters : characters;

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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateCharacters}
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
          isEditing
          name={newCharacterData.name || ""}
          role={newCharacterData.role || ""}
          description={newCharacterData.description || ""}
          personality={newCharacterData.personality || ""}
          firstMessage={newCharacterData.firstMessage || ""}
          profileImage={newCharacterData.profileImage}
          backgroundImage={newCharacterData.backgroundImage}
          backgroundColor={newCharacterData.backgroundColor}
          onNameChange={(v) => setNewCharacterData({ ...newCharacterData, name: v })}
          onRoleChange={(v) => setNewCharacterData({ ...newCharacterData, role: v })}
          onDescriptionChange={(v) => setNewCharacterData({ ...newCharacterData, description: v })}
          onPersonalityChange={(v) => setNewCharacterData({ ...newCharacterData, personality: v })}
          onFirstMessageChange={(v) =>
            setNewCharacterData({ ...newCharacterData, firstMessage: v })
          }
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
                    isEditing
                    name={editingCharacterData.name || ""}
                    role={editingCharacterData.role || ""}
                    description={editingCharacterData.description || ""}
                    personality={editingCharacterData.personality || ""}
                    firstMessage={editingCharacterData.firstMessage || ""}
                    profileImage={editingCharacterData.profileImage ?? null}
                    backgroundImage={editingCharacterData.backgroundImage ?? null}
                    backgroundColor={editingCharacterData.backgroundColor ?? null}
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
                    onSave={() => handleSaveCharacter(char.id)}
                    onCancel={handleCancelEditCharacter}
                    isSaving={isUpdatingCharacter}
                  />
                ) : (
                  <CharacterFormCard
                    key={char.id}
                    name={char.name}
                    role={char.role}
                    description={char.description}
                    personality={char.personality || ""}
                    firstMessage={char.firstMessage || ""}
                    profileImage={char.profileImage}
                    backgroundImage={char.backgroundImage}
                    backgroundColor={char.backgroundColor}
                    onEdit={() => handleStartEditCharacter(char)}
                    onDelete={() => handleDeleteCharacter(char.id)}
                    onGenerateImage={() => handleOpenImageModal(char)}
                    isDeleting={isDeletingCharacter}
                  />
                ),
              )
            : characters.map((char) => (
                <CharacterFormCard
                  key={char.id}
                  isEditing
                  name={char.name}
                  role={char.role}
                  description={char.description}
                  personality={char.personality ?? null}
                  firstMessage={char.firstMessage ?? null}
                  profileImage={char.profileImage}
                  backgroundImage={char.backgroundImage}
                  backgroundColor={char.backgroundColor}
                  onNameChange={(v) => handleCharacterChange(char.id, "name", v)}
                  onRoleChange={(v) => handleCharacterChange(char.id, "role", v)}
                  onDescriptionChange={(v) => handleCharacterChange(char.id, "description", v)}
                  onPersonalityChange={(v) => handleCharacterChange(char.id, "personality", v)}
                  onFirstMessageChange={(v) => handleCharacterChange(char.id, "firstMessage", v)}
                  onDelete={() => handleRemoveCharacter(char.id)}
                  onGenerateImage={() => handleOpenImageModal(char)}
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
            <AlertDialogAction onClick={handleConfirmDeleteCharacter}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
