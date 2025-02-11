import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const labels = [
  "sports",
  "street",
  "safety",
  "rap",
  "cinema",
  "soccer",
  "cellphone",
  "bro",
  "navy",
  "military",
  "friends",
  "house",
  "music",
  "kids",
  "food",
  "travel",
  "AI",
  "tech",
  "future",
  "space",
  "health",
  "space",
  "money",
  "water",
  "environment",
  "baby",
  "TV",
];
