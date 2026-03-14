import { useCallback, useRef, useState } from "react";

export const useAudioPlayer = () => {
  // ==========================================
  // 로컬 상태
  // ==========================================
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // Refs
  // ==========================================
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ==========================================
  // 핸들러
  // ==========================================
  // 오디오 재생
  const playAudio = useCallback((base64Audio: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setIsLoading(true);

    const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
    audioRef.current = audio;

    audio.oncanplaythrough = () => setIsLoading(false);
    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.play().catch(() => {
      setIsPlaying(false);
      setIsLoading(false);
    });
  }, []);

  // 오디오 정지
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, []);

  return { playAudio, stopAudio, isPlaying, isLoading };
};
