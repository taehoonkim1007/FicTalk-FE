import { useState } from "react";

import { toast } from "sonner";

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";
import {
  useCreateCharacter,
  useDeleteCharacter,
  useUpdateCharacter,
} from "@/queries/useCharactersQueries";
import { useGenerateCharacters, useStoryCharacters } from "@/queries/useStoriesQueries";
import type {
  Character,
  CharacterDetail,
  CreateCharacterRequest,
  UpdateCharacterRequest,
} from "@/types/story";

interface UseStoryCharactersLogicProps {
  storyId: string;
  isEditMode: boolean;
  initialCharacters: CharacterDetail[];
  formState: {
    title: string;
    description: string;
    summary: string;
  };
}

export const useStoryCharactersLogic = ({
  storyId,
  isEditMode,
  initialCharacters,
  formState,
}: UseStoryCharactersLogicProps) => {
  // 생성 모드: 캐릭터 로컬 상태
  const [characters, setCharacters] = useState<(CreateCharacterRequest & { id: string })[]>([]);

  // 편집 모드: 캐릭터 목록 조회
  const { data: charactersData } = useStoryCharacters(storyId, isEditMode);
  const existingCharacters = charactersData?.characters ?? initialCharacters;

  // 편집 모드: 캐릭터 CRUD Queries
  const { mutate: createCharacter, isPending: isCreatingCharacter } = useCreateCharacter(storyId);
  const { mutate: updateCharacter, isPending: isUpdatingCharacter } = useUpdateCharacter(storyId);
  const { mutate: deleteCharacter, isPending: isDeletingCharacter } = useDeleteCharacter(storyId);

  // AI 캐릭터 생성
  const { mutate: generateCharactersMutate, isPending: isGeneratingCharacters } =
    useGenerateCharacters();

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
    personality: "",
    firstMessage: "",
    profileImage: null,
    backgroundImage: null,
    backgroundColor: null,
  });

  // 이미지 생성 모달 상태
  const [imageModalCharacter, setImageModalCharacter] = useState<{
    id: string;
    name: string;
    role: string;
    description: string;
    personality: string;
  } | null>(null);

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
        personality: "",
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
  const handleStartEditCharacter = (
    char: Character & { personality?: string | null; firstMessage?: string | null },
  ) => {
    setEditingCharacterId(char.id);
    setEditingCharacterData({
      name: char.name,
      role: char.role,
      description: char.description,
      personality: char.personality || "",
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
      personality: "",
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

  // ==========================================
  // 핸들러: 이미지 생성 모달
  // ==========================================
  const handleOpenImageModal = (char: {
    id: string;
    name: string;
    role: string;
    description: string;
    personality?: string | null;
  }) => {
    setImageModalCharacter({
      id: char.id,
      name: char.name,
      role: char.role,
      description: char.description,
      personality: char.personality || "",
    });
  };

  const handleCloseImageModal = () => {
    setImageModalCharacter(null);
  };

  const handleConfirmImage = (imageBase64: string) => {
    if (!imageModalCharacter) return;

    const profileImageDataUrl = `data:image/png;base64,${imageBase64}`;

    if (isEditMode) {
      // 편집 모드: 서버에 저장
      updateCharacter(
        { id: imageModalCharacter.id, data: { profileImage: profileImageDataUrl } },
        {
          onSuccess: () => {
            toast.success("프로필 이미지가 저장되었습니다.");
            setImageModalCharacter(null);
          },
          onError: () => {
            toast.error("프로필 이미지 저장에 실패했습니다.");
          },
        },
      );
    } else {
      // 생성 모드: 로컬 상태 업데이트
      setCharacters(
        characters.map((c) =>
          c.id === imageModalCharacter.id ? { ...c, profileImage: profileImageDataUrl } : c,
        ),
      );
      setImageModalCharacter(null);
      toast.success("프로필 이미지가 적용되었습니다.");
    }
  };

  // ==========================================
  // 핸들러: AI 캐릭터 생성
  // ==========================================
  const handleGenerateCharacters = () => {
    if (!formState.title.trim() || !formState.description.trim() || !formState.summary.trim()) {
      toast.error("제목, 한줄 소개, 줄거리를 먼저 입력해주세요.");
      return;
    }

    generateCharactersMutate(
      {
        title: formState.title,
        description: formState.description,
        summary: formState.summary,
      },
      {
        onSuccess: (data) => {
          const newCharacters = data.characters.map((char) => ({
            id: crypto.randomUUID(),
            name: char.name,
            role: char.role,
            description: char.description,
            personality: char.personality,
            firstMessage: char.firstMessage,
            profileImage: null,
            backgroundImage: null,
            backgroundColor: null,
          }));
          setCharacters(newCharacters);
          toast.success(`${data.characters.length}명의 캐릭터가 생성되었습니다.`);
        },
        onError: () => {
          toast.error("캐릭터 생성에 실패했습니다.");
        },
      },
    );
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
    isGeneratingCharacters,
    imageModalCharacter,

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
    handleGenerateCharacters,
    handleOpenImageModal,
    handleCloseImageModal,
    handleConfirmImage,
  };
};
