export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 한글 커밋 메시지 허용 (대소문자 규칙 비활성화)
    "subject-case": [0],
    // 제목 50자 제한
    "header-max-length": [2, "always", 50],
  },
};
