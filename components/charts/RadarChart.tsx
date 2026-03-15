"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { PEOPLE } from "@/lib/types";

interface RadarChartProps {
  data: Array<Record<string, string | number>>;
  title?: string;
}

export default function RadarChart({ data, title }: RadarChartProps) {
  return (
    <div className="glass-card p-6">
      {title && (
        <h3 className="text-sm font-semibold text-white/60 mb-4 font-sora uppercase tracking-wider">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis
            dataKey="task"
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              background: "#1a1a2e",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              fontFamily: "var(--font-sora)",
            }}
            itemStyle={{ color: "white" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-sora)" }}
          />
          {PEOPLE.map((person) => (
            <Radar
              key={person.key}
              name={person.label}
              dataKey={person.key}
              stroke={person.color}
              fill={person.color}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
