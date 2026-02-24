import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ArrowLeft, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";

import { generateTTSSample } from "@/api/stories";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import {
  useAddChatCharacter,
  useChatCharacters,
  useChatMessages,
  useRemoveChatCharacter,
  useResetMessages,
  useSendMessage,
} from "@/queries/useChatQueries";
import type { ChatCharacter } from "@/types/chat";

import { CharacterSelectModal } from "./CharacterSelectModal";
import { ChatHeader, type ChatMode } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { ChatSidebar } from "./ChatSidebar";

interface LocationState {
  characterId?: string;
}

export const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  // 선택된 캐릭터
  const [selectedCharacter, setSelectedCharacter] = useState<ChatCharacter | null>(null);
  // 캐릭터 추가 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 이미 처리한 characterId 추적 (중복 추가 방지)
  const [processedCharacterId, setProcessedCharacterId] = useState<string | null>(null);
  // 채팅 모드 (text/voice)
  const [chatMode, setChatMode] = useState<ChatMode>("text");
  // 모바일 사이드바 토글
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 오디오 플레이어
  const { playAudio, isPlaying: isAudioPlaying, isLoading: isTTSLoading } = useAudioPlayer();

  // 채팅 캐릭터 목록 조회
  const { data: charactersData, isLoading: isCharactersLoading, isFetching } = useChatCharacters();
  const characters = useMemo(() => charactersData?.characters || [], [charactersData?.characters]);

  // 캐릭터 추가/제거
  const addCharacter = useAddChatCharacter();
  const removeCharacter = useRemoveChatCharacter();

  // 메시지 관련
  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatMessages(selectedCharacter?.id || "", !!selectedCharacter);

  const sendMessage = useSendMessage(selectedCharacter?.id || "");
  const resetMessages = useResetMessages(selectedCharacter?.id || "");

  // location.state로 전달된 characterId가 있으면 자동 추가
  useEffect(() => {
    // 이미 처리했거나 처리할 characterId가 없으면 스킵
    if (!state?.characterId || state.characterId === processedCharacterId) {
      return;
    }

    if (!isCharactersLoading) {
      const exists = characters.find((c) => c.id === state.characterId);
      if (!exists) {
        // 캐릭터가 없으면 추가
        addCharacter.mutate(
          { characterId: state.characterId },
          {
            onSuccess: (newCharacter) => {
              setSelectedCharacter(newCharacter);
              toast.success(`${newCharacter.name}와의 대화가 시작되었습니다.`);
            },
            onError: () => {
              toast.error("캐릭터 추가에 실패했습니다.");
            },
          },
        );
      } else {
        // 이미 있으면 선택 (비동기로 처리하여 cascading render 방지)
        queueMicrotask(() => setSelectedCharacter(exists));
      }
      // 처리 완료 표시 (비동기로 처리)
      queueMicrotask(() => setProcessedCharacterId(state.characterId ?? null));
      window.history.replaceState({}, document.title);
    }
  }, [state?.characterId, characters, isCharactersLoading, processedCharacterId, addCharacter]);

  // 선택된 캐릭터가 목록에 없으면 초기화, 있으면 최신 데이터로 갱신
  useEffect(() => {
    // 캐릭터 목록을 가져오는 중이면 스킵 (레이스 컨디션 방지)
    if (isFetching) return;

    if (selectedCharacter) {
      // 선택된 캐릭터가 목록에 있는지 확인
      const exists = characters.find((c) => c.id === selectedCharacter.id);
      if (!exists) {
        // 목록에 없으면 첫 번째 캐릭터 선택 또는 null (비동기로 처리)
        queueMicrotask(() => setSelectedCharacter(characters[0] || null));
      } else if (exists !== selectedCharacter) {
        // 목록에 있으면 최신 데이터로 갱신 (voiceId 등 새로운 필드 반영)
        queueMicrotask(() => setSelectedCharacter(exists));
      }
    } else if (characters.length > 0) {
      // 선택된 캐릭터가 없고 목록이 있으면 첫 번째 선택 (비동기로 처리)
      queueMicrotask(() => setSelectedCharacter(characters[0]));
    }
  }, [characters, selectedCharacter, isFetching]);

  // 캐릭터 선택
  const handleSelectCharacter = (character: ChatCharacter) => {
    setSelectedCharacter(character);
  };

  // 캐릭터 추가
  const handleAddCharacter = (characterId: string) => {
    addCharacter.mutate(
      { characterId },
      {
        onSuccess: (newCharacter) => {
          setSelectedCharacter(newCharacter);
          setIsModalOpen(false);
          toast.success(`${newCharacter.name}가 추가되었습니다.`);
        },
        onError: () => {
          toast.error("캐릭터 추가에 실패했습니다.");
        },
      },
    );
  };

  // 캐릭터 제거
  const handleRemoveCharacter = (characterId: string) => {
    removeCharacter.mutate(characterId, {
      onSuccess: () => {
        if (selectedCharacter?.id === characterId) {
          const remaining = characters.filter((c) => c.id !== characterId);
          setSelectedCharacter(remaining[0] || null);
        }
        toast.success("캐릭터가 제거되었습니다.");
      },
      onError: () => {
        toast.error("캐릭터 제거에 실패했습니다.");
      },
    });
  };

  // 메시지 전송
  const handleSendMessage = (content: string) => {
    sendMessage.mutate(
      { content },
      {
        onSuccess: (response) => {
          // Voice 모드일 때 AI 응답 TTS 재생
          if (chatMode === "voice" && selectedCharacter?.voiceId) {
            generateTTSSample({
              voiceId: selectedCharacter.voiceId,
              text: response.aiMessage.content,
              voiceSettings: selectedCharacter.voiceSettings || undefined,
            })
              .then((ttsResponse) => {
                playAudio(ttsResponse.audioBase64);
              })
              .catch(() => {
                // TTS 실패 시 조용히 처리
              });
          }
        },
      },
    );
  };

  // 대화 초기화
  const handleResetMessages = () => {
    if (!selectedCharacter) return;

    resetMessages.mutate(undefined, {
      onSuccess: () => {
        toast.success("대화가 초기화되었습니다.");
      },
      onError: () => {
        toast.error("대화 초기화에 실패했습니다.");
      },
    });
  };

  // 뒤로가기
  const handleBack = () => {
    void navigate(-1);
  };

  // 로딩 상태
  if (isCharactersLoading) {
    return <LoadingState message="대화방을 불러오는 중..." />;
  }

  // 메시지 평탄화
  const messages = messagesData?.pages.flatMap((page) => page.messages) || [];

  return (
    <div className="mx-auto flex h-screen w-full max-w-7xl overflow-hidden bg-stone-950">
      {/* 채팅 영역 */}
      <div className="flex flex-1 flex-col">
        {selectedCharacter ? (
          <>
            {/* 헤더 */}
            <ChatHeader
              character={selectedCharacter}
              chatMode={chatMode}
              onModeChange={setChatMode}
              onBack={handleBack}
              onReset={handleResetMessages}
              isResetting={resetMessages.isPending}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* 메시지 */}
            <ChatMessages
              messages={messages}
              character={selectedCharacter}
              chatMode={chatMode}
              isLoading={isMessagesLoading}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onLoadMore={() => void fetchNextPage()}
              isSending={sendMessage.isPending}
              isTTSLoading={isTTSLoading}
              isAudioPlaying={isAudioPlaying}
            />

            {/* 입력창 */}
            <ChatInput
              onSend={handleSendMessage}
              isSending={sendMessage.isPending}
              isError={sendMessage.isError}
              chatMode={chatMode}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col">
            {/* 빈 상태 헤더 */}
            <header className="flex h-16 items-center border-b border-stone-800 bg-stone-900 px-4 md:h-24">
              <Button variant="ghost" size="icon" onClick={handleBack} className="text-stone-400">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </header>

            <div className="flex flex-1 items-center justify-center">
              <EmptyState
                icon={<MessageSquarePlus className="h-12 w-12 text-stone-600" />}
                title="대화 상대를 선택하세요"
                description="우측에서 캐릭터를 선택하거나 새로운 대화 상대를 추가하세요"
                action={
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                    대화 상대 추가
                  </Button>
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* 데스크탑 사이드바 */}
      <div className="hidden md:block">
        <ChatSidebar
          characters={characters}
          selectedCharacterId={selectedCharacter?.id || null}
          onSelectCharacter={handleSelectCharacter}
          onRemoveCharacter={handleRemoveCharacter}
          onAddCharacter={() => setIsModalOpen(true)}
          isRemoving={removeCharacter.isPending}
        />
      </div>

      {/* 모바일 사이드바 오버레이 */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-[80vw] max-w-[22rem]">
            <ChatSidebar
              characters={characters}
              selectedCharacterId={selectedCharacter?.id || null}
              onSelectCharacter={(character) => {
                handleSelectCharacter(character);
                setIsSidebarOpen(false);
              }}
              onRemoveCharacter={handleRemoveCharacter}
              onAddCharacter={() => {
                setIsModalOpen(true);
                setIsSidebarOpen(false);
              }}
              isRemoving={removeCharacter.isPending}
            />
          </div>
        </div>
      )}

      {/* 캐릭터 선택 모달 */}
      <CharacterSelectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSelect={handleAddCharacter}
        isAdding={addCharacter.isPending}
        existingCharacterIds={characters.map((c) => c.id)}
      />
    </div>
  );
};
