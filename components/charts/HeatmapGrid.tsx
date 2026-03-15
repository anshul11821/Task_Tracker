"use client";

interface HeatmapDay {
  date: string;
  day: string;
  month: string;
  weekday: number;
  count: number;
}

interface HeatmapGridProps {
  data: HeatmapDay[];
  title?: string;
  maxCount?: number;
}

function getColor(count: number, max: number): string {
  if (count === 0) return "rgba(255,255,255,0.03)";
  const intensity = count / max;
  if (intensity <= 0.25) return "rgba(167, 139, 250, 0.2)";
  if (intensity <= 0.5) return "rgba(167, 139, 250, 0.4)";
  if (intensity <= 0.75) return "rgba(167, 139, 250, 0.65)";
  return "rgba(167, 139, 250, 0.9)";
}

export default function HeatmapGrid({ data, title, maxCount = 5 }: HeatmapGridProps) {
  // Group by month
  const months: Record<string, HeatmapDay[]> = {};
  for (const day of data) {
    if (!months[day.month]) months[day.month] = [];
    months[day.month].push(day);
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="glass-card p-6">
      {title && (
        <h3 className="text-sm font-semibold text-white/60 mb-6 font-sora uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="flex gap-8 overflow-x-auto pb-2">
        {Object.entries(months).map(([month, days]) => (
          <div key={month} className="flex-shrink-0">
            <h4 className="text-xs font-medium text-white/50 mb-3 font-sora text-center">
              {month}
            </h4>
            <div className="flex gap-0.5">
              {/* Weekday labels */}
              <div className="flex flex-col gap-0.5 mr-1">
                {weekdays.map((day) => (
                  <div
                    key={day}
                    className="w-4 h-4 flex items-center justify-center text-[8px] text-white/20 font-mono"
                  >
                    {day[0]}
                  </div>
                ))}
              </div>
              {/* Calendar grid */}
              {(() => {
                const weeks: HeatmapDay[][] = [];
                let currentWeek: HeatmapDay[] = [];

                // Add empty days at the start for the first week
                const firstDay = days[0];
                if (firstDay) {
                  for (let i = 0; i < firstDay.weekday; i++) {
                    currentWeek.push({
                      date: "",
                      day: "",
                      month,
                      weekday: i,
                      count: -1,
                    });
                  }
                }

                for (const day of days) {
                  currentWeek.push(day);
                  if (day.weekday === 6) {
                    weeks.push(currentWeek);
                    currentWeek = [];
                  }
                }
                if (currentWeek.length > 0) weeks.push(currentWeek);

                return weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-0.5">
                    {week.map((day, di) => (
                      <div
                        key={di}
                        className="heatmap-cell w-4 h-4 rounded-[3px] cursor-pointer"
                        style={{
                          background:
                            day.count === -1
                              ? "transparent"
                              : getColor(day.count, maxCount),
                        }}
                        title={
                          day.date
                            ? `${day.date}: ${day.count} tasks`
                            : ""
                        }
                      />
                    ))}
                  </div>
                ));
              })()}
            </div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-6 justify-center">
        <span className="text-xs text-white/30 font-sora">Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((level) => (
          <div
            key={level}
            className="w-3.5 h-3.5 rounded-[3px]"
            style={{
              background: level === 0
                ? "rgba(255,255,255,0.03)"
                : `rgba(167, 139, 250, ${level * 0.9})`,
            }}
          />
        ))}
        <span className="text-xs text-white/30 font-sora">More</span>
      </div>
    </div>
  );
}
