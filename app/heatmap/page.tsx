"use client";

import { useEffect, useState, useMemo } from "react";
import { Entry, PEOPLE, TASKS, PersonKey } from "@/lib/types";
import { getHeatmapData } from "@/lib/data";
import HeatmapGrid from "@/components/charts/HeatmapGrid";

export default function HeatmapPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<PersonKey>("anshul");
  const [selectedTask, setSelectedTask] = useState<string>("all");
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

  const heatmapData = useMemo(() => {
    return getHeatmapData(
      entries,
      selectedPerson,
      selectedTask === "all" ? undefined : selectedTask,
      2026,
      0,
      2
    );
  }, [entries, selectedPerson, selectedTask]);

  const selectedPersonData = PEOPLE.find((p) => p.key === selectedPerson);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-white/30 font-sora animate-pulse">Loading heatmap...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-wrap gap-6">
          {/* Person Filter */}
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider font-sora mb-3">
              Person
            </label>
            <div className="flex gap-2">
              {PEOPLE.map((person) => (
                <button
                  key={person.key}
                  onClick={() => setSelectedPerson(person.key)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium font-sora transition-all duration-200
                    ${
                      selectedPerson === person.key
                        ? "border text-white"
                        : "bg-dark-surface text-white/40 border border-dark-border hover:text-white/60"
                    }
                  `}
                  style={
                    selectedPerson === person.key
                      ? {
                          background: `${person.color}20`,
                          borderColor: `${person.color}40`,
                          color: person.color,
                        }
                      : {}
                  }
                >
                  {person.label}
                </button>
              ))}
            </div>
          </div>

          {/* Task Filter */}
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider font-sora mb-3">
              Task
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTask("all")}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium font-sora transition-all duration-200
                  ${
                    selectedTask === "all"
                      ? "bg-gradient-to-r from-brand-purple/30 to-brand-blue/20 text-white border border-brand-purple/30"
                      : "bg-dark-surface text-white/40 border border-dark-border hover:text-white/60"
                  }
                `}
              >
                All
              </button>
              {TASKS.map((task) => (
                <button
                  key={task.key}
                  onClick={() => setSelectedTask(task.key)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium font-sora transition-all duration-200
                    ${
                      selectedTask === task.key
                        ? "bg-gradient-to-r from-brand-purple/30 to-brand-blue/20 text-white border border-brand-purple/30"
                        : "bg-dark-surface text-white/40 border border-dark-border hover:text-white/60"
                    }
                  `}
                >
                  {task.icon} {task.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <HeatmapGrid
        data={heatmapData}
        title={`${selectedPersonData?.label}'s Activity — Jan to Mar 2026`}
        maxCount={selectedTask === "all" ? 5 : 1}
      />

      {/* Summary */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white/60 mb-3 font-sora uppercase tracking-wider">
          Summary
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-white/40 font-sora mb-1">Total Active Days</p>
            <p className="text-2xl font-bold font-mono" style={{ color: selectedPersonData?.color }}>
              {heatmapData.filter((d) => d.count > 0).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 font-sora mb-1">Total Completions</p>
            <p className="text-2xl font-bold font-mono" style={{ color: selectedPersonData?.color }}>
              {heatmapData.reduce((sum, d) => sum + d.count, 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 font-sora mb-1">Active Rate</p>
            <p className="text-2xl font-bold font-mono" style={{ color: selectedPersonData?.color }}>
              {Math.round((heatmapData.filter((d) => d.count > 0).length / Math.max(heatmapData.length, 1)) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
