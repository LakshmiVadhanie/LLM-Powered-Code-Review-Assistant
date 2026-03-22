import { ReviewResult } from "@/types";
import { IssueCard } from "./IssueCard";
import { scoreColor, scoreLabel, formatDuration, severityConfig, typeConfig } from "@/lib/utils";
import { useAcceptReview } from "@/hooks/useReviews";
import { CheckCircle, Clock, FileCode, Zap } from "lucide-react";
import clsx from "clsx";

interface ReviewResultPanelProps {
  result: ReviewResult;
}

export function ReviewResultPanel({ result }: ReviewResultPanelProps) {
  const accept = useAcceptReview();

  const issueCounts = result.issues.reduce(
    (acc, i) => {
      acc[i.severity] = (acc[i.severity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const byType = result.issues.reduce(
    (acc, i) => {
      acc[i.type] = (acc[i.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-5 animate-fadeSlideUp">
      {/* Header */}
      <div className="rounded-2xl glass-card p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <FileCode size={16} className="text-warm-500 shrink-0" />
              <span className="text-sm font-mono text-warm-700 truncate">
                {result.filename || "untitled"}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sand-100 text-warm-500 font-mono border border-sand-200">
                {result.language}
              </span>
            </div>
            <p className="text-sm text-warm-600 leading-relaxed">{result.summary}</p>
          </div>

          {/* Score */}
          <div className="text-center shrink-0">
            <div className={clsx("text-5xl font-bold font-mono", scoreColor(result.score))}>
              {result.score}
            </div>
            <div className={clsx("text-xs font-semibold uppercase tracking-wide mt-1", scoreColor(result.score))}>
              {scoreLabel(result.score)}
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-sand-200/50 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-warm-400">
            <Clock size={12} />
            {formatDuration(result.duration)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-warm-400">
            <Zap size={12} />
            {result.linesReviewed} lines reviewed
          </span>
          <span className="text-xs text-warm-400">
            {result.issues.length} issue{result.issues.length !== 1 ? "s" : ""} found
          </span>

          <div className="ml-auto flex gap-2">
            {!result.accepted ? (
              <button
                onClick={() => accept.mutate(result.id)}
                disabled={accept.isPending}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-pastel-mint/30 border border-pastel-mint/40 text-emerald-700 hover:bg-pastel-mint/50 transition-all duration-200 disabled:opacity-50 hover:shadow-sm"
              >
                <CheckCircle size={13} />
                Accept Review
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-pastel-mint/30 border border-pastel-mint/40 text-emerald-700">
                <CheckCircle size={13} />
                Accepted
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Issue breakdown */}
      {result.issues.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(["critical", "high", "medium", "low"] as const).map((sev) => (
            <div
              key={sev}
              className={clsx(
                "rounded-xl border p-3 text-center transition-all duration-200 hover:scale-[1.03]",
                severityConfig[sev].bg
              )}
            >
              <div className={clsx("text-xl font-bold font-mono", severityConfig[sev].color)}>
                {issueCounts[sev] || 0}
              </div>
              <div className="text-xs text-warm-400 mt-0.5 capitalize">{sev}</div>
            </div>
          ))}
        </div>
      )}

      {/* Type breakdown */}
      {Object.keys(byType).length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {Object.entries(byType).map(([type, count]) => {
            const t = typeConfig[type as keyof typeof typeConfig];
            return (
              <span
                key={type}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-white/60 border border-sand-200 text-warm-600 backdrop-blur-sm"
              >
                {t?.icon} {t?.label || type}
                <span className="font-mono font-bold text-warm-800">{count}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Issues list */}
      {result.issues.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-warm-400">
            Issues
          </h3>
          {result.issues
            .sort((a, b) => {
              const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
              return order[a.severity] - order[b.severity];
            })
            .map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-pastel-mint/20 border border-pastel-mint/30 p-8 text-center">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-emerald-700 font-medium">No issues found</p>
          <p className="text-sm text-warm-400 mt-1">This code looks clean!</p>
        </div>
      )}
    </div>
  );
}
