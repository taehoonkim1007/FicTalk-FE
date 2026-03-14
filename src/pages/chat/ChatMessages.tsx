import { useCallback, useEffect, useRef, useState } from "react";

import { Loader2, Volume2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/image";
import { cn, getSubjectParticle } from "@/lib/utils";
import type { ChatCharacter, ChatMessage } from "@/types/chat";

import type { ChatMode } from "./ChatHeader";

interface ChatMessagesProps {
  messages: ChatMessage[];
  character: ChatCharacter;
  chatMode: ChatMode;
  isLoading: boolean;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  isSending: boolean;
  isTTSLoading: boolean;
  isAudioPlaying: boolean;
}

interface BgPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const ChatMessages = ({
  messages,
  character,
  chatMode,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  isSending,
  isTTSLoading,
  isAudioPlaying,
}: ChatMessagesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [bgPosition, setBgPosition] = useState<BgPosition | null>(null);

  // 배경 위치 계산
  const updateBgPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    setBgPosition({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  }, []);

  // 초기 및 리사이즈 시 배경 위치 업데이트
  useEffect(() => {
    if (!isLoading) {
      // DOM 렌더링 후 다음 프레임에서 위치 계산
      requestAnimationFrame(updateBgPosition);
    }
    window.addEventListener("resize", updateBgPosition);
    return () => window.removeEventListener("resize", updateBgPosition);
  }, [updateBgPosition, isLoading]);

  // 새 메시지 시 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // 상단 스크롤 시 이전 메시지 로드
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    if (container.scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  // 메시지 순서 반전 (최신이 아래)
  const orderedMessages = [...messages].reverse();

  // 배경 이미지: story.backgroundImage 우선, 없으면 character.backgroundImage
  const backgroundImage = character.story.backgroundImage || character.backgroundImage;

  return (
    <div
      ref={containerRef}
      className="no-scrollbar relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
      onScroll={handleScroll}
    >
      {/* 중앙 배경 이미지 */}
      {backgroundImage && bgPosition && (
        <div
          className="pointer-events-none fixed z-0 flex items-center justify-center p-4"
          style={{
            top: bgPosition.top,
            left: bgPosition.left,
            width: bgPosition.width,
            height: bgPosition.height,
          }}
        >
          <img
            src={getImageUrl(backgroundImage) || ""}
            alt=""
            className="max-h-full max-w-full rounded-2xl object-contain opacity-20"
          />
        </div>
      )}

      {/* 메시지 컨테이너 */}
      <div className="relative z-10 px-4 py-6">
        {/* 이전 메시지 로딩 인디케이터 */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-stone-500" />
          </div>
        )}

        {/* 시스템 안내 메시지 */}
        {character.firstMessage && (
          <div className="mb-6 flex justify-center">
            <div
              className={cn(
                "rounded-full border px-4 py-2 text-xs shadow-sm backdrop-blur transition-colors",
                chatMode === "voice"
                  ? "border-violet-500/30 bg-violet-900/20 text-violet-300"
                  : "border-stone-800 bg-stone-900/80 text-stone-400",
              )}
            >
              <span
                className={cn(
                  "font-bold",
                  chatMode === "voice" ? "text-violet-400" : "text-emerald-500",
                )}
              >
                FicTalk AI
              </span>
              가 캐릭터를 완벽하게 재현합니다
            </div>
          </div>
        )}

        {/* 첫 인사말 (항상 표시) */}
        {character.firstMessage && (
          <MessageBubble
            role="assistant"
            content={character.firstMessage}
            character={character}
            chatMode={chatMode}
          />
        )}

        {/* 메시지 목록 */}
        {orderedMessages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
            character={character}
            chatMode={chatMode}
          />
        ))}

        {/* AI 응답 대기 중 표시 */}
        {isSending && (
          <div className="mb-4 flex gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              {character.profileImage && (
                <AvatarImage src={getImageUrl(character.profileImage) || ""} alt={character.name} />
              )}
              <AvatarFallback className={`${character.imageColor} text-sm text-white`}>
                {character.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 rounded-2xl bg-stone-800 px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-stone-400" />
              <span className="text-sm text-stone-400">
                {character.name}
                {getSubjectParticle(character.name)} 생각중...
              </span>
            </div>
          </div>
        )}

        {/* TTS 재생 상태 표시 */}
        {chatMode === "voice" && (isTTSLoading || isAudioPlaying) && (
          <div className="mb-4 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-violet-500/50 bg-stone-900 px-4 py-2">
              {isTTSLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
              ) : (
                <Volume2 className="h-4 w-4 animate-pulse text-violet-500" />
              )}
              <span className="text-xs text-stone-400">
                {isTTSLoading ? "음성 생성 중..." : "재생 중..."}
              </span>
            </div>
          </div>
        )}

        {/* 스크롤 앵커 */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

/** 개별 메시지 버블 */
interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  character: ChatCharacter;
  chatMode: ChatMode;
}

const MessageBubble = ({ role, content, character, chatMode }: MessageBubbleProps) => {
  const isUser = role === "user";

  return (
    <div className={`mb-6 flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* AI 메시지일 때만 아바타 표시 */}
      {!isUser && (
        <Avatar className="h-12 w-12 shrink-0">
          {character.profileImage && (
            <AvatarImage src={getImageUrl(character.profileImage) || ""} alt={character.name} />
          )}
          <AvatarFallback className={`${character.imageColor} text-base text-white`}>
            {character.name[0]}
          </AvatarFallback>
        </Avatar>
      )}

      {/* 메시지 내용 */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3",
          isUser
            ? chatMode === "voice"
              ? "bg-violet-500 text-white"
              : "bg-emerald-500 text-black"
            : "bg-stone-800 text-stone-200",
        )}
      >
        <p className="text-sm break-words whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};
