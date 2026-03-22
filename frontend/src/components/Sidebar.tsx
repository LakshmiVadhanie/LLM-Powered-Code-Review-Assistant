import { NavLink } from "react-router-dom";
import { LayoutDashboard, Code2, History, Github, Zap } from "lucide-react";
import clsx from "clsx";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/review", icon: Code2, label: "New Review" },
  { to: "/history", icon: History, label: "History" },
];

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-sand-200/60 bg-white/60 backdrop-blur-xl relative z-10">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sand-200/40">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pastel-rose to-pastel-lavender shadow-md shadow-pastel-rose/20 transition-transform duration-300 hover:scale-110">
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-warm-800 leading-none">CodeReview</p>
          <p className="text-xs text-warm-400 leading-none mt-0.5">AI Assistant</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-pastel-rose/30 to-pastel-lavender/20 border border-pastel-rose/30 text-warm-800 font-semibold shadow-sm"
                  : "text-warm-500 hover:text-warm-700 hover:bg-white/60 border border-transparent hover:shadow-sm"
              )
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sand-200/40">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-xs text-warm-400 hover:text-warm-600 transition-colors"
        >
          <Github size={13} />
          View on GitHub
        </a>
        <p className="text-xs text-sand-300 mt-2">Powered by GPT-4o + LangChain</p>
      </div>
    </aside>
  );
}
