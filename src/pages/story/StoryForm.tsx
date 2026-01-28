import { useState } from "react";

import { FileText, Loader2, Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";
import { CharacterFormCard } from "@/pages/character/CharacterFormCard";
import {
  useCreateCharacter,
  useDeleteCharacter,
  useUpdateCharacter,
} from "@/queries/useCharactersQueries";
import { useStoryCharacters } from "@/queries/useStoriesQueries";
import type {
  Character,
  CreateCharacterRequest,
  StoryDetail,
  StoryFormData,
  UpdateCharacterRequest,
} from "@/types/story";

interface StoryFormProps {
  initialData?: StoryDetail;
  onSubmit: (data: StoryFormData) => void;
  isSubmitting: boolean;
  isEditMode: boolean;
}

export const StoryForm = ({ initialData, onSubmit, isSubmitting, isEditMode }: StoryFormProps) => {
  const storyId = initialData?.id || "";

  const [title, setTitle] = useState(initialData?.title || "");
  const [authorName, setAuthorName] = useState(initialData?.authorName || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const coverColor = initialData?.coverColor || "bg-stone-800";

  // 생성 모드: 캐릭터 로컬 상태
  const [characters, setCharacters] = useState<(CreateCharacterRequest & { id: string })[]>([]);

  // 편집 모드: 캐릭터 목록 조회
  const { data: charactersData } = useStoryCharacters(storyId, isEditMode);
  const existingCharacters = charactersData?.characters || initialData?.characters || [];

  // 편집 모드: 캐릭터 CRUD
  const { mutate: createCharacter, isPending: isCreatingCharacter } = useCreateCharacter(storyId);
  const { mutate: updateCharacter, isPending: isUpdatingCharacter } = useUpdateCharacter(storyId);
  const { mutate: deleteCharacter, isPending: isDeletingCharacter } = useDeleteCharacter(storyId);

  // 편집 중인 캐릭터 상태
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
  const [editingCharacterData, setEditingCharacterData] = useState<UpdateCharacterRequest>({});

  // 새 캐릭터 추가 상태 (편집 모드용)
  const [isAddingCharacter, setIsAddingCharacter] = useState(false);
  const [newCharacterData, setNewCharacterData] = useState<CreateCharacterRequest>({
    id: "",
    name: "",
    role: "",
    description: "",
    firstMessage: "",
    profileImage: null,
    backgroundImage: null,
    backgroundColor: null,
  });

  // ==========================================
  // 생성 모드: 캐릭터 핸들러
  // ==========================================

  const handleAddCharacter = () => {
    if (characters.length >= 20) return;
    setCharacters([
      ...characters,
      {
        id: crypto.randomUUID(),
        name: "",
        role: "",
        description: "",
        firstMessage: "",
        profileImage: null,
        backgroundImage: null,
        backgroundColor: null,
      },
    ]);
  };

  const handleRemoveCharacter = (id: string) => {
    setCharacters(characters.filter((c) => c.id !== id));
  };

  const handleCharacterChange = (
    id: string,
    field: keyof Omit<CreateCharacterRequest, "id">,
    value: string,
  ) => {
    setCharacters(characters.map((char) => (char.id === id ? { ...char, [field]: value } : char)));
  };

  // ==========================================
  // 편집 모드: 캐릭터 수정 핸들러
  // ==========================================

  const handleStartEditCharacter = (char: Character & { firstMessage?: string | null }) => {
    setEditingCharacterId(char.id);
    setEditingCharacterData({
      name: char.name,
      role: char.role,
      description: char.description,
      firstMessage: char.firstMessage || "",
      profileImage: char.profileImage,
      backgroundImage: char.backgroundImage,
      backgroundColor: char.backgroundColor,
    });
  };

  const handleCancelEditCharacter = () => {
    setEditingCharacterId(null);
    setEditingCharacterData({});
  };

  const handleSaveCharacter = (characterId: string) => {
    updateCharacter(
      { id: characterId, data: editingCharacterData },
      {
        onSuccess: () => {
          toast.success(SUCCESS_MESSAGES.CHARACTER_UPDATED);
          setEditingCharacterId(null);
          setEditingCharacterData({});
        },
        onError: () => {
          toast.error(ERROR_MESSAGES.CHARACTER_UPDATE_FAILED);
        },
      },
    );
  };

  const handleDeleteCharacter = (characterId: string) => {
    if (!window.confirm("정말로 이 캐릭터를 삭제하시겠습니까?")) return;
    deleteCharacter(characterId, {
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGES.CHARACTER_DELETED);
      },
      onError: () => {
        toast.error(ERROR_MESSAGES.CHARACTER_DELETE_FAILED);
      },
    });
  };

  // ==========================================
  // 편집 모드: 캐릭터 추가 핸들러
  // ==========================================

  const handleOpenAddCharacter = () => {
    setIsAddingCharacter(true);
    setNewCharacterData({
      id: crypto.randomUUID(),
      name: "",
      role: "",
      description: "",
      firstMessage: "",
      profileImage: null,
      backgroundImage: null,
      backgroundColor: null,
    });
  };

  const handleCancelAddCharacter = () => {
    setIsAddingCharacter(false);
  };

  const handleSaveNewCharacter = () => {
    if (!newCharacterData.name || !newCharacterData.role || !newCharacterData.description) {
      toast.error("이름, 역할, 설명은 필수입니다.");
      return;
    }
    createCharacter(newCharacterData, {
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGES.CHARACTER_CREATED);
        setIsAddingCharacter(false);
      },
      onError: () => {
        toast.error(ERROR_MESSAGES.CHARACTER_CREATE_FAILED);
      },
    });
  };

  // ==========================================
  // 폼 제출
  // ==========================================

  const isFormValid = title.trim() && authorName.trim() && description.trim() && summary.trim();

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

  // 캐릭터 목록 (생성 모드 or 편집 모드)
  const displayCharacters = isEditMode ? existingCharacters : characters;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {/* 제목 */}
      <div>
        <label className="mb-2 block text-sm text-stone-400">제목 *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          className="w-full rounded-lg border-0 bg-stone-900 px-4 py-3.5 text-white placeholder-stone-500 ring-1 ring-stone-800 outline-none focus:ring-emerald-500"
          placeholder="작품의 제목을 입력하세요"
        />
      </div>

      {/* 저자명 & 한줄 소개 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-stone-400">저자명 *</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={100}
            required
            className="w-full rounded-lg border-0 bg-stone-900 px-4 py-3.5 text-white placeholder-stone-500 ring-1 ring-stone-800 outline-none focus:ring-emerald-500"
            placeholder="필명을 입력하세요"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-stone-400">한줄 소개 *</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={300}
            required
            className="w-full rounded-lg border-0 bg-stone-900 px-4 py-3.5 text-white placeholder-stone-500 ring-1 ring-stone-800 outline-none focus:ring-emerald-500"
            placeholder="작품을 한 문장으로 표현해주세요"
          />
        </div>
      </div>

      {/* 줄거리 */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm text-stone-400">줄거리 *</label>
          <span className="text-sm text-stone-500">{summary.length} / 3000</span>
        </div>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          maxLength={3000}
          required
          rows={8}
          className="w-full resize-none rounded-lg border-0 bg-stone-900 px-4 py-3.5 text-white placeholder-stone-500 ring-1 ring-stone-800 outline-none focus:ring-emerald-500"
          placeholder="작품의 전체적인 줄거리를 입력해주세요. (최대 3000자)"
        />
      </div>

      {/* 등장인물 섹션 */}
      <div className="border-t border-stone-800 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-400">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">등장인물</span>
          </div>
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

        {/* 새 캐릭터 추가 폼 (편집 모드) */}
        {isEditMode && isAddingCharacter && (
          <CharacterFormCard
            isEditing
            name={newCharacterData.name || ""}
            role={newCharacterData.role || ""}
            description={newCharacterData.description || ""}
            firstMessage={newCharacterData.firstMessage || ""}
            profileImage={newCharacterData.profileImage}
            backgroundImage={newCharacterData.backgroundImage}
            backgroundColor={newCharacterData.backgroundColor}
            onNameChange={(v) => setNewCharacterData({ ...newCharacterData, name: v })}
            onRoleChange={(v) => setNewCharacterData({ ...newCharacterData, role: v })}
            onDescriptionChange={(v) =>
              setNewCharacterData({ ...newCharacterData, description: v })
            }
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
          <div className="rounded-lg border border-dashed border-stone-700 py-8 text-center">
            <p className="text-sm text-stone-500">등록된 캐릭터가 없습니다.</p>
            <p className="mt-1 text-xs text-stone-600">
              인물 추가 버튼을 눌러 캐릭터를 추가하세요.
            </p>
          </div>
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
                      firstMessage={char.firstMessage || ""}
                      profileImage={char.profileImage}
                      backgroundImage={char.backgroundImage}
                      backgroundColor={char.backgroundColor}
                      onEdit={() => handleStartEditCharacter(char)}
                      onDelete={() => handleDeleteCharacter(char.id)}
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
                    firstMessage={char.firstMessage ?? null}
                    profileImage={char.profileImage}
                    backgroundImage={char.backgroundImage}
                    backgroundColor={char.backgroundColor}
                    onNameChange={(v) => handleCharacterChange(char.id, "name", v)}
                    onRoleChange={(v) => handleCharacterChange(char.id, "role", v)}
                    onDescriptionChange={(v) => handleCharacterChange(char.id, "description", v)}
                    onFirstMessageChange={(v) => handleCharacterChange(char.id, "firstMessage", v)}
                    onDelete={() => handleRemoveCharacter(char.id)}
                  />
                ))}
          </div>
        )}
      </div>

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
