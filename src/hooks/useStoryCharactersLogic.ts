import { useState } from "react";

import { toast } from "sonner";

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";
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
  UpdateCharacterRequest,
} from "@/types/story";

interface UseStoryCharactersLogicProps {
  storyId: string;
  isEditMode: boolean;
  initialCharacters?: StoryDetail["characters"];
}

export const useStoryCharactersLogic = ({
  storyId,
  isEditMode,
  initialCharacters,
}: UseStoryCharactersLogicProps) => {
  // 생성 모드: 캐릭터 로컬 상태
  const [characters, setCharacters] = useState<(CreateCharacterRequest & { id: string })[]>([]);

  // 편집 모드: 캐릭터 목록 조회
  const { data: charactersData } = useStoryCharacters(storyId, isEditMode);
  const existingCharacters = charactersData?.characters || initialCharacters || [];

  // 편집 모드: 캐릭터 CRUD Queries
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
  // 핸들러: 로컬 상태 (생성 모드)
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
  // 핸들러: 서버 상태 (편집 모드)
  // ==========================================

  // 수정 시작
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

  // 수정 취소
  const handleCancelEditCharacter = () => {
    setEditingCharacterId(null);
    setEditingCharacterData({});
  };

  // 수정 저장
  const handleSaveCharacter = (characterId: string) => {
    if (
      !editingCharacterData.name?.trim() ||
      !editingCharacterData.role?.trim() ||
      !editingCharacterData.description?.trim()
    ) {
      toast.error("이름, 역할, 설명은 필수입니다.");
      return;
    }

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

  // 삭제
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

  // 새 캐릭터 모달 열기
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

  // 새 캐릭터 모달 닫기
  const handleCancelAddCharacter = () => {
    setIsAddingCharacter(false);
  };

  // 새 캐릭터 저장
  const handleSaveNewCharacter = () => {
    if (
      !newCharacterData.name?.trim() ||
      !newCharacterData.role?.trim() ||
      !newCharacterData.description?.trim()
    ) {
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

  return {
    // 상태
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

    // 핸들러
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
  };
};
