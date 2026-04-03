import { useCallback, useEffect, useState } from "react";
import { EVENTS, Joyride, STATUS } from "react-joyride";
import type { EventData, Step } from "react-joyride";

import { authChatTourSteps, guestChatTourSteps } from "@/constants/tourSteps";
import { useAuthStore } from "@/stores/useAuthStore";

import { TourTooltip } from "./TourTooltip";

const TOUR_STORAGE_PREFIX = "fictalk-tour-completed:chat";

/** 게스트/유저별 스토리지 키 */
const getChatTourKey = (isGuest: boolean, userId?: string) =>
  isGuest ? `${TOUR_STORAGE_PREFIX}:guest` : `${TOUR_STORAGE_PREFIX}:user:${userId}`;

/** 게스트/유저별 투어 스텝 */
const getChatTourSteps = (isGuest: boolean) => (isGuest ? guestChatTourSteps : authChatTourSteps);

/** DOM에 타겟이 존재하는 스텝만 필터링 */
const filterAvailableSteps = (steps: Step[]): Step[] =>
  steps.filter((step) => {
    if (typeof step.target === "string") {
      return document.querySelector(step.target) !== null;
    }
    return true;
  });

export const ChatGuideTour = () => {
  const { accessToken, user } = useAuthStore();
  const isGuest = !accessToken || user?.role === "guest";
  const storageKey = getChatTourKey(isGuest, user?.id);
  const tourSteps = getChatTourSteps(isGuest);

  const [run, setRun] = useState(false);
  const [availableSteps, setAvailableSteps] = useState<Step[]>([]);

  // 채팅 페이지 첫 진입 시 투어 자동 시작
  useEffect(() => {
    const hasCompleted = localStorage.getItem(storageKey);
    if (hasCompleted) return;

    const timer = setTimeout(() => {
      const filtered = filterAvailableSteps(tourSteps);
      if (filtered.length > 0) {
        setAvailableSteps(filtered);
        setRun(true);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [storageKey, tourSteps]);

  // 투어 이벤트 핸들러
  const handleEvent = useCallback(
    (data: EventData) => {
      const { status, type } = data;

      if (type === EVENTS.TOUR_END) {
        setRun(false);

        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
          localStorage.setItem(storageKey, "true");
        }
      }
    },
    [storageKey],
  );

  // 외부에서 투어 재시작
  const restartTour = useCallback(() => {
    const filtered = filterAvailableSteps(tourSteps);
    if (filtered.length > 0) {
      setAvailableSteps(filtered);
      setRun(true);
    }
  }, [tourSteps]);

  useEffect(() => {
    const handler = () => restartTour();
    window.addEventListener("fictalk:restart-chat-tour", handler);
    return () => window.removeEventListener("fictalk:restart-chat-tour", handler);
  }, [restartTour]);

  if (availableSteps.length === 0) return null;

  return (
    <Joyride
      continuous
      run={run}
      steps={availableSteps}
      scrollToFirstStep
      onEvent={handleEvent}
      tooltipComponent={TourTooltip}
      options={{
        skipBeacon: true,
        scrollOffset: 80,
        overlayColor: "rgba(0, 0, 0, 0.75)",
        zIndex: 1000,
      }}
      floatingOptions={{
        hideArrow: true,
        strategy: "fixed",
      }}
    />
  );
};
