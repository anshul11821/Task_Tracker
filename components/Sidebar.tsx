"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/streaks", label: "Streaks", icon: "🔥" },
  { href: "/charts", label: "Charts", icon: "📈" },
  { href: "/heatmap", label: "Heatmap", icon: "🗓️" },
  { href: "/log", label: "Log Entry", icon: "✏️" },
  { href: "/history", label: "History", icon: "📋" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-dark-card border-r border-dark-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-dark-border">
        <Link href="/dashboard" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-xl">
            ✅
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-sora leading-tight">
              Daily Task
            </h1>
            <p className="text-xs text-white/40 font-sora">Tracker</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 no-underline
                  ${
                    isActive
                      ? "bg-gradient-to-r from-brand-purple/20 to-brand-blue/10 text-white border border-brand-purple/20"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-sora">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse-glow" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-border">
        <p className="text-[11px] text-white/20 text-center font-mono">
          v1.0 • {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
}
