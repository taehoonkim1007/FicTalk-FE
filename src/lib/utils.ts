import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/** 주격 조사 (와/과) 반환 */
export const getParticle = (name: string): string => {
  if (!name) return "와";
  const lastChar = name.charCodeAt(name.length - 1);
  const isHangul = lastChar >= 0xac00 && lastChar <= 0xd7a3;
  if (!isHangul) return "와";
  return (lastChar - 0xac00) % 28 > 0 ? "과" : "와";
};

/** 주격 조사 (이/가) 반환 */
export const getSubjectParticle = (name: string): string => {
  if (!name) return "가";
  const lastChar = name.charCodeAt(name.length - 1);
  const isHangul = lastChar >= 0xac00 && lastChar <= 0xd7a3;
  if (!isHangul) return "가";
  return (lastChar - 0xac00) % 28 > 0 ? "이" : "가";
};
