import { useState } from "react";

import { toast } from "sonner";

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";
import {
  useCreateCharacter,
  useDeleteCharacter,
  useUpdateCharacter,
} from "@/queries/useCharactersQueries";
import {
  useGenerateCharacterBackgroundImage,
  useGenerateCharacters,
  useGenerateTTSSample,
  useGetVoiceId,
  useStoryCharacters,
} from "@/queries/useStoriesQueries";
import type {
  Character,
  CharacterDetail,
  CreateCharacterRequest,
  UpdateCharacterRequest,
  VoiceSettings,
} from "@/types/character";

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
  const { mutateAsync: createCharacterAsync, isPending: isCreatingCharacter } =
    useCreateCharacter(storyId);
  const { mutate: updateCharacter, isPending: isUpdatingCharacter } = useUpdateCharacter(storyId);
  const { mutate: deleteCharacter, isPending: isDeletingCharacter } = useDeleteCharacter(storyId);

  // AI 캐릭터 생성
  const { mutateAsync: generateCharactersMutateAsync, isPending: isGeneratingCharacters } =
    useGenerateCharacters();

  // Voice ID 조회
  const { mutateAsync: getVoiceIdMutateAsync, isPending: isGettingVoiceId } = useGetVoiceId();

  // TTS 샘플 생성
  const { mutateAsync: generateTTSSampleMutateAsync, isPending: isGeneratingTTSSample } =
    useGenerateTTSSample();

  // AI 캐릭터 배경 이미지 생성
  const { mutate: generateBackgroundImageMutate, isPending: isGeneratingBackgroundImage } =
    useGenerateCharacterBackgroundImage();

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
    voiceId: undefined,
  });

  // 이미지 생성 모달 상태
  const [imageModalCharacter, setImageModalCharacter] = useState<{
    id: string;
    name: string;
    role: string;
    description: string;
    personality: string;
  } | null>(null);

  // 배경 이미지 생성 중인 캐릭터 ID
  const [generatingBackgroundCharacterId, setGeneratingBackgroundCharacterId] = useState<
    string | null
  >(null);

  // 음성 미리듣기 모달 상태
  const [voicePreviewModal, setVoicePreviewModal] = useState<{
    characterId: string;
    characterName: string;
    voiceId: string;
    voiceName: string;
    voiceSettings: VoiceSettings;
    audioBase64: string | null;
  } | null>(null);

  // 음성 생성 중인 캐릭터 ID
  const [generatingVoiceCharacterId, setGeneratingVoiceCharacterId] = useState<string | null>(null);

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
        voiceId: undefined,
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

  // 삭제 확인 대상 캐릭터 상태
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(null);

  // 삭제 확인 다이얼로그 열기
  const handleDeleteCharacter = (characterId: string) => {
    setCharacterToDelete(characterId);
  };

  // 삭제 확인
  const handleConfirmDeleteCharacter = () => {
    if (!characterToDelete) return;
    deleteCharacter(characterToDelete, {
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGES.CHARACTER_DELETED);
        setCharacterToDelete(null);
      },
      onError: () => {
        toast.error(ERROR_MESSAGES.CHARACTER_DELETE_FAILED);
      },
    });
  };

  // 삭제 취소
  const handleCancelDeleteCharacter = () => {
    setCharacterToDelete(null);
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
      voiceId: undefined,
    });
  };

  // 새 캐릭터 모달 닫기
  const handleCancelAddCharacter = () => {
    setIsAddingCharacter(false);
  };

  // 새 캐릭터 저장
  const handleSaveNewCharacter = async () => {
    if (
      !newCharacterData.name?.trim() ||
      !newCharacterData.role?.trim() ||
      !newCharacterData.description?.trim()
    ) {
      toast.error("이름, 역할, 설명은 필수입니다.");
      return;
    }

    try {
      await createCharacterAsync(newCharacterData);
      toast.success(SUCCESS_MESSAGES.CHARACTER_CREATED);
      setIsAddingCharacter(false);
    } catch {
      toast.error(ERROR_MESSAGES.CHARACTER_CREATE_FAILED);
    }
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
  const handleGenerateCharacters = async () => {
    if (!formState.title.trim() || !formState.description.trim() || !formState.summary.trim()) {
      toast.error("제목, 한줄 소개, 줄거리를 먼저 입력해주세요.");
      return;
    }

    try {
      const data = await generateCharactersMutateAsync({
        title: formState.title,
        description: formState.description,
        summary: formState.summary,
      });

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
        voiceId: undefined,
      }));

      setCharacters(newCharacters);
      toast.success(`${data.characters.length}명의 캐릭터가 생성되었습니다.`);
    } catch {
      toast.error("캐릭터 생성에 실패했습니다.");
    }
  };

  // ==========================================
  // 핸들러: AI 캐릭터 배경 이미지 생성
  // ==========================================
  const handleGenerateCharacterBackgroundImage = (char: {
    id: string;
    description: string;
    personality?: string | null;
  }) => {
    if (!char.description.trim()) {
      toast.error("설명을 먼저 입력해주세요.");
      return;
    }

    setGeneratingBackgroundCharacterId(char.id);

    generateBackgroundImageMutate(
      {
        description: char.description,
        personality: char.personality || "",
      },
      {
        onSuccess: (data) => {
          const backgroundImageDataUrl = `data:image/png;base64,${data.imageBase64}`;

          if (isEditMode) {
            // 편집 모드: 서버에 저장
            updateCharacter(
              { id: char.id, data: { backgroundImage: backgroundImageDataUrl } },
              {
                onSuccess: () => {
                  toast.success("배경 이미지가 저장되었습니다.");
                  setGeneratingBackgroundCharacterId(null);
                },
                onError: () => {
                  toast.error("배경 이미지 저장에 실패했습니다.");
                  setGeneratingBackgroundCharacterId(null);
                },
              },
            );
          } else {
            // 생성 모드: 로컬 상태 업데이트
            setCharacters(
              characters.map((c) =>
                c.id === char.id ? { ...c, backgroundImage: backgroundImageDataUrl } : c,
              ),
            );
            setGeneratingBackgroundCharacterId(null);
            toast.success("배경 이미지가 적용되었습니다.");
          }
        },
        onError: () => {
          toast.error("배경 이미지 생성에 실패했습니다.");
          setGeneratingBackgroundCharacterId(null);
        },
      },
    );
  };

  // ==========================================
  // 핸들러: AI 음성 생성 및 미리듣기
  // ==========================================
  const handleGenerateVoice = async (char: {
    id: string;
    name: string;
    description: string;
    personality?: string | null;
    firstMessage?: string | null;
  }) => {
    if (!char.description.trim()) {
      toast.error("설명을 먼저 입력해주세요.");
      return;
    }

    setGeneratingVoiceCharacterId(char.id);

    try {
      // 1. Voice ID 조회
      const voiceResult = await getVoiceIdMutateAsync({
        description: char.description,
        personality: char.personality || "",
      });

      // 2. 샘플 텍스트로 TTS 생성 (AI 추천 voiceSettings 적용)
      const sampleText = char.firstMessage || `안녕하세요, 저는 ${char.name}입니다.`;
      const ttsResult = await generateTTSSampleMutateAsync({
        voiceId: voiceResult.voiceId,
        text: sampleText,
        voiceSettings: voiceResult.voiceSettings,
      });

      // 3. 미리듣기 모달 열기
      setVoicePreviewModal({
        characterId: char.id,
        characterName: char.name,
        voiceId: voiceResult.voiceId,
        voiceName: voiceResult.voiceName,
        voiceSettings: voiceResult.voiceSettings,
        audioBase64: ttsResult.audioBase64,
      });
    } catch {
      toast.error("음성 생성에 실패했습니다.");
    } finally {
      setGeneratingVoiceCharacterId(null);
    }
  };

  const handleCloseVoicePreviewModal = () => {
    setVoicePreviewModal(null);
  };

  const handleConfirmVoice = () => {
    if (!voicePreviewModal) return;

    if (isEditMode) {
      // 편집 모드: 서버에 저장
      updateCharacter(
        {
          id: voicePreviewModal.characterId,
          data: {
            voiceId: voicePreviewModal.voiceId,
            voiceSettings: voicePreviewModal.voiceSettings,
          },
        },
        {
          onSuccess: () => {
            toast.success("음성이 저장되었습니다.");
            setVoicePreviewModal(null);
          },
          onError: () => {
            toast.error("음성 저장에 실패했습니다.");
          },
        },
      );
    } else {
      // 생성 모드: 로컬 상태 업데이트
      setCharacters(
        characters.map((c) =>
          c.id === voicePreviewModal.characterId
            ? {
                ...c,
                voiceId: voicePreviewModal.voiceId,
                voiceSettings: voicePreviewModal.voiceSettings,
              }
            : c,
        ),
      );
      setVoicePreviewModal(null);
      toast.success("음성이 적용되었습니다.");
    }
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
    isGeneratingBackgroundImage,
    generatingBackgroundCharacterId,
    imageModalCharacter,
    characterToDelete,
    // 음성 관련 상태
    voicePreviewModal,
    generatingVoiceCharacterId,
    isGettingVoiceId,
    isGeneratingTTSSample,

    // 핸들러
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
    // 음성 관련 핸들러
    handleGenerateVoice,
    handleCloseVoicePreviewModal,
    handleConfirmVoice,
  };
};
