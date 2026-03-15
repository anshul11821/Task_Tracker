"use client";

import { useState, useMemo } from "react";
import { Entry, PEOPLE, TASKS } from "@/lib/types";
import PersonBadge from "@/components/ui/PersonBadge";

interface HistoryTableProps {
  entries: Entry[];
  onDelete: (id: string) => void;
}

export default function HistoryTable({ entries, onDelete }: HistoryTableProps) {
  const [taskFilter, setTaskFilter] = useState<string>("all");
  const [personFilter, setPersonFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const months = useMemo(() => {
    const set = new Set(entries.map((e) => e.date.substring(0, 7)));
    return Array.from(set).sort().reverse();
  }, [entries]);

  const filtered = useMemo(() => {
    let result = [...entries];
    if (taskFilter !== "all") {
      result = result.filter((e) => e.task === taskFilter);
    }
    if (personFilter !== "all") {
      result = result.filter((e) => e[personFilter as keyof Entry] === true);
    }
    if (monthFilter !== "all") {
      result = result.filter((e) => e.date.startsWith(monthFilter));
    }
    return result.sort((a, b) => b.date.localeCompare(a.date));
  }, [entries, taskFilter, personFilter, monthFilter]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await onDelete(id);
    setDeleting(null);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-wider font-sora mb-1">
              Task
            </label>
            <select
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value)}
              className="text-sm"
            >
              <option value="all">All Tasks</option>
              {TASKS.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.icon} {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-wider font-sora mb-1">
              Person
            </label>
            <select
              value={personFilter}
              onChange={(e) => setPersonFilter(e.target.value)}
              className="text-sm"
            >
              <option value="all">All People</option>
              {PEOPLE.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-wider font-sora mb-1">
              Month
            </label>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="text-sm"
            >
              <option value="all">All Months</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left text-xs text-white/40 uppercase tracking-wider font-sora p-4">
                  Date
                </th>
                <th className="text-left text-xs text-white/40 uppercase tracking-wider font-sora p-4">
                  Task
                </th>
                {PEOPLE.map((p) => (
                  <th
                    key={p.key}
                    className="text-center text-xs uppercase tracking-wider font-sora p-4"
                    style={{ color: `${p.color}80` }}
                  >
                    {p.label}
                  </th>
                ))}
                <th className="text-center text-xs text-white/40 uppercase tracking-wider font-sora p-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-white/30 text-sm font-sora">
                    No entries found
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => {
                  const task = TASKS.find((t) => t.key === entry.task);
                  return (
                    <tr
                      key={entry.id}
                      className="border-t border-dark-border hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4 text-sm font-mono text-white/60">
                        {entry.date}
                      </td>
                      <td className="p-4 text-sm font-sora text-white/70">
                        {task?.icon} {task?.label || entry.task}
                      </td>
                      {PEOPLE.map((p) => (
                        <td key={p.key} className="text-center p-4">
                          {entry[p.key as keyof Entry] ? (
                            <span className="text-lg">✅</span>
                          ) : (
                            <span className="text-lg opacity-20">⬜</span>
                          )}
                        </td>
                      ))}
                      <td className="text-center p-4">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="btn-danger text-xs"
                          disabled={deleting === entry.id}
                        >
                          {deleting === entry.id ? "..." : "🗑️"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-dark-border text-xs text-white/30 font-sora">
          Showing {filtered.length} of {entries.length} entries
        </div>
      </div>
    </div>
  );
}
