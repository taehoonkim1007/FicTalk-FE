import { useEffect, useRef, useState } from "react";

import { Loader2, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ChatMode } from "./ChatHeader";

interface ChatInputProps {
  onSend: (content: string) => void;
  isSending: boolean;
  isError: boolean;
  chatMode: ChatMode;
}

export const ChatInput = ({ onSend, isSending, isError, chatMode }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSentMessage = useRef<string>("");

  // 메시지 변경 시 textarea 높이 자동 조절
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  // 에러 발생 시 메시지 복원
  useEffect(() => {
    if (isError && lastSentMessage.current) {
      setMessage(lastSentMessage.current);
      lastSentMessage.current = "";
    }
  }, [isError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    lastSentMessage.current = trimmed; // 전송 전 저장
    onSend(trimmed);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift+Enter는 줄바꿈, Enter만 누르면 전송
    // 한글 IME 조합 중에는 전송하지 않음 (isComposing 체크)
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-stone-950 p-2 md:p-4">
      <div className="mx-auto flex max-w-4xl items-end gap-3 rounded-2xl bg-stone-800 p-2 md:p-3">
        {/* 메시지 입력 */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지 보내기"
          rows={1}
          disabled={isSending}
          className="flex-1 resize-none border-0 bg-transparent px-1 py-2 text-white placeholder:text-stone-500 focus:ring-0 focus:outline-none disabled:opacity-50"
          style={{ maxHeight: "200px" }}
        />

        {/* 전송 버튼 */}
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isSending}
          className={cn(
            "h-9 w-9 shrink-0 rounded-full text-black disabled:opacity-50",
            chatMode === "voice"
              ? "bg-violet-500 hover:bg-violet-400"
              : "bg-emerald-500 hover:bg-emerald-400",
          )}
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4 fill-current" />
          )}
        </Button>
      </div>

      {/* 에러 메시지 */}
      {isError && (
        <p className="mx-auto mt-2 max-w-4xl text-sm text-red-400">
          메시지 전송에 실패했습니다. 다시 시도해주세요.
        </p>
      )}
    </form>
  );
};
