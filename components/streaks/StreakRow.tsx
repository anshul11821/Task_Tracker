import { PEOPLE, PersonKey } from "@/lib/types";

interface StreakRowProps {
  taskLabel: string;
  taskIcon: string;
  streaks: Record<PersonKey, { current: number; best: number }>;
}

export default function StreakRow({ taskLabel, taskIcon, streaks }: StreakRowProps) {
  return (
    <div className="glass-card p-4 hover:border-white/10 transition-all duration-200">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-lg">{taskIcon}</span>
        <span className="font-medium font-sora text-white/80 text-sm">
          {taskLabel}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {PEOPLE.map((person) => {
          const streak = streaks[person.key];
          return (
            <div key={person.key} className="text-center">
              <p
                className="text-xs font-medium mb-1 font-sora"
                style={{ color: person.color }}
              >
                {person.label}
              </p>
              <div className="flex items-center justify-center gap-2">
                <div>
                  <span className="text-lg font-bold font-mono text-white/80">
                    {streak.current}
                  </span>
                  <span className="text-[10px] text-white/30 ml-0.5">now</span>
                </div>
                <div className="text-white/10">|</div>
                <div>
                  <span className="text-sm font-mono text-white/40">
                    {streak.best}
                  </span>
                  <span className="text-[10px] text-white/20 ml-0.5">best</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
