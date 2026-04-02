// ==========================================
// Success Messages
// ==========================================

export const SUCCESS_MESSAGES = {
  // Auth
  LOGOUT: "로그아웃 되었습니다.",
  ACCOUNT_DELETED: "회원탈퇴가 완료되었습니다.",

  // Story
  STORY_CREATED: "스토리가 작성되었습니다.",
  STORY_UPDATED: "스토리가 수정되었습니다.",
  STORY_DELETED: "스토리가 삭제되었습니다.",
  SUMMARY_GENERATED: "줄거리가 생성되었습니다.",

  // Character
  CHARACTER_CREATED: "캐릭터가 추가되었습니다.",
  CHARACTER_UPDATED: "캐릭터가 수정되었습니다.",
  CHARACTER_DELETED: "캐릭터가 삭제되었습니다.",

  // Image
  COVER_IMAGE_GENERATED: "커버 이미지가 생성되었습니다.",
  BACKGROUND_IMAGE_GENERATED: "배경 이미지가 생성되었습니다.",
  PROFILE_IMAGE_SAVED: "프로필 이미지가 저장되었습니다.",
  PROFILE_IMAGE_APPLIED: "프로필 이미지가 적용되었습니다.",
  BACKGROUND_IMAGE_SAVED: "배경 이미지가 저장되었습니다.",
  BACKGROUND_IMAGE_APPLIED: "배경 이미지가 적용되었습니다.",
  IMAGE_GENERATED: "이미지가 생성되었습니다.",

  // Voice
  VOICE_SAVED: "음성이 저장되었습니다.",
  VOICE_APPLIED: "음성이 적용되었습니다.",

  // Chat
  CHARACTER_REMOVED: "캐릭터가 제거되었습니다.",
  CHAT_RESET: "대화가 초기화되었습니다.",
} as const;

// ==========================================
// Error Messages
// ==========================================

export const ERROR_MESSAGES = {
  // Network & Server
  NETWORK_ERROR: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.",
  SERVER_ERROR: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  FORBIDDEN: "접근 권한이 없습니다.",
  GUEST_USAGE_LIMIT: "게스트 사용 횟수를 초과했습니다. 로그인해주세요.",
  GUEST_CHARACTER_LIMIT: "게스트는 캐릭터를 1개만 추가할 수 있습니다.",
  NOT_FOUND: "요청한 리소스를 찾을 수 없습니다.",

  // Auth
  GUEST_SESSION_FAILED: "게스트 세션 생성에 실패했습니다.",
  ACCOUNT_DELETE_FAILED: "회원탈퇴에 실패했습니다.",

  // Story
  STORY_CREATE_FAILED: "스토리 작성에 실패했습니다.",
  STORY_UPDATE_FAILED: "스토리 수정에 실패했습니다.",
  STORY_DELETE_FAILED: "스토리 삭제에 실패했습니다.",
  SUMMARY_GENERATE_FAILED: "줄거리 생성에 실패했습니다.",

  // Character
  CHARACTER_CREATE_FAILED: "캐릭터 추가에 실패했습니다.",
  CHARACTER_UPDATE_FAILED: "캐릭터 수정에 실패했습니다.",
  CHARACTER_DELETE_FAILED: "캐릭터 삭제에 실패했습니다.",
  CHARACTER_GENERATE_FAILED: "캐릭터 생성에 실패했습니다.",

  // Image
  COVER_IMAGE_FAILED: "커버 이미지 생성에 실패했습니다.",
  BACKGROUND_IMAGE_FAILED: "배경 이미지 생성에 실패했습니다.",
  PROFILE_IMAGE_SAVE_FAILED: "프로필 이미지 저장에 실패했습니다.",
  BACKGROUND_IMAGE_SAVE_FAILED: "배경 이미지 저장에 실패했습니다.",
  IMAGE_GENERATE_FAILED: "이미지 생성에 실패했습니다. 다시 시도해주세요.",

  // Voice
  VOICE_GENERATE_FAILED: "음성 생성에 실패했습니다.",
  VOICE_SAVE_FAILED: "음성 저장에 실패했습니다.",

  // Chat
  CHAT_ACCESS_DENIED: "대화하기 버튼을 통해 접근해주세요.",
  CHARACTER_REMOVE_FAILED: "캐릭터 제거에 실패했습니다.",
  CHAT_RESET_FAILED: "대화 초기화에 실패했습니다.",

  // Validation
  STORY_FIELDS_REQUIRED: "제목, 한줄 소개, 줄거리를 먼저 입력해주세요.",
  STORY_BASIC_FIELDS_REQUIRED: "제목과 한줄 소개를 먼저 입력해주세요.",
  CHARACTER_FIELDS_REQUIRED: "이름, 역할, 설명은 필수입니다.",
  DESCRIPTION_REQUIRED: "설명을 먼저 입력해주세요.",
  CHARACTER_DESCRIPTION_REQUIRED: "캐릭터 설명을 입력해주세요.",
  CHARACTER_PERSONALITY_REQUIRED: "캐릭터 성격을 입력해주세요.",
} as const;
