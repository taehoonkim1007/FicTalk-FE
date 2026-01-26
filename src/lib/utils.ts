import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getParticle = (name: string) => {
  if (!name) return "와";
  const lastChar = name.charCodeAt(name.length - 1);
  const isHangul = lastChar >= 0xac00 && lastChar <= 0xd7a3;
  if (!isHangul) return "와";
  return (lastChar - 0xac00) % 28 > 0 ? "과" : "와";
};
