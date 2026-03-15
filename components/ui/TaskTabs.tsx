"use client";

import { TASKS } from "@/lib/types";

interface TaskTabsProps {
  selected: string | null;
  onChange: (task: string | null) => void;
}

export default function TaskTabs({ selected, onChange }: TaskTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium font-sora transition-all duration-200
          ${
            selected === null
              ? "bg-gradient-to-r from-brand-purple/30 to-brand-blue/20 text-white border border-brand-purple/30"
              : "bg-dark-surface text-white/40 border border-dark-border hover:text-white/60 hover:border-white/10"
          }
        `}
      >
        All Tasks
      </button>
      {TASKS.map((task) => (
        <button
          key={task.key}
          onClick={() => onChange(task.key)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium font-sora transition-all duration-200
            flex items-center gap-2
            ${
              selected === task.key
                ? "bg-gradient-to-r from-brand-purple/30 to-brand-blue/20 text-white border border-brand-purple/30"
                : "bg-dark-surface text-white/40 border border-dark-border hover:text-white/60 hover:border-white/10"
            }
          `}
        >
          <span>{task.icon}</span>
          <span>{task.label}</span>
        </button>
      ))}
    </div>
  );
}
