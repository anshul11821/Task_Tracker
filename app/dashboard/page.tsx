"use client";

import { useEffect, useState, useMemo } from "react";
import { Entry, PEOPLE, TASKS } from "@/lib/types";
import { countTicks, getConsistency, calcStreak, getTotalDays, getBarTotals, getDailyTotals, getLeaderboard } from "@/lib/data";
import StatCard from "@/components/ui/StatCard";
import TaskTabs from "@/components/ui/TaskTabs";
import PersonBadge from "@/components/ui/PersonBadge";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";

export default function DashboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [taskFilter, setTaskFilter] = useState<string | null>(null);
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

  const filtered = useMemo(
    () => (taskFilter ? entries.filter((e) => e.task === taskFilter) : entries),
    [entries, taskFilter]
  );

  const totalTasks = taskFilter ? 1 : TASKS.length;
  const totalDays = useMemo(() => getTotalDays(entries), [entries]);
  const leaderboard = useMemo(() => getLeaderboard(filtered, totalDays, totalTasks), [filtered, totalDays, totalTasks]);
  const barData = useMemo(() => getBarTotals(filtered), [filtered]);
  const lineData = useMemo(() => getDailyTotals(entries, taskFilter ?? undefined), [entries, taskFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-white/30 font-sora animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Task Filter */}
      <TaskTabs selected={taskFilter} onChange={setTaskFilter} />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PEOPLE.map((person) => {
          const ticks = countTicks(filtered, person.key);
          const consistency = getConsistency(entries, person.key, totalDays, totalTasks);
          const streak = calcStreak(entries, person.key, taskFilter ?? undefined);
          return (
            <StatCard
              key={person.key}
              title={person.label}
              value={ticks}
              subtitle={`${consistency}% consistency • 🔥 ${streak.current}d streak`}
              color={person.color}
            />
          );
        })}
      </div>

      {/* Leaderboard */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white/60 mb-4 font-sora uppercase tracking-wider">
          🏆 Leaderboard
        </h3>
        <div className="space-y-3">
          {leaderboard.map((person, index) => (
            <div
              key={person.key}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-lg w-8 text-center font-mono text-white/30">
                #{index + 1}
              </span>
              <PersonBadge label={person.label} color={person.color} />
              <div className="flex-1">
                <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${person.percentage}%`,
                      background: person.color,
                    }}
                  />
                </div>
              </div>
              <div className="w-24 text-right flex flex-col items-end">
                <span className="font-bold font-mono text-white/80">
                  {person.totalTicks}
                </span>
                <span className="text-[10px] text-white/30 font-mono">
                  {person.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart data={barData} title="Total Ticks per Person" />
        <LineChart data={lineData} title="Daily Activity" />
      </div>
    </div>
  );
}
