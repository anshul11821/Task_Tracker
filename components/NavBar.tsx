"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/streaks": "Streaks",
  "/charts": "Charts",
  "/heatmap": "Heatmap",
  "/log": "Log Entry",
  "/history": "History",
};

export default function NavBar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Daily Task Tracker";

  return (
    <header className="sticky top-0 z-40 h-16 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold font-sora gradient-text">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-xs text-white/30 font-mono">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    </header>
  );
}
