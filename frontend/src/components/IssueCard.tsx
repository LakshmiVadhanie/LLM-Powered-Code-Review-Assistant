import { ReviewIssue } from "@/types";
import { severityConfig, typeConfig } from "@/lib/utils";
import clsx from "clsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface IssueCardProps {
  issue: ReviewIssue;
}

export function IssueCard({ issue }: IssueCardProps) {
  const [expanded, setExpanded] = useState(false);
  const sev = severityConfig[issue.severity];
  const typ = typeConfig[issue.type];

  return (
    <div
      className={clsx(
        "rounded-xl border p-4 transition-all duration-200",
        sev.bg
      )}
    >
      <button
        className="w-full text-left"
        onClick={() => setExpanded((p) => !p)}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-base">{typ.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={clsx(
                  "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide",
                  sev.color
                )}
              >
                <span className={clsx("h-1.5 w-1.5 rounded-full", sev.dot)} />
                {sev.label}
              </span>
              <span className={clsx("text-xs", typ.color)}>{typ.label}</span>
              {issue.line && (
                <span className="text-xs text-warm-400 font-mono">
                  line {issue.line}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-warm-800 mt-1">{issue.title}</p>
          </div>
          <span className="text-warm-400 shrink-0">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 pl-8 space-y-3 animate-fadeIn">
          <p className="text-sm text-warm-600">{issue.description}</p>
          <div className="rounded-xl bg-pastel-mint/20 border border-pastel-mint/30 p-3">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
              Suggestion
            </p>
            <p className="text-sm text-warm-700">{issue.suggestion}</p>
          </div>
          {issue.codeSnippet && (
            <pre className="text-xs font-mono bg-warm-800 border border-warm-700 rounded-xl p-3 overflow-x-auto text-cream-200">
              {issue.codeSnippet}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
