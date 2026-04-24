import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function scoreColor(score: number | null): string {
  if (!score) return "text-[#64748B] bg-[#64748B]/10 border-[#64748B]/30";
  if (score >= 7) return "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30";
  if (score >= 4) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
  return "text-red-400 bg-red-400/10 border-red-400/30";
}

export function trialDaysLeft(trialEndsAt: string | null): number {
  if (!trialEndsAt) return 14;
  const diff = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
