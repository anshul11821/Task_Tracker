"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PEOPLE } from "@/lib/types";

interface StackedBarProps {
  data: Array<Record<string, string | number>>;
  title?: string;
  dataKeyField?: string;
  keys?: Array<{ key: string; label: string; color: string }>;
}

export default function StackedBar({
  data,
  title,
  dataKeyField = "task",
  keys,
}: StackedBarProps) {
  const barKeys = keys || PEOPLE.map((p) => ({ key: p.key, label: p.label, color: p.color }));

  return (
    <div className="glass-card p-6">
      {title && (
        <h3 className="text-sm font-semibold text-white/60 mb-4 font-sora uppercase tracking-wider">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} barSize={30}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey={dataKeyField}
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
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
            labelStyle={{ color: "rgba(255,255,255,0.6)" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-sora)" }}
          />
          {barKeys.map((item) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.label}
              stackId="stack"
              fill={item.color}
              radius={[0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
