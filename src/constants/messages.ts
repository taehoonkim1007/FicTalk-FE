// ==========================================
// Success Messages
// ==========================================

export const SUCCESS_MESSAGES = {
  // Auth
  LOGOUT: "로그아웃 되었습니다.",

  // Story
  STORY_CREATED: "스토리가 작성되었습니다.",
  STORY_UPDATED: "스토리가 수정되었습니다.",
  STORY_DELETED: "스토리가 삭제되었습니다.",
} as const;

// ==========================================
// Error Messages
// ==========================================

export const ERROR_MESSAGES = {
  // Network & Server
  NETWORK_ERROR: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.",
  SERVER_ERROR: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  FORBIDDEN: "접근 권한이 없습니다.",
  NOT_FOUND: "요청한 리소스를 찾을 수 없습니다.",

  // Story
  STORY_CREATE_FAILED: "스토리 작성에 실패했습니다.",
  STORY_UPDATE_FAILED: "스토리 수정에 실패했습니다.",
  STORY_DELETE_FAILED: "스토리 삭제에 실패했습니다.",
} as const;
