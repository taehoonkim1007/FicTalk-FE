import { describe, expect, it } from "vitest";

import { cn, getParticle, getSubjectParticle } from "./utils";

describe("cn", () => {
  it("단일 클래스를 반환한다", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  it("여러 클래스를 병합한다", () => {
    expect(cn("p-4", "m-2")).toBe("p-4 m-2");
  });

  it("충돌하는 Tailwind 클래스를 후자로 덮어쓴다", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("조건부 클래스를 처리한다", () => {
    const isFalse = false;
    const isTrue = true;
    expect(cn("base", isFalse && "hidden", isTrue && "visible")).toBe("base visible");
  });

  it("배열 형태의 클래스를 처리한다", () => {
    expect(cn(["p-4", "m-2"])).toBe("p-4 m-2");
  });

  it("빈 입력을 처리한다", () => {
    expect(cn()).toBe("");
    expect(cn("", null, undefined)).toBe("");
  });
});

describe("getParticle (와/과)", () => {
  it("받침이 없는 한글은 '와'를 반환한다", () => {
    expect(getParticle("사과")).toBe("와");
    expect(getParticle("바나나")).toBe("와");
    expect(getParticle("커피")).toBe("와");
  });

  it("받침이 있는 한글은 '과'를 반환한다", () => {
    expect(getParticle("사람")).toBe("과");
    expect(getParticle("책")).toBe("과");
    expect(getParticle("밥")).toBe("과");
  });

  it("빈 문자열은 '와'를 반환한다", () => {
    expect(getParticle("")).toBe("와");
  });

  it("영문은 '와'를 반환한다", () => {
    expect(getParticle("Apple")).toBe("와");
    expect(getParticle("test")).toBe("와");
  });

  it("숫자는 '와'를 반환한다", () => {
    expect(getParticle("123")).toBe("와");
  });
});

describe("getSubjectParticle (이/가)", () => {
  it("받침이 없는 한글은 '가'를 반환한다", () => {
    expect(getSubjectParticle("나")).toBe("가");
    expect(getSubjectParticle("고양이")).toBe("가");
    expect(getSubjectParticle("너")).toBe("가");
  });

  it("받침이 있는 한글은 '이'를 반환한다", () => {
    expect(getSubjectParticle("책")).toBe("이");
    expect(getSubjectParticle("사람")).toBe("이");
    expect(getSubjectParticle("밥")).toBe("이");
  });

  it("빈 문자열은 '가'를 반환한다", () => {
    expect(getSubjectParticle("")).toBe("가");
  });

  it("영문은 '가'를 반환한다", () => {
    expect(getSubjectParticle("Apple")).toBe("가");
    expect(getSubjectParticle("test")).toBe("가");
  });

  it("숫자는 '가'를 반환한다", () => {
    expect(getSubjectParticle("123")).toBe("가");
  });
});
