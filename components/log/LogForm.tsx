"use client";

import { useState, useEffect } from "react";
import { PEOPLE, TASKS } from "@/lib/types";
import { format } from "date-fns";

export default function LogForm() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [grid, setGrid] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Initialize grid
  useEffect(() => {
    const initial: Record<string, Record<string, boolean>> = {};
    for (const task of TASKS) {
      initial[task.key] = {};
      for (const person of PEOPLE) {
        initial[task.key][person.key] = false;
      }
    }
    setGrid(initial);
  }, []);

  const toggleCell = (taskKey: string, personKey: string) => {
    setGrid((prev) => ({
      ...prev,
      [taskKey]: {
        ...prev[taskKey],
        [personKey]: !prev[taskKey]?.[personKey],
      },
    }));
  };

  const loadExisting = async () => {
    setLoadingExisting(true);
    try {
      const res = await fetch("/api/entries");
      const entries = await res.json();
      const dayEntries = entries.filter((e: any) => e.date === date);

      const newGrid: Record<string, Record<string, boolean>> = {};
      for (const task of TASKS) {
        newGrid[task.key] = {};
        const entry = dayEntries.find((e: any) => e.task === task.key);
        for (const person of PEOPLE) {
          newGrid[task.key][person.key] = entry ? entry[person.key] : false;
        }
      }
      setGrid(newGrid);
      setMessage({ type: "success", text: `Loaded data for ${date}` });
    } catch {
      setMessage({ type: "error", text: "Failed to load existing data" });
    }
    setLoadingExisting(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      for (const task of TASKS) {
        const body = {
          date,
          task: task.key,
          anshul: grid[task.key]?.anshul || false,
          arsh: grid[task.key]?.arsh || false,
          shivraj: grid[task.key]?.shivraj || false,
          shruti: grid[task.key]?.shruti || false,
        };
        await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setMessage({ type: "success", text: `Saved entries for ${date}!` });
    } catch {
      setMessage({ type: "error", text: "Failed to save entries" });
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Date picker + actions */}
      <div className="glass-card p-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider font-sora mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-48"
            />
          </div>
          <button onClick={loadExisting} className="btn-secondary" disabled={loadingExisting}>
            {loadingExisting ? "Loading..." : "📥 Load Existing"}
          </button>
        </div>
      </div>

      {/* Checkbox grid */}
      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs text-white/40 uppercase tracking-wider font-sora pb-4 pr-6">
                  Task
                </th>
                {PEOPLE.map((person) => (
                  <th
                    key={person.key}
                    className="text-center pb-4 px-4"
                  >
                    <span
                      className="text-xs font-medium font-sora"
                      style={{ color: person.color }}
                    >
                      {person.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TASKS.map((task) => (
                <tr
                  key={task.key}
                  className="border-t border-dark-border hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{task.icon}</span>
                      <span className="text-sm font-medium text-white/70 font-sora">
                        {task.label}
                      </span>
                    </div>
                  </td>
                  {PEOPLE.map((person) => (
                    <td key={person.key} className="text-center py-4 px-4">
                      <input
                        type="checkbox"
                        checked={grid[task.key]?.[person.key] || false}
                        onChange={() => toggleCell(task.key, person.key)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button onClick={handleSubmit} className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : "💾 Save All Entries"}
        </button>
        {message && (
          <span
            className={`text-sm font-sora animate-fade-in ${
              message.type === "success" ? "text-brand-green" : "text-brand-red"
            }`}
          >
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}
