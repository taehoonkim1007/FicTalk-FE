import { useCallback, useEffect, useMemo, useState } from "react";
import { EVENTS, Joyride, STATUS } from "react-joyride";
import type { EventData, Step } from "react-joyride";
import { useLocation } from "react-router-dom";

import { authTourSteps, guestTourSteps } from "@/constants/tourSteps";
import { useAuthStore } from "@/stores/useAuthStore";

import { TourTooltip } from "./TourTooltip";

const TOUR_STORAGE_PREFIX = "fictalk-tour-completed";

/** 게스트/유저별 스토리지 키 생성 */
const getTourStorageKey = (userId?: string) =>
  userId ? `${TOUR_STORAGE_PREFIX}:user:${userId}` : `${TOUR_STORAGE_PREFIX}:guest`;

/** DOM에 타겟이 존재하는 스텝만 필터링 */
const filterAvailableSteps = (steps: Step[]): Step[] =>
  steps.filter((step) => {
    if (typeof step.target === "string") {
      return document.querySelector(step.target) !== null;
    }
    return true;
  });

export const GuideTour = () => {
  const location = useLocation();
  const { accessToken, user } = useAuthStore();
  const isGuest = !accessToken || user?.role === "guest";
  const isHomePage = location.pathname === "/";

  const storageKey = getTourStorageKey(isGuest ? undefined : user?.id);

  const [run, setRun] = useState(false);
  const [availableSteps, setAvailableSteps] = useState<Step[]>([]);

  const allSteps = useMemo(() => (isGuest ? guestTourSteps : authTourSteps), [isGuest]);

  // 홈페이지 진입 시 첫 방문 여부 확인 후 투어 시작
  useEffect(() => {
    if (!isHomePage) return;

    const hasCompleted = localStorage.getItem(storageKey);
    if (hasCompleted) return;

    const timer = setTimeout(() => {
      const filtered = filterAvailableSteps(allSteps);
      if (filtered.length > 0) {
        setAvailableSteps(filtered);
        setRun(true);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [isHomePage, allSteps, storageKey]);

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

  // 외부에서 투어 재시작 (Header에서 호출) — early return 전에 등록해야 항상 동작
  const restartTour = useCallback(() => {
    const filtered = filterAvailableSteps(allSteps);
    if (filtered.length > 0) {
      setAvailableSteps(filtered);
      setRun(true);
    }
  }, [allSteps]);

  useEffect(() => {
    const handler = () => restartTour();
    window.addEventListener("fictalk:restart-tour", handler);
    return () => window.removeEventListener("fictalk:restart-tour", handler);
  }, [restartTour]);

  if (!isHomePage || availableSteps.length === 0) return null;

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
        scrollOffset: 130,
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
