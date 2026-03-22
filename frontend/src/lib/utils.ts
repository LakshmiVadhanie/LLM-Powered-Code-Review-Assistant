import { Severity, ReviewType } from "@/types";

export const severityConfig: Record<
  Severity,
  { label: string; color: string; bg: string; dot: string }
> = {
  critical: {
    label: "Critical",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    dot: "bg-red-500",
  },
  high: {
    label: "High",
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
    dot: "bg-orange-500",
  },
  medium: {
    label: "Medium",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
  },
  info: {
    label: "Info",
    color: "text-warm-500",
    bg: "bg-sand-100/60 border-sand-200",
    dot: "bg-warm-400",
  },
};

export const typeConfig: Record<
  ReviewType,
  { label: string; color: string; icon: string }
> = {
  security: { label: "Security", color: "text-red-600", icon: "🔒" },
  style: { label: "Style", color: "text-purple-600", icon: "✨" },
  performance: { label: "Performance", color: "text-amber-600", icon: "⚡" },
  bugs: { label: "Bugs", color: "text-orange-600", icon: "🐛" },
  all: { label: "All", color: "text-warm-500", icon: "🔍" },
};

export function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
