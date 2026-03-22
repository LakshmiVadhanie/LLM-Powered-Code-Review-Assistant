import { useState } from "react";
import { useSubmitReview } from "@/hooks/useReviews";
import { ReviewResultPanel } from "@/components/ReviewResultPanel";
import { ReviewType } from "@/types";
import { Loader2, Wand2, ChevronDown } from "lucide-react";
import clsx from "clsx";

const LANGUAGES = [
  "typescript", "javascript", "python", "go", "rust",
  "java", "c", "cpp", "ruby", "php", "swift", "kotlin",
];

const REVIEW_TYPES: { value: ReviewType; label: string; icon: string }[] = [
  { value: "security", label: "Security", icon: "🔒" },
  { value: "style", label: "Style", icon: "✨" },
  { value: "performance", label: "Performance", icon: "⚡" },
  { value: "bugs", label: "Bugs", icon: "🐛" },
];

const EXAMPLE_CODE = `// Example: Vulnerable authentication function
async function loginUser(username: string, password: string) {
  // BAD: Direct string interpolation in SQL query
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  const user = await db.query(query);
  
  if (!user) {
    return null;
  }
  
  // BAD: Weak token generation
  const token = Math.random().toString(36).substring(7);
  
  // BAD: Password stored in response
  return { user, token, password };
}

// Example: Unoptimized React component
function UserList({ users }) {
  // BAD: Expensive operation without memoization
  const sortedUsers = users
    .filter(u => u.active)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      {sortedUsers.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}`;

export function ReviewPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [filename, setFilename] = useState("");
  const [context, setContext] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<ReviewType[]>(["all"]);
  const [allTypes, setAllTypes] = useState(true);

  const submit = useSubmitReview();

  const toggleType = (t: ReviewType) => {
    if (allTypes) {
      setAllTypes(false);
      setSelectedTypes([t]);
      return;
    }
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const toggleAll = () => {
    setAllTypes(true);
    setSelectedTypes(["all"]);
  };

  const handleSubmit = () => {
    if (!code.trim()) return;
    submit.mutate({
      code,
      language,
      filename: filename || undefined,
      context: context || undefined,
      reviewTypes: allTypes ? ["all"] : selectedTypes,
    });
  };

  return (
    <div className="space-y-6">
      <div className="animate-fadeSlideUp">
        <h1 className="text-xl font-bold text-warm-800">New Review</h1>
        <p className="text-sm text-warm-400 mt-0.5">
          Paste your code for AI-powered analysis
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Left: input */}
        <div className="space-y-4 animate-fadeSlideUp stagger-1">
          {/* Meta row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Language select */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full appearance-none rounded-xl border border-sand-200 bg-white/70 backdrop-blur-sm px-3 py-2.5 text-sm text-warm-700 focus:border-pastel-rose focus:outline-none focus:ring-2 focus:ring-pastel-rose/20 pr-8 transition-all duration-200"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none" />
            </div>

            {/* Filename */}
            <input
              type="text"
              placeholder="filename.ts (optional)"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="rounded-xl border border-sand-200 bg-white/70 backdrop-blur-sm px-3 py-2.5 text-sm text-warm-700 placeholder-warm-300 focus:border-pastel-rose focus:outline-none focus:ring-2 focus:ring-pastel-rose/20 font-mono transition-all duration-200"
            />
          </div>

          {/* Review types */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-warm-400 shrink-0">Focus:</span>
            <button
              onClick={toggleAll}
              className={clsx(
                "text-xs px-3 py-1.5 rounded-full border transition-all duration-200",
                allTypes
                  ? "bg-gradient-to-r from-pastel-rose/30 to-pastel-lavender/20 border-pastel-rose/40 text-warm-700 font-medium shadow-sm"
                  : "border-sand-200 text-warm-400 hover:border-sand-300 hover:bg-white/50"
              )}
            >
              🔍 All
            </button>
            {REVIEW_TYPES.map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => toggleType(value)}
                className={clsx(
                  "text-xs px-3 py-1.5 rounded-full border transition-all duration-200",
                  !allTypes && selectedTypes.includes(value)
                    ? "bg-gradient-to-r from-pastel-rose/30 to-pastel-lavender/20 border-pastel-rose/40 text-warm-700 font-medium shadow-sm"
                    : "border-sand-200 text-warm-400 hover:border-sand-300 hover:bg-white/50"
                )}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Code textarea */}
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here…"
              rows={20}
              spellCheck={false}
              className="w-full rounded-2xl border border-sand-200 bg-white/60 backdrop-blur-sm px-4 py-3 text-sm text-warm-800 font-mono placeholder-warm-300 focus:border-pastel-lavender focus:outline-none focus:ring-2 focus:ring-pastel-lavender/20 resize-none leading-relaxed transition-all duration-200"
            />
            {!code && (
              <button
                onClick={() => { setCode(EXAMPLE_CODE); setFilename("auth.ts"); }}
                className="absolute bottom-4 right-4 text-xs text-warm-400 hover:text-warm-600 transition-all duration-200 border border-sand-200 rounded-lg px-2.5 py-1.5 bg-white/60 hover:bg-white/80 hover:shadow-sm"
              >
                Load example
              </button>
            )}
          </div>

          {/* Context */}
          <input
            type="text"
            placeholder="Additional context (optional): e.g. 'this is a public API endpoint'"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full rounded-xl border border-sand-200 bg-white/70 backdrop-blur-sm px-3 py-2.5 text-sm text-warm-700 placeholder-warm-300 focus:border-pastel-rose focus:outline-none focus:ring-2 focus:ring-pastel-rose/20 transition-all duration-200"
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!code.trim() || submit.isPending}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-pastel-rose-deep to-pastel-lavender-deep text-warm-900 font-bold text-sm hover:from-pastel-rose hover:to-pastel-lavender transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pastel-rose/20 hover:shadow-xl hover:shadow-pastel-rose/30 hover:scale-[1.01]"
          >
            {submit.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin text-warm-900" />
                Analyzing with GPT-4o…
              </>
            ) : (
              <>
                <Wand2 size={16} className="text-warm-900" />
                Run AI Review
              </>
            )}
          </button>
        </div>

        {/* Right: results */}
        <div className="animate-fadeSlideUp stagger-2">
          {submit.isPending && (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-2 border-pastel-rose/30 animate-ping absolute inset-0" />
                <div className="h-12 w-12 rounded-full border-2 border-pastel-rose border-t-transparent animate-spin" />
              </div>
              <p className="text-sm text-warm-400">LangChain + GPT-4o analyzing your code…</p>
            </div>
          )}

          {!submit.isPending && submit.isError && (
            <div className="flex flex-col items-center justify-center h-full min-h-[16rem] rounded-2xl border border-red-200 bg-red-50 p-8 text-center backdrop-blur-sm">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-sm font-semibold text-red-700">Analysis Failed</p>
              <p className="text-xs text-red-600 mt-2 max-w-sm whitespace-pre-wrap">
                {submit.error instanceof Error ? submit.error.message : "An unexpected error occurred."}
              </p>
            </div>
          )}

          {!submit.isPending && !submit.isError && submit.data && (
            <ReviewResultPanel result={submit.data} />
          )}

          {!submit.isPending && !submit.isError && !submit.data && (
            <div className="flex flex-col items-center justify-center h-64 rounded-2xl border border-dashed border-sand-300 text-center p-8 bg-white/30 backdrop-blur-sm">
              <div className="text-4xl mb-3">🤖</div>
              <p className="text-sm text-warm-600 font-medium">Results will appear here</p>
              <p className="text-xs text-warm-400 mt-1">Submit code on the left to start</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
