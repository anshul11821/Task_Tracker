"use client";

import { useEffect, useState, useMemo } from "react";
import { Entry, PEOPLE } from "@/lib/types";
import { getRadarData, getMonthlyBarData, getStackedByTask } from "@/lib/data";
import RadarChart from "@/components/charts/RadarChart";
import StackedBar from "@/components/charts/StackedBar";

export default function ChartsPage() {
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

  const radarData = useMemo(() => getRadarData(entries), [entries]);
  const monthlyData = useMemo(() => getMonthlyBarData(entries), [entries]);
  const stackedByTask = useMemo(() => getStackedByTask(entries), [entries]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-white/30 font-sora animate-pulse">Loading charts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Radar Chart */}
      <RadarChart data={radarData} title="Completion % per Person per Task" />

      {/* Monthly Grouped Bar */}
      <StackedBar
        data={monthlyData}
        title="Monthly Totals by Person"
        dataKeyField="month"
        keys={PEOPLE.map((p) => ({ key: p.key, label: p.label, color: p.color }))}
      />

      {/* Stacked Bar by Task */}
      <StackedBar
        data={stackedByTask}
        title="Total Ticks by Task"
        dataKeyField="task"
        keys={PEOPLE.map((p) => ({ key: p.key, label: p.label, color: p.color }))}
      />
    </div>
  );
}
