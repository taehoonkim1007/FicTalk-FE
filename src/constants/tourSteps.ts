import type { Step } from "react-joyride";

/** 비인증 사용자용 투어 스텝 */
export const guestTourSteps: Step[] = [
  {
    target: '[data-tour="category-filter"]',
    title: "카테고리 탐색",
    content:
      "세계문학, 한국문학, 창작글 등 카테고리별로 다양한 스토리와 캐릭터를 탐색할 수 있어요.",
    placement: "bottom",
    isFixed: true,
  },
  {
    target: '[data-tour="hero-chat"]',
    title: "AI 캐릭터와 대화하기",
    content: "소설 속 캐릭터와 실시간으로 대화할 수 있어요. 버튼을 누르면 바로 채팅이 시작됩니다.",
    placement: "top",
  },
  {
    target: '[data-tour="category-tabs"]',
    title: "스토리 & 캐릭터 전환",
    content: "스토리와 캐릭터 탭을 전환하며 원하는 콘텐츠를 찾아보세요.",
    placement: "bottom",
  },
  {
    target: '[data-tour="login-button"]',
    title: "더 많은 기능을 사용하려면",
    content:
      "로그인하면 나만의 스토리 작성, 음성 대화 모드, 무제한 채팅 등 더 많은 기능을 사용할 수 있어요.",
    placement: "bottom",
    isFixed: true,
  },
  {
    target: '[data-tour="guide-restart"]',
    title: "가이드 다시보기",
    content: "언제든지 이 버튼을 눌러 가이드를 다시 볼 수 있어요.",
    placement: "bottom",
    isFixed: true,
  },
];

/** 채팅 페이지 게스트 투어 스텝 */
export const guestChatTourSteps: Step[] = [
  {
    target: '[data-tour="chat-character-limit"]',
    title: "캐릭터 제한",
    content: "게스트는 1명의 캐릭터와만 대화가 가능합니다.",
    placement: "left",
    isFixed: true,
  },
  {
    target: '[data-tour="chat-character-card"]',
    title: "대화 목록",
    content: "다른 캐릭터와 대화하려면, 현재 캐릭터를 제거한 후 새 캐릭터를 추가할 수 있어요.",
    placement: "left",
    isFixed: true,
  },
  {
    target: '[data-tour="chat-usage-limit"]',
    title: "대화 횟수 제한",
    content: "게스트는 3회의 대화만 지원합니다.",
    placement: "bottom",
    isFixed: true,
  },
  {
    target: '[data-tour="chat-input"]',
    title: "메시지 보내기",
    content: "원하는 캐릭터와 대화를 진행해보세요.",
    placement: "top",
  },
  {
    target: '[data-tour="chat-mode-toggle"]',
    title: "Text / Voice 모드",
    content:
      "텍스트와 음성 모드를 전환할 수 있어요. Voice 모드에서는 캐릭터의 대화 내용이 음성 지원됩니다.",
    placement: "bottom",
    isFixed: true,
  },
  {
    target: '[data-tour="chat-reset"]',
    title: "대화 초기화",
    content: "캐릭터와의 대화를 초기화하시고 싶다면 해당 버튼을 눌러 진행해주세요.",
    placement: "bottom",
    isFixed: true,
  },
  {
    target: '[data-tour="chat-guide-restart"]',
    title: "가이드 다시보기",
    content: "언제든지 이 버튼을 눌러 가이드를 다시 볼 수 있어요.",
    placement: "bottom",
    isFixed: true,
  },
];

/** 채팅 페이지 인증 사용자용 투어 스텝 (캐릭터 제한/카드/횟수 제한 제외) */
export const authChatTourSteps: Step[] = [
  {
    target: '[data-tour="chat-input"]',
    title: "메시지 보내기",
    content: "원하는 캐릭터와 대화를 진행해보세요.",
    placement: "top",
  },
  {
    target: '[data-tour="chat-mode-toggle"]',
    title: "Text / Voice 모드",
    content:
      "텍스트와 음성 모드를 전환할 수 있어요. Voice 모드에서는 캐릭터의 대화 내용이 음성 지원됩니다.",
    placement: "bottom",
    isFixed: true,
  },
  {
    target: '[data-tour="chat-reset"]',
    title: "대화 초기화",
    content: "캐릭터와의 대화를 초기화하시고 싶다면 해당 버튼을 눌러 진행해주세요.",
    placement: "bottom",
    isFixed: true,
  },
  {
    target: '[data-tour="chat-guide-restart"]',
    title: "가이드 다시보기",
    content: "언제든지 이 버튼을 눌러 가이드를 다시 볼 수 있어요.",
    placement: "bottom",
    isFixed: true,
  },
];

/** 인증 사용자용 투어 스텝 (로그인 후에만 사용 가능한 기능) */
export const authTourSteps: Step[] = [
  {
    target: '[data-tour="my-stories"]',
    title: "내 스토리",
    content: "나만의 스토리와 캐릭터를 직접 만들고 다른 사용자와 공유할 수 있어요.",
    placement: "bottom",
    isFixed: true,
  },
  {
    target: '[data-tour="my-chat"]',
    title: "내 대화",
    content: "진행 중인 채팅을 이어가거나 새로운 캐릭터와 대화를 시작해보세요.",
    placement: "bottom",
    isFixed: true,
  },
  {
    target: '[data-tour="guide-restart"]',
    title: "가이드 다시보기",
    content: "언제든지 이 버튼을 눌러 가이드를 다시 볼 수 있어요.",
    placement: "bottom",
    isFixed: true,
  },
];
