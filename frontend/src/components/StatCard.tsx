import { ReactNode } from "react";
import clsx from "clsx";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  accent?: "mint" | "lavender" | "peach" | "rose";
}

const accents = {
  mint: "from-pastel-mint/30 to-pastel-mint/5 border-pastel-mint/40 text-emerald-700",
  lavender: "from-pastel-lavender/30 to-pastel-lavender/5 border-pastel-lavender/40 text-purple-700",
  peach: "from-pastel-peach/30 to-pastel-peach/5 border-pastel-peach/40 text-amber-700",
  rose: "from-pastel-rose/30 to-pastel-rose/5 border-pastel-rose/40 text-rose-700",
};

export function StatCard({ label, value, sub, icon, accent = "lavender" }: StatCardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border bg-gradient-to-br p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-default",
        accents[accent]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-warm-500 mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-warm-800 font-mono">{value}</p>
          {sub && <p className="text-xs text-warm-400 mt-1">{sub}</p>}
        </div>
        <div className="text-2xl opacity-80">{icon}</div>
      </div>
    </div>
  );
}
