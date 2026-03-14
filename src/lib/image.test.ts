import { describe, expect, it } from "vitest";

import { getImageUrl } from "./image";

describe("getImageUrl", () => {
  it("상대 경로에 base URL을 붙여 반환한다", () => {
    const result = getImageUrl("/images/test.png");
    expect(result).toContain("/images/test.png");
  });

  it("http로 시작하는 URL은 그대로 반환한다", () => {
    expect(getImageUrl("http://example.com/image.png")).toBe("http://example.com/image.png");
    expect(getImageUrl("https://example.com/image.png")).toBe("https://example.com/image.png");
  });

  it("data: URL은 그대로 반환한다", () => {
    const dataUrl = "data:image/png;base64,iVBORw0KGgo=";
    expect(getImageUrl(dataUrl)).toBe(dataUrl);
  });

  it("null은 undefined를 반환한다", () => {
    expect(getImageUrl(null)).toBeUndefined();
  });

  it("undefined는 undefined를 반환한다", () => {
    expect(getImageUrl(undefined)).toBeUndefined();
  });

  it("빈 문자열은 undefined를 반환한다", () => {
    expect(getImageUrl("")).toBeUndefined();
  });
});
