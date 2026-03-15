"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PEOPLE } from "@/lib/types";

interface LineChartProps {
  data: Array<Record<string, string | number>>;
  title?: string;
}

export default function LineChart({ data, title }: LineChartProps) {
  return (
    <div className="glass-card p-6">
      {title && (
        <h3 className="text-sm font-semibold text-white/60 mb-4 font-sora uppercase tracking-wider">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
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
          {PEOPLE.map((person) => (
            <Line
              key={person.key}
              type="monotone"
              dataKey={person.key}
              name={person.label}
              stroke={person.color}
              strokeWidth={2}
              dot={{ r: 3, fill: person.color }}
              activeDot={{ r: 5, fill: person.color }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
