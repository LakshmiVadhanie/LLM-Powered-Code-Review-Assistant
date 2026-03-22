import { useStats } from "@/hooks/useReviews";
import { ReviewResultPanel } from "@/components/ReviewResultPanel";
import { scoreColor, formatDuration } from "@/lib/utils";
import { ReviewResult } from "@/types";
import { useState } from "react";
import { FileCode, ChevronRight } from "lucide-react";
import clsx from "clsx";

export function HistoryPage() {
  const { data: stats, isLoading } = useStats();
  const [selected, setSelected] = useState<ReviewResult | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-2 border-pastel-rose border-t-transparent animate-spin" />
      </div>
    );
  }

  const reviews = stats?.recentReviews || [];

  return (
    <div className="space-y-6">
      <div className="animate-fadeSlideUp">
        <h1 className="text-xl font-bold text-warm-800">Review History</h1>
        <p className="text-sm text-warm-400 mt-0.5">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""} total
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* List */}
        <div className="rounded-2xl glass-card overflow-hidden animate-fadeSlideUp stagger-1">
          {reviews.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-warm-400 text-sm">No reviews yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-sand-200/30">
              {reviews.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-200 hover:bg-white/50",
                    selected?.id === r.id && "bg-pastel-rose/10 border-l-2 border-pastel-rose-deep"
                  )}
                >
                  <FileCode size={15} className="text-warm-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-warm-700 font-mono truncate">
                      {r.filename || "untitled"}
                    </p>
                    <p className="text-xs text-warm-400 mt-0.5">
                      {new Date(r.createdAt).toLocaleDateString()} · {r.issues.length} issues ·{" "}
                      {formatDuration(r.duration)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={clsx("text-sm font-bold font-mono", scoreColor(r.score))}>
                      {r.score}
                    </span>
                    {r.accepted !== undefined && (
                      <span
                        className={clsx(
                          "text-xs px-1.5 py-0.5 rounded-full",
                          r.accepted
                            ? "bg-pastel-mint/30 text-emerald-700"
                            : "bg-sand-100 text-warm-400"
                        )}
                      >
                        {r.accepted ? "✓" : "pending"}
                      </span>
                    )}
                    <ChevronRight size={13} className="text-warm-300" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="animate-fadeSlideUp stagger-2">
          {selected ? (
            <ReviewResultPanel result={selected} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 rounded-2xl border border-dashed border-sand-300 text-center p-8 bg-white/30 backdrop-blur-sm">
              <p className="text-sm text-warm-400">Select a review to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
