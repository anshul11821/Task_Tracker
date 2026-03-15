"use client";

import { useEffect, useState, useMemo } from "react";
import { Entry, PEOPLE, TASKS, PersonKey } from "@/lib/types";
import { calcStreak, getLongestStreaks, getStackedDailyData } from "@/lib/data";
import StreakCard from "@/components/streaks/StreakCard";
import StreakRow from "@/components/streaks/StreakRow";
import StackedBar from "@/components/charts/StackedBar";

const TASK_COLORS = ["#a78bfa", "#38bdf8", "#fb923c", "#f472b6", "#34d399"];

export default function StreaksPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/entries")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const overallStreaks = useMemo(() => {
    return PEOPLE.map((person) => ({
      ...person,
      ...calcStreak(entries, person.key),
    }));
  }, [entries]);

  const taskStreaks = useMemo(() => {
    return TASKS.map((task) => ({
      ...task,
      streaks: Object.fromEntries(
        PEOPLE.map((p) => [p.key, calcStreak(entries, p.key, task.key)])
      ) as Record<PersonKey, { current: number; best: number }>,
    }));
  }, [entries]);

  const longestStreaks = useMemo(() => getLongestStreaks(entries), [entries]);

  const stackedDailyData = useMemo(() => {
    const data = getStackedDailyData(entries);
    // Only show last 30 days
    return data.slice(-30);
  }, [entries]);

  const taskKeys = TASKS.map((t, i) => ({
    key: t.key,
    label: t.label,
    color: TASK_COLORS[i],
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-white/30 font-sora animate-pulse">Loading streaks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overall Streak Cards */}
      <div>
        <h3 className="text-sm font-semibold text-white/40 mb-4 font-sora uppercase tracking-wider">
          🔥 Overall Streaks
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overallStreaks.map((person) => (
            <StreakCard
              key={person.key}
              label={person.label}
              color={person.color}
              current={person.current}
              best={person.best}
            />
          ))}
        </div>
      </div>

      {/* Per-Task Streak Rows */}
      <div>
        <h3 className="text-sm font-semibold text-white/40 mb-4 font-sora uppercase tracking-wider">
          📊 Per-Task Streaks
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {taskStreaks.map((task) => (
            <StreakRow
              key={task.key}
              taskLabel={task.label}
              taskIcon={task.icon}
              streaks={task.streaks}
            />
          ))}
        </div>
      </div>

      {/* Longest Streaks Table */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white/60 mb-4 font-sora uppercase tracking-wider">
          🏆 Top 10 Longest Streaks
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left text-xs text-white/40 uppercase tracking-wider font-sora p-3">
                  Rank
                </th>
                <th className="text-left text-xs text-white/40 uppercase tracking-wider font-sora p-3">
                  Person
                </th>
                <th className="text-left text-xs text-white/40 uppercase tracking-wider font-sora p-3">
                  Task
                </th>
                <th className="text-right text-xs text-white/40 uppercase tracking-wider font-sora p-3">
                  Streak
                </th>
              </tr>
            </thead>
            <tbody>
              {longestStreaks.map((row, i) => (
                <tr key={i} className="border-t border-dark-border hover:bg-white/[0.02]">
                  <td className="p-3 text-sm font-mono text-white/30">#{i + 1}</td>
                  <td className="p-3">
                    <span
                      className="text-sm font-medium font-sora"
                      style={{ color: row.color }}
                    >
                      {row.person}
                    </span>
                  </td>
                  <td className="p-3 text-sm font-sora text-white/60">{row.task}</td>
                  <td className="p-3 text-right">
                    <span className="text-lg font-bold font-mono" style={{ color: row.color }}>
                      {row.streak}
                    </span>
                    <span className="text-xs text-white/30 ml-1">days</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stacked Daily Bar Chart */}
      <StackedBar
        data={stackedDailyData}
        title="Daily Task Completion (Last 30 Days)"
        dataKeyField="date"
        keys={taskKeys}
      />
    </div>
  );
}
