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
  // ==========================================
  // 로컬 상태
  // ==========================================
  // 생성 모드: 캐릭터 로컬 상태
  const [characters, setCharacters] = useState<(CreateCharacterRequest & { id: string })[]>([]);
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
  // 삭제 확인 대상 캐릭터
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(null);
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
  // 서버 상태 (React Query)
  // ==========================================
  const { data: charactersData } = useStoryCharacters(storyId, isEditMode);
  const existingCharacters = charactersData?.characters ?? initialCharacters;

  const { mutateAsync: createCharacterAsync, isPending: isCreatingCharacter } =
    useCreateCharacter(storyId);
  const { mutate: updateCharacter, isPending: isUpdatingCharacter } = useUpdateCharacter(storyId);
  const { mutate: deleteCharacter, isPending: isDeletingCharacter } = useDeleteCharacter(storyId);
  const { mutateAsync: generateCharactersMutateAsync, isPending: isGeneratingCharacters } =
    useGenerateCharacters();
  const { mutateAsync: getVoiceIdMutateAsync, isPending: isGettingVoiceId } = useGetVoiceId();
  const { mutateAsync: generateTTSSampleMutateAsync, isPending: isGeneratingTTSSample } =
    useGenerateTTSSample();
  const { mutate: generateBackgroundImageMutate, isPending: isGeneratingBackgroundImage } =
    useGenerateCharacterBackgroundImage();

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
      toast.error(ERROR_MESSAGES.CHARACTER_FIELDS_REQUIRED);
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
      toast.error(ERROR_MESSAGES.CHARACTER_FIELDS_REQUIRED);
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
  // 이미지 모달 열기
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

  // 이미지 모달 닫기
  const handleCloseImageModal = () => {
    setImageModalCharacter(null);
  };

  // 이미지 확인 (저장/적용)
  const handleConfirmImage = (imageBase64: string) => {
    if (!imageModalCharacter) return;

    const profileImageDataUrl = `data:image/png;base64,${imageBase64}`;

    if (isEditMode) {
      // 편집 모드: 서버에 저장
      updateCharacter(
        { id: imageModalCharacter.id, data: { profileImage: profileImageDataUrl } },
        {
          onSuccess: () => {
            toast.success(SUCCESS_MESSAGES.PROFILE_IMAGE_SAVED);
            setImageModalCharacter(null);
          },
          onError: () => {
            toast.error(ERROR_MESSAGES.PROFILE_IMAGE_SAVE_FAILED);
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
      toast.success(SUCCESS_MESSAGES.PROFILE_IMAGE_APPLIED);
    }
  };

  // ==========================================
  // 핸들러: AI 캐릭터 생성
  // ==========================================
  const handleGenerateCharacters = async () => {
    if (!formState.title.trim() || !formState.description.trim() || !formState.summary.trim()) {
      toast.error(ERROR_MESSAGES.STORY_FIELDS_REQUIRED);
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
      toast.error(ERROR_MESSAGES.CHARACTER_GENERATE_FAILED);
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
      toast.error(ERROR_MESSAGES.DESCRIPTION_REQUIRED);
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
                  toast.success(SUCCESS_MESSAGES.BACKGROUND_IMAGE_SAVED);
                  setGeneratingBackgroundCharacterId(null);
                },
                onError: () => {
                  toast.error(ERROR_MESSAGES.BACKGROUND_IMAGE_SAVE_FAILED);
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
            toast.success(SUCCESS_MESSAGES.BACKGROUND_IMAGE_APPLIED);
          }
        },
        onError: () => {
          toast.error(ERROR_MESSAGES.BACKGROUND_IMAGE_FAILED);
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
      toast.error(ERROR_MESSAGES.DESCRIPTION_REQUIRED);
      return;
    }
    if (!char.personality?.trim()) {
      toast.error(ERROR_MESSAGES.CHARACTER_PERSONALITY_REQUIRED);
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
      toast.error(ERROR_MESSAGES.VOICE_GENERATE_FAILED);
    } finally {
      setGeneratingVoiceCharacterId(null);
    }
  };

  // 음성 미리듣기 모달 닫기
  const handleCloseVoicePreviewModal = () => {
    setVoicePreviewModal(null);
  };

  // 음성 확인 (저장/적용)
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
            toast.success(SUCCESS_MESSAGES.VOICE_SAVED);
            setVoicePreviewModal(null);
          },
          onError: () => {
            toast.error(ERROR_MESSAGES.VOICE_SAVE_FAILED);
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
      toast.success(SUCCESS_MESSAGES.VOICE_APPLIED);
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
