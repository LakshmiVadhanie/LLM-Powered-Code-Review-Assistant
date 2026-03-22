import { useStats } from "@/hooks/useReviews";
import { StatCard } from "@/components/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { scoreColor, formatDuration } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ArrowRight, FileCode, Plus } from "lucide-react";
import clsx from "clsx";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#E57373",
  high: "#FFB74D",
  medium: "#FFD54F",
  low: "#81C8F0",
  info: "#B0A090",
};

const TYPE_COLORS: Record<string, string> = {
  security: "#E8A0A0",
  style: "#C3AEE8",
  performance: "#FFCC80",
  bugs: "#FFB07A",
};

export function DashboardPage() {
  const { data: stats, isLoading, error } = useStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 rounded-full border-2 border-pastel-rose border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-warm-400">Loading stats…</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-red-600">Failed to load stats. Is the backend running?</p>
      </div>
    );
  }

  const severityData = Object.entries(stats.issuesBySeverity).map(([name, value]) => ({
    name,
    value,
  }));

  const typeData = Object.entries(stats.issuesByType).map(([name, value]) => ({
    name,
    value,
    fill: TYPE_COLORS[name] || "#B0A090",
  }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between animate-fadeSlideUp">
        <div>
          <h1 className="text-xl font-bold text-warm-800">Dashboard</h1>
          <p className="text-sm text-warm-400 mt-0.5">Code review analytics & insights</p>
        </div>
        <Link
          to="/review"
          className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl bg-gradient-to-r from-pastel-rose/40 to-pastel-lavender/30 border border-pastel-rose/30 text-warm-700 font-medium hover:from-pastel-rose/60 hover:to-pastel-lavender/40 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus size={14} />
          New Review
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="animate-fadeSlideUp stagger-1">
          <StatCard
            label="Total Reviews"
            value={stats.totalReviews}
            sub="all time"
            icon="📋"
            accent="lavender"
          />
        </div>
        <div className="animate-fadeSlideUp stagger-2">
          <StatCard
            label="This Week"
            value={stats.weeklyReviews}
            sub="last 7 days"
            icon="📅"
            accent="rose"
          />
        </div>
        <div className="animate-fadeSlideUp stagger-3">
          <StatCard
            label="Acceptance Rate"
            value={`${stats.acceptanceRate}%`}
            sub="of submitted reviews"
            icon="✅"
            accent="mint"
          />
        </div>
        <div className="animate-fadeSlideUp stagger-4">
          <StatCard
            label="Avg Score"
            value={stats.avgScore}
            sub="out of 100"
            icon="⭐"
            accent="peach"
          />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Issues by type bar chart */}
        <div className="rounded-2xl glass-card p-5 animate-fadeSlideUp stagger-3">
          <h2 className="text-sm font-semibold text-warm-700 mb-4">Issues by Type</h2>
          {typeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={typeData} barSize={32}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#A68B5B", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#A68B5B", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(220, 200, 170, 0.4)",
                    borderRadius: "12px",
                    color: "#3D2C1E",
                    fontSize: "12px",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 16px rgba(140, 100, 60, 0.1)",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {typeData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-warm-400 text-center py-16">No data yet</p>
          )}
        </div>

        {/* Issues by severity pie */}
        <div className="rounded-2xl glass-card p-5 animate-fadeSlideUp stagger-4">
          <h2 className="text-sm font-semibold text-warm-700 mb-4">Issues by Severity</h2>
          {severityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={severityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={40}
                  paddingAngle={3}
                >
                  {severityData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={SEVERITY_COLORS[entry.name] || "#B0A090"}
                    />
                  ))}
                </Pie>
                <Legend
                  formatter={(v) => (
                    <span style={{ color: "#8B6914", fontSize: 12 }}>{v}</span>
                  )}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(220, 200, 170, 0.4)",
                    borderRadius: "12px",
                    color: "#3D2C1E",
                    fontSize: "12px",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 16px rgba(140, 100, 60, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-warm-400 text-center py-16">No data yet</p>
          )}
        </div>
      </div>

      {/* Recent reviews */}
      <div className="rounded-2xl glass-card overflow-hidden animate-fadeSlideUp stagger-5">
        <div className="flex items-center justify-between px-5 py-4 border-b border-sand-200/40">
          <h2 className="text-sm font-semibold text-warm-700">Recent Reviews</h2>
          <Link
            to="/history"
            className="flex items-center gap-1 text-xs text-warm-400 hover:text-warm-600 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        <div className="divide-y divide-sand-200/30">
          {stats.recentReviews.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-warm-400">No reviews yet.</p>
              <Link to="/review" className="text-sm text-rose-500 hover:underline mt-1 inline-block">
                Submit your first review →
              </Link>
            </div>
          ) : (
            stats.recentReviews.map((r) => (
              <div key={r.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/40 transition-all duration-200">
                <FileCode size={15} className="text-warm-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-warm-700 truncate font-mono">
                    {r.filename || "untitled"}
                  </p>
                  <p className="text-xs text-warm-400 mt-0.5">
                    {r.issues.length} issues · {r.linesReviewed} lines · {formatDuration(r.duration)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={clsx("text-sm font-bold font-mono", scoreColor(r.score))}>
                    {r.score}
                  </span>
                  {r.accepted !== undefined && (
                    <div className={clsx("text-xs mt-0.5", r.accepted ? "text-emerald-600" : "text-warm-400")}>
                      {r.accepted ? "accepted" : "pending"}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
