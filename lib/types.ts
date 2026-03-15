export const PEOPLE = [
  { key: "anshul", label: "Anshul", color: "#a78bfa" },
  { key: "arsh", label: "Arsh", color: "#38bdf8" },
  { key: "shivraj", label: "Shivraj", color: "#fb923c" },
  { key: "shruti", label: "Shruti", color: "#f472b6" },
] as const;

export const TASKS = [
  { key: "No Junk", label: "No Junk", icon: "🥗" },
  { key: "Water", label: "Water", icon: "💧" },
  { key: "Workout", label: "Workout", icon: "💪" },
  { key: "DSA", label: "DSA", icon: "💻" },
  { key: "Read", label: "Read", icon: "📚" },
] as const;

export type PersonKey = (typeof PEOPLE)[number]["key"];
export type TaskKey = (typeof TASKS)[number]["key"];

export interface Entry {
  id: string;
  date: string;
  task: string;
  anshul: boolean;
  arsh: boolean;
  shivraj: boolean;
  shruti: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface StreakResult {
  current: number;
  best: number;
}

export interface PersonStat {
  key: PersonKey;
  label: string;
  color: string;
  totalTicks: number;
  consistency: number;
  currentStreak: number;
  bestStreak: number;
}
